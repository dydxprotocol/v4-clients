mod config;
mod tokens;
use crate::{
    indexer::{Address, Denom, Tokenized},
    node::{Account, TxBuilder, TxHash},
};
use anyhow::{anyhow as err, Error};
use chrono::{TimeDelta, Utc};
pub use config::NobleConfig;
use cosmrs::tx::{self, Tx};
use ibc_proto::{
    cosmos::base::v1beta1::Coin as IbcProtoCoin, ibc::applications::transfer::v1::MsgTransfer,
};
pub use tokens::NobleUsdc;
use tokio::time::Duration;
use tonic::transport::{Channel, ClientTlsConfig};
use tower::timeout::Timeout;
use v4_proto_rs::{
    cosmos_sdk_proto::cosmos::{
        auth::v1beta1::{
            query_client::QueryClient as AuthClient, BaseAccount, QueryAccountRequest,
        },
        bank::v1beta1::{
            query_client::QueryClient as BankClient, QueryAllBalancesRequest, QueryBalanceRequest,
        },
        base::{abci::v1beta1::GasInfo, v1beta1::Coin},
        tx::v1beta1::{
            service_client::ServiceClient as TxClient, BroadcastMode, BroadcastTxRequest,
            SimulateRequest,
        },
    },
    ToAny,
};

/// Wrapper over standard [Cosmos modules](https://github.com/cosmos/cosmos-sdk/tree/main/x) clients.
pub struct Routes {
    /// Authentication of accounts and transactions for Cosmos SDK applications.
    pub auth: AuthClient<Timeout<Channel>>,
    /// Token transfer functionalities.
    pub bank: BankClient<Timeout<Channel>>,
    /// Tx utilities for the Cosmos SDK.
    pub tx: TxClient<Timeout<Channel>>,
}

impl Routes {
    /// Creates new modules clients wrapper.
    pub fn new(channel: Timeout<Channel>) -> Self {
        Self {
            auth: AuthClient::new(channel.clone()),
            bank: BankClient::new(channel.clone()),
            tx: TxClient::new(channel),
        }
    }
}

/// Noble client.
pub struct NobleClient {
    builder: TxBuilder,
    #[allow(dead_code)]
    config: NobleConfig,
    routes: Routes,
}

impl NobleClient {
    /// Connect to the node.
    pub async fn connect(config: NobleConfig) -> Result<Self, Error> {
        let tls = ClientTlsConfig::new();
        let endpoint = config.endpoint.clone();
        let channel = Channel::from_shared(endpoint)?
            .tls_config(tls)?
            .connect()
            .await?;
        let timeout = Duration::from_millis(config.timeout);
        let timeout_channel = Timeout::new(channel, timeout);
        let builder = TxBuilder::new(config.chain_id.clone(), config.fee_denom.clone());

        Ok(Self {
            builder,
            config,
            routes: Routes::new(timeout_channel),
        })
    }

    /// Query all balances of an account/address.
    pub async fn get_account_balances(&mut self, address: Address) -> Result<Vec<Coin>, Error> {
        let req = QueryAllBalancesRequest {
            address: address.to_string(),
            pagination: None,
        };
        let balances = self
            .routes
            .bank
            .all_balances(req)
            .await?
            .into_inner()
            .balances;
        Ok(balances)
    }

    /// Query token balance of an account/address.
    pub async fn get_account_balance(
        &mut self,
        address: Address,
        denom: &Denom,
    ) -> Result<Coin, Error> {
        let req = QueryBalanceRequest {
            address: address.into(),
            denom: denom.to_string(),
        };
        let balance = self
            .routes
            .bank
            .balance(req)
            .await?
            .into_inner()
            .balance
            .ok_or_else(|| err!("Balance query response does not contain balance"))?;
        Ok(balance)
    }

    /// Query for [an account](https://github.com/cosmos/cosmos-sdk/tree/main/x/auth#account-1)
    /// by it's address.
    pub async fn get_account(&mut self, address: &Address) -> Result<BaseAccount, Error> {
        let req = QueryAccountRequest {
            address: address.to_string(),
        };
        let resp = self
            .routes
            .auth
            .account(req)
            .await?
            .into_inner()
            .account
            .ok_or_else(|| err!("Query account request failure, account should exist."))?
            .to_msg()?;
        Ok(resp)
    }

    async fn simulate(&mut self, tx_raw: &tx::Raw) -> Result<GasInfo, Error> {
        let request = SimulateRequest {
            tx_bytes: tx_raw
                .to_bytes()
                .map_err(|e| err!("Raw Tx to bytes failed: {}", e))?,
            ..Default::default()
        };

        let gas = self
            .routes
            .tx
            .simulate(request)
            .await?
            .into_inner()
            .gas_info
            .ok_or_else(|| err!("Tx simulation request failed, gas info should exist."))?;
        Ok(gas)
    }

    /// Fetch account's number and sequence number from the network.
    pub async fn query_address(&mut self, address: &Address) -> Result<(u64, u64), Error> {
        self.get_account(address)
            .await
            .map(|res| (res.account_number, res.sequence))
    }

    /// Transfer a token asset between Cosmos blockchain networks.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/noble_transfer.rs).
    pub async fn send_token_ibc(
        &mut self,
        account: &mut Account,
        sender: Address,
        recipient: Address,
        token: impl Tokenized,
        source_channel: String,
    ) -> Result<TxHash, Error> {
        let coin = token.coin()?;
        let timeout = (Utc::now() + TimeDelta::seconds(60))
            .timestamp_nanos_opt()
            .ok_or_else(|| err!("Failed calculating timeout ns timestamp"))?
            .try_into()?;

        let msg = MsgTransfer {
            receiver: recipient.to_string(),
            sender: sender.to_string(),
            source_port: "transfer".to_string(),
            source_channel,
            timeout_timestamp: timeout,
            token: Some(IbcProtoCoin {
                amount: coin.amount,
                denom: coin.denom,
            }),
            timeout_height: None,
            memo: Default::default(),
        };

        if self.config.manage_sequencing {
            let (_, sequence_number) = self.query_address(account.address()).await?;
            account.set_sequence_number(sequence_number);
        }

        let tx_raw =
            self.builder
                .build_transaction(account, std::iter::once(msg.to_any()), None)?;

        let simulated = self.simulate(&tx_raw).await?;
        let gas = simulated.gas_used;
        let fee = self.builder.calculate_fee(Some(gas))?;

        let tx_bytes = tx_raw
            .to_bytes()
            .map_err(|e| err!("Raw Tx to bytes failed: {e}"))?;
        let tx = Tx::from_bytes(&tx_bytes).map_err(|e| err!("Failed to decode Tx bytes: {e}"))?;
        self.builder
            .build_transaction(account, tx.body.messages, Some(fee))?;

        let request = BroadcastTxRequest {
            tx_bytes: tx_raw
                .to_bytes()
                .map_err(|e| err!("Raw Tx to bytes failed: {}", e))?,
            mode: BroadcastMode::Sync.into(),
        };

        let response = self
            .routes
            .tx
            .broadcast_tx(request)
            .await?
            .into_inner()
            .tx_response
            .ok_or_else(|| err!("Tx not present in broadcast response"))?;

        if response.code == 0 {
            Ok(response.txhash)
        } else {
            Err(err!(
                "Tx broadcast failed with error {}: {}",
                response.code,
                response.raw_log,
            ))
        }
    }
}
