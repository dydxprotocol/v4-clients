mod authenticators;
pub mod error;
mod governance;
mod megavault;
mod methods;

pub use self::authenticators::Authenticator;
pub use self::governance::Governance;
use self::{authenticators::Authenticators, megavault::MegaVault};
use super::{
    builder::TxBuilder, config::NodeConfig, order::*, sequencer::*, utils::*, wallet::Account,
};
pub use crate::indexer::{
    Address, ClientId, Height, OrderFlags, Subaccount, Ticker, Tokenized, Usdc,
};

use anyhow::{anyhow as err, Error, Result};
use bigdecimal::{
    num_bigint::{BigInt, Sign},
    BigDecimal, Signed,
};
#[cfg(feature = "noble")]
use chrono::{TimeDelta, Utc};
use cosmrs::tx::{self, Tx};
use derive_more::{Deref, DerefMut};
use dydx_proto::{
    cosmos_sdk_proto::cosmos::{
        auth::v1beta1::query_client::QueryClient as AuthClient,
        bank::v1beta1::{query_client::QueryClient as BankClient, MsgSend},
        base::{
            abci::v1beta1::GasInfo,
            tendermint::v1beta1::service_client::ServiceClient as BaseClient,
        },
        distribution::v1beta1::query_client::QueryClient as DistributionClient,
        gov::v1::query_client::QueryClient as GovClient,
        staking::v1beta1::query_client::QueryClient as StakingClient,
        tx::v1beta1::{
            service_client::ServiceClient as TxClient, BroadcastMode, BroadcastTxRequest,
            GetTxRequest, SimulateRequest,
        },
    },
    cosmos_sdk_proto::traits::Message,
    dydxprotocol::{
        accountplus::query_client::QueryClient as AccountPlusClient,
        affiliates::{
            query_client::QueryClient as AffiliatesClient, AffiliateInfoRequest,
            AffiliateInfoResponse, AffiliateTiers, AffiliateWhitelist, AffiliateWhitelistRequest,
            AllAffiliateTiersRequest, ReferredByRequest,
        },
        bridge::query_client::QueryClient as BridgeClient,
        clob::{
            query_client::QueryClient as ClobClient, MsgBatchCancel, MsgCancelOrder, MsgPlaceOrder,
            Order, OrderBatch,
        },
        feetiers::query_client::QueryClient as FeeTiersClient,
        listing::MsgCreateMarketPermissionless,
        perpetuals::query_client::QueryClient as PerpetualsClient,
        prices::query_client::QueryClient as PricesClient,
        ratelimit::query_client::QueryClient as RatelimitClient,
        rewards::query_client::QueryClient as RewardsClient,
        sending::{MsgCreateTransfer, MsgDepositToSubaccount, MsgWithdrawFromSubaccount, Transfer},
        stats::query_client::QueryClient as StatsClient,
        subaccounts::{
            query_client::QueryClient as SubaccountsClient,
            QueryGetWithdrawalAndTransfersBlockedInfoRequest,
            QueryGetWithdrawalAndTransfersBlockedInfoResponse, SubaccountId,
        },
        vault::query_client::QueryClient as VaultClient,
    },
    ToAny,
};
pub use error::*;
#[cfg(feature = "noble")]
use ibc_proto::{
    cosmos::base::v1beta1::Coin as IbcProtoCoin,
    ibc::applications::transfer::v1::MsgTransfer as IbcMsgTransfer,
};
use std::iter;
use tokio::time::{sleep, Duration};
use tokio_tungstenite::tungstenite::http::uri::PathAndQuery;
use tonic::codec::ProstCodec;
use tonic::{
    client::Grpc,
    transport::{Channel, ClientTlsConfig},
    Code,
};
use tower::timeout::Timeout;

#[cfg(feature = "telemetry")]
use crate::telemetry::{
    LatencyMetric, TELEMETRY_BATCH_CANCEL_ORDER_DURATION, TELEMETRY_CANCEL_ORDER_DURATION,
    TELEMETRY_DESC_BATCH_CANCEL_ORDER_DURATION, TELEMETRY_DESC_CANCEL_ORDER_DURATION,
    TELEMETRY_DESC_ORDERS_CANCELLED, TELEMETRY_DESC_ORDERS_PLACED,
    TELEMETRY_DESC_PLACE_ORDER_DURATION, TELEMETRY_DESC_QUERY_TX_DURATION, TELEMETRY_LABEL_ADDRESS,
    TELEMETRY_ORDERS_CANCELLED, TELEMETRY_ORDERS_PLACED, TELEMETRY_PLACE_ORDER_DURATION,
    TELEMETRY_QUERY_TX_DURATION,
};

const DEFAULT_QUERY_TIMEOUT_SECS: u64 = 15;
const DEFAULT_QUERY_INTERVAL_SECS: u64 = 2;

/// Transaction hash.
///
/// internally Cosmos uses tendermint::Hash
pub type TxHash = String;

/// Wrapper over standard [Cosmos modules](https://github.com/cosmos/cosmos-sdk/tree/main/x) clients
/// and [dYdX modules](https://github.com/dydxprotocol/v4-chain/tree/main/protocol/x) clients.
pub struct Routes {
    /// Smart account features, includes authenticators.
    pub accountplus: AccountPlusClient<Timeout<Channel>>,
    // Affiliates
    pub affiliates: AffiliatesClient<Timeout<Channel>>,
    /// Authentication of accounts and transactions for Cosmos SDK applications.
    pub auth: AuthClient<Timeout<Channel>>,
    /// Token transfer functionalities.
    pub bank: BankClient<Timeout<Channel>>,
    /// Basic network information.
    pub base: BaseClient<Timeout<Channel>>,
    /// dYdX bridge to Ethereum
    pub bridge: BridgeClient<Timeout<Channel>>,
    /// dYdX orderbook
    pub clob: ClobClient<Timeout<Channel>>,
    /// dYdX distribution
    pub distribution: DistributionClient<Timeout<Channel>>,
    /// dYdX fees
    pub feetiers: FeeTiersClient<Timeout<Channel>>,
    /// dYdX perpetuals
    pub perpetuals: PerpetualsClient<Timeout<Channel>>,
    /// dYdX prices
    pub prices: PricesClient<Timeout<Channel>>,
    /// dYdX ratelimit
    pub ratelimit: RatelimitClient<Timeout<Channel>>,
    /// dYdX rewards
    pub rewards: RewardsClient<Timeout<Channel>>,
    /// dYdX governance
    pub governance: GovClient<Timeout<Channel>>,
    /// Proof-of-Stake layer for public blockchains.
    pub staking: StakingClient<Timeout<Channel>>,
    /// dYdX stats
    pub stats: StatsClient<Timeout<Channel>>,
    /// dYdX subaccounts
    pub subaccounts: SubaccountsClient<Timeout<Channel>>,
    /// Tx utilities for the Cosmos SDK.
    pub tx: TxClient<Timeout<Channel>>,
    /// Query client
    pub query: Grpc<Timeout<Channel>>,
    /// Vaults
    pub vault: VaultClient<Timeout<Channel>>,
}

impl Routes {
    /// Creates new modules clients wrapper.
    pub fn new(channel: Timeout<Channel>) -> Self {
        Self {
            accountplus: AccountPlusClient::new(channel.clone()),
            affiliates: AffiliatesClient::new(channel.clone()),
            auth: AuthClient::new(channel.clone()),
            bank: BankClient::new(channel.clone()),
            base: BaseClient::new(channel.clone()),
            bridge: BridgeClient::new(channel.clone()),
            clob: ClobClient::new(channel.clone()),
            distribution: DistributionClient::new(channel.clone()),
            feetiers: FeeTiersClient::new(channel.clone()),
            perpetuals: PerpetualsClient::new(channel.clone()),
            prices: PricesClient::new(channel.clone()),
            ratelimit: RatelimitClient::new(channel.clone()),
            rewards: RewardsClient::new(channel.clone()),
            governance: GovClient::new(channel.clone()),
            staking: StakingClient::new(channel.clone()),
            stats: StatsClient::new(channel.clone()),
            subaccounts: SubaccountsClient::new(channel.clone()),
            tx: TxClient::new(channel.clone()),
            query: Grpc::new(channel.clone()),
            vault: VaultClient::new(channel),
        }
    }
}

/// Node (validator) client.
///
/// Serves to manage [orders](OrderBuilder) and funds, query transactions.
#[derive(Deref, DerefMut)]
pub struct NodeClient {
    config: NodeConfig,
    /// Transactions builder.
    pub builder: TxBuilder,
    #[deref]
    #[deref_mut]
    routes: Routes,
    sequencer: Box<dyn Sequencer>,
}

impl NodeClient {
    /// Connect to the node.
    pub async fn connect(config: NodeConfig) -> Result<Self, Error> {
        let tls = ClientTlsConfig::new().with_native_roots();
        let endpoint = config.endpoint.clone();
        let channel = Channel::from_shared(endpoint)?
            .tls_config(tls)?
            .connect()
            .await?;
        let timeout = Duration::from_millis(config.timeout);
        let timeout_channel = Timeout::new(channel, timeout);
        let chain_id = config.chain_id.clone().try_into()?;
        let builder = TxBuilder::new(chain_id, config.fee_denom.clone());
        let sequencer = Box::new(QueryingSequencer::new(timeout_channel.clone()));

        #[cfg(feature = "telemetry")]
        {
            metrics::describe_counter!(
                TELEMETRY_ORDERS_PLACED,
                metrics::Unit::Count,
                TELEMETRY_DESC_ORDERS_PLACED
            );
            metrics::describe_counter!(
                TELEMETRY_ORDERS_CANCELLED,
                metrics::Unit::Count,
                TELEMETRY_DESC_ORDERS_CANCELLED
            );
            metrics::describe_histogram!(
                TELEMETRY_PLACE_ORDER_DURATION,
                metrics::Unit::Milliseconds,
                TELEMETRY_DESC_PLACE_ORDER_DURATION
            );
            metrics::describe_histogram!(
                TELEMETRY_CANCEL_ORDER_DURATION,
                metrics::Unit::Milliseconds,
                TELEMETRY_DESC_CANCEL_ORDER_DURATION
            );
            metrics::describe_histogram!(
                TELEMETRY_BATCH_CANCEL_ORDER_DURATION,
                metrics::Unit::Milliseconds,
                TELEMETRY_DESC_BATCH_CANCEL_ORDER_DURATION
            );
            metrics::describe_histogram!(
                TELEMETRY_QUERY_TX_DURATION,
                metrics::Unit::Milliseconds,
                TELEMETRY_DESC_QUERY_TX_DURATION
            );
        }

        Ok(Self {
            config,
            builder,
            routes: Routes::new(timeout_channel),
            sequencer,
        })
    }

    /// Set `NodeClient`'s account sequence number mechanism
    pub fn with_sequencer(&mut self, sequencer: impl Sequencer) {
        self.sequencer = Box::new(sequencer);
    }

    /// Place [`Order`].
    ///
    /// Check [the short-order example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/place_order_short_term.rs)
    /// and [the long-term order example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/place_order_long_term.rs).
    pub async fn place_order(
        &mut self,
        account: &mut Account,
        order: Order,
    ) -> Result<TxHash, NodeError> {
        #[cfg(feature = "telemetry")]
        LatencyMetric::new(TELEMETRY_PLACE_ORDER_DURATION);
        let is_short_term = order
            .order_id
            .as_ref()
            .is_some_and(|id| id.order_flags == OrderFlags::ShortTerm as u32);

        // Check if order requires authorization
        let mut auth = None;
        if is_short_term {
            let order_for = &order
                .order_id
                .as_ref()
                .ok_or_else(|| err!("Order does not have an ID"))?
                .subaccount_id
                .as_ref()
                .ok_or_else(|| err!("Order does not have a subaccount ID"))?
                .owner;
            if order_for != account.address().as_ref() {
                auth = Some(order_for.parse::<Address>()?);
            }
        }

        let msg = MsgPlaceOrder { order: Some(order) };

        let tx_raw = self
            .create_base_transaction(account, msg, !is_short_term, auth.as_ref())
            .await?;

        let tx_hash = self.broadcast_transaction(tx_raw).await?;

        #[cfg(feature = "telemetry")]
        {
            let address = account.address();
            metrics::counter!(
                TELEMETRY_ORDERS_PLACED,
                &[(TELEMETRY_LABEL_ADDRESS, address.to_string())]
            )
            .increment(1);
        }

        Ok(tx_hash)
    }

    /// Cancel [`Order`].
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/cancel_order.rs).
    pub async fn cancel_order(
        &mut self,
        account: &mut Account,
        order_id: OrderId,
        until: impl Into<OrderGoodUntil>,
    ) -> Result<TxHash, NodeError> {
        #[cfg(feature = "telemetry")]
        LatencyMetric::new(TELEMETRY_CANCEL_ORDER_DURATION);

        let until = until.into();
        let msg = MsgCancelOrder {
            order_id: Some(order_id),
            good_til_oneof: Some(until.try_into()?),
        };

        let tx_raw = self
            .create_base_transaction(account, msg, true, None)
            .await?;

        let tx_hash = self.broadcast_transaction(tx_raw).await?;

        #[cfg(feature = "telemetry")]
        {
            let address = account.address();
            metrics::counter!(
                TELEMETRY_ORDERS_CANCELLED,
                &[(TELEMETRY_LABEL_ADDRESS, address.to_string())]
            )
            .increment(1);
        }

        Ok(tx_hash)
    }

    /// Cancel a batch of short-terms [`Order`]s.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/batch_cancel_orders.rs).
    pub async fn batch_cancel_orders(
        &mut self,
        account: &mut Account,
        subaccount: Subaccount,
        short_term_cancels: Vec<OrderBatch>,
        until_block: Height,
    ) -> Result<TxHash, NodeError> {
        #[cfg(feature = "telemetry")]
        LatencyMetric::new(TELEMETRY_BATCH_CANCEL_ORDER_DURATION);

        #[cfg(feature = "telemetry")]
        let count: u64 = short_term_cancels
            .iter()
            .map(|batch| batch.client_ids.len() as u64)
            .sum();

        let msg = MsgBatchCancel {
            subaccount_id: Some(subaccount.into()),
            short_term_cancels,
            good_til_block: until_block.0,
        };

        let tx_raw = self
            .create_base_transaction(account, msg, true, None)
            .await?;

        let tx_hash = self.broadcast_transaction(tx_raw).await?;

        #[cfg(feature = "telemetry")]
        {
            let address = account.address();
            metrics::counter!(
                TELEMETRY_ORDERS_CANCELLED,
                &[(TELEMETRY_LABEL_ADDRESS, address.to_string())]
            )
            .increment(count);
        }

        Ok(tx_hash)
    }

    /// Deposit funds (USDC) from the address to the subaccount.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/deposit.rs).
    pub async fn deposit(
        &mut self,
        account: &mut Account,
        sender: Address,
        recipient: Subaccount,
        amount: impl Into<Usdc>,
    ) -> Result<TxHash, NodeError> {
        let msg = MsgDepositToSubaccount {
            sender: sender.to_string(),
            recipient: Some(recipient.into()),
            asset_id: 0,
            quantums: amount.into().quantize_as_u64()?,
        };

        let tx_raw = self.create_transaction(account, msg, None).await?;

        self.broadcast_transaction(tx_raw).await
    }

    /// Withdraw funds (USDC) from the subaccount to the address.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/withdraw.rs).
    pub async fn withdraw(
        &mut self,
        account: &mut Account,
        sender: Subaccount,
        recipient: Address,
        amount: impl Into<Usdc>,
    ) -> Result<TxHash, NodeError> {
        let msg = MsgWithdrawFromSubaccount {
            sender: Some(sender.into()),
            recipient: recipient.to_string(),
            asset_id: 0,
            quantums: amount.into().quantize_as_u64()?,
        };

        let tx_raw = self.create_transaction(account, msg, None).await?;

        self.broadcast_transaction(tx_raw).await
    }

    /// Transfer funds (USDC) between subaccounts.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/transfer.rs).
    pub async fn transfer(
        &mut self,
        account: &mut Account,
        sender: Subaccount,
        recipient: Subaccount,
        amount: impl Into<Usdc>,
    ) -> Result<TxHash, NodeError> {
        let transfer = Transfer {
            sender: Some(sender.into()),
            recipient: Some(recipient.into()),
            asset_id: 0,
            amount: amount.into().quantize_as_u64()?,
        };
        let msg = MsgCreateTransfer {
            transfer: Some(transfer),
        };

        let tx_raw = self.create_transaction(account, msg, None).await?;

        self.broadcast_transaction(tx_raw).await
    }

    /// Transfer a token asset from one address to another one.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/send_token.rs).
    pub async fn send_token(
        &mut self,
        account: &mut Account,
        sender: Address,
        recipient: Address,
        token: impl Tokenized,
    ) -> Result<TxHash, NodeError> {
        let msg = MsgSend {
            from_address: sender.to_string(),
            to_address: recipient.to_string(),
            amount: vec![token.coin()?],
        };

        let tx_raw = self.create_transaction(account, msg, None).await?;

        self.broadcast_transaction(tx_raw).await
    }

    /// Transfer a token asset between blockchain networks.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/noble_transfer.rs).
    #[cfg(feature = "noble")]
    pub async fn send_token_ibc(
        &mut self,
        account: &mut Account,
        sender: Address,
        recipient: Address,
        token: impl Tokenized,
        source_channel: String,
    ) -> Result<TxHash, NodeError> {
        let coin = token.coin()?;
        let timeout = (Utc::now() + TimeDelta::seconds(60))
            .timestamp_nanos_opt()
            .ok_or_else(|| err!("Failed calculating timeout ns timestamp"))?
            .try_into()
            .map_err(|e| err!("Failed converting timestamp into u64: {e}"))?;

        let msg = IbcMsgTransfer {
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

        let tx_raw = self.create_transaction(account, msg, None).await?;

        self.broadcast_transaction(tx_raw).await
    }

    /// Close position for a given market.
    ///
    /// Opposite short-term market orders are used.
    /// If provided, the position is only reduced by a size of `reduce_by`.
    /// Note that at the moment dYdX [doesn't support](https://dydx.exchange/faq) spot trading.
    ///
    /// Check [the first example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/close_position.rs)
    /// and [the second example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/close_all_positions.rs).
    pub async fn close_position(
        &mut self,
        account: &mut Account,
        subaccount: Subaccount,
        market_params: impl Into<OrderMarketParams>,
        reduce_by: Option<BigDecimal>,
        client_id: impl Into<ClientId>,
    ) -> Result<Option<TxHash>, NodeError> {
        let subaccount_info = self.get_subaccount(&subaccount).await?;
        let market_params = market_params.into();
        let quantums_opt = subaccount_info
            .perpetual_positions
            .into_iter()
            .find(|pos| pos.perpetual_id == market_params.clob_pair_id.0)
            .map(|pos| BigInt::from_serializable_int(&pos.quantums))
            .transpose()?;

        let (side, size) = if let Some(quantums) = quantums_opt {
            let side = match quantums.sign() {
                Sign::Plus => OrderSide::Sell,
                Sign::Minus => OrderSide::Buy,
                _ => return Ok(None),
            };
            let mut size = market_params.dequantize_quantums(quantums.abs());
            if let Some(reduce_by) = reduce_by {
                // The quantity to reduce by should not be larger than the
                // current position
                size = size.min(reduce_by);
            }
            (side, size)
        } else {
            return Ok(None);
        };

        let height = self.latest_block_height().await?;

        let (_, order) = OrderBuilder::new(market_params, subaccount.clone())
            .market(side, size)
            .until(height.ahead(SHORT_TERM_ORDER_MAXIMUM_LIFETIME))
            .build(client_id.into())?;
        let tx_hash = self.place_order(account, order).await?;

        Ok(Some(tx_hash))
    }

    /// Access the vaults requests dispatcher
    pub fn megavault(&mut self) -> MegaVault {
        MegaVault::new(self)
    }

    /// Access the governance requests dispatcher
    pub fn governance(&mut self) -> Governance {
        Governance::new(self)
    }

    /// Access the authenticators/permissioned keys requests dispatcher.
    ///
    /// See the [example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/authenticator.rs).
    pub fn authenticators(&mut self) -> Authenticators {
        Authenticators::new(self)
    }

    /// Create a market permissionless
    pub async fn create_market_permissionless(
        &mut self,
        account: &mut Account,
        ticker: &Ticker,
        subaccount: &Subaccount,
    ) -> Result<TxHash, NodeError> {
        let subaccount_id = SubaccountId {
            owner: subaccount.address.to_string(),
            number: subaccount.number.0,
        };
        let msg = MsgCreateMarketPermissionless {
            ticker: ticker.to_string(),
            subaccount_id: Some(subaccount_id),
        };

        let tx_raw = self.create_transaction(account, msg, None).await?;

        self.broadcast_transaction(tx_raw).await
    }

    /// Simulate a transaction.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/withdraw_other.rs).
    pub async fn simulate(&mut self, tx_raw: &tx::Raw) -> Result<GasInfo, NodeError> {
        let request = SimulateRequest {
            tx_bytes: tx_raw
                .to_bytes()
                .map_err(|e| err!("Raw Tx to bytes failed: {}", e))?,
            ..Default::default()
        };

        // Move to client/methods.rs
        self.tx
            .simulate(request)
            .await
            .map_err(BroadcastError::from)?
            .into_inner()
            .gas_info
            .ok_or_else(|| err!("Tx simulation request failed, gas info should exist.").into())
    }

    /// Fetch account's number and sequence number from the network.
    pub async fn query_address(&mut self, address: &Address) -> Result<(u64, u64), Error> {
        self.get_account(address)
            .await
            .map(|res| (res.account_number, res.sequence))
    }

    /// Create a transaction.
    pub async fn create_transaction(
        &mut self,
        account: &mut Account,
        msg: impl ToAny,
        auth: Option<&Address>,
    ) -> Result<tx::Raw, NodeError> {
        let tx_raw = self
            .create_base_transaction(account, msg, true, auth)
            .await?;
        let tx_bytes = tx_raw
            .to_bytes()
            .map_err(|e| err!("Raw Tx to bytes failed: {e}"))?;
        let tx = Tx::from_bytes(&tx_bytes)
            .map_err(|e| err!("Failed to decode received Tx bytes: {e}"))?;

        let simulated = self.simulate(&tx_raw).await?;
        let gas = simulated.gas_used;
        let fee = self.builder.calculate_fee(Some(gas))?;
        self.builder
            .build_transaction(account, tx.body.messages, Some(fee), None)
            .map_err(|e| e.into())
    }

    async fn create_base_transaction(
        &mut self,
        account: &mut Account,
        msg: impl ToAny,
        seqnum_required: bool,
        auth: Option<&Address>,
    ) -> Result<tx::Raw, Error> {
        if seqnum_required && self.config.manage_sequencing {
            if let Some(authing) = auth {
                if let Some((master, _)) = account.authenticators_mut().get_mut(authing) {
                    let nonce = self.sequencer.next_nonce(master.address()).await?;
                    master.set_next_nonce(nonce);
                }
            } else {
                let nonce = self.sequencer.next_nonce(account.address()).await?;
                account.set_next_nonce(nonce);
            }
        } else if !seqnum_required {
            if let Some(authing) = auth {
                if let Some((master, _)) = account.authenticators_mut().get_mut(authing) {
                    master.set_next_nonce(Nonce::Sequence(master.sequence_number()));
                }
            } else {
                account.set_next_nonce(Nonce::Sequence(account.sequence_number()));
            }
        }

        self.builder
            .build_transaction(account, iter::once(msg.to_any()), None, auth)
    }

    /// Broadcast a transaction
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/withdraw_other.rs).
    pub async fn broadcast_transaction(&mut self, tx_raw: tx::Raw) -> Result<TxHash, NodeError> {
        let request = BroadcastTxRequest {
            tx_bytes: tx_raw
                .to_bytes()
                .map_err(|e| err!("Raw Tx to bytes failed: {}", e))?,
            mode: BroadcastMode::Sync.into(),
        };

        let response = self
            .tx
            .broadcast_tx(request)
            .await
            .map_err(BroadcastError::from)?
            .into_inner()
            .tx_response
            .ok_or_else(|| err!("Tx not present in broadcast response"))?;

        if response.code == 0 {
            Ok(response.txhash)
        } else {
            Err(NodeError::Broadcast(BroadcastError {
                code: Some(response.code),
                message: response.raw_log,
            }))
        }
    }

    /// Generic query method.
    ///
    /// Note: specify the return type explicitly, to avoid warnings.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn send_query<I, O>(&mut self, msg: I, method: &'static str) -> Result<O, Error>
    where
        I: 'static + ToAny,
        O: Message + Default + 'static,
    {
        let path = PathAndQuery::from_static(method);
        let req = tonic::Request::new(msg);

        self.query
            .ready()
            .await
            .map_err(|e| err!("Service was not ready: {e}"))?;

        let response: tonic::Response<O> =
            self.query.unary(req, path, ProstCodec::default()).await?;

        Ok(response.into_inner())
    }

    /// Query the network for a transaction
    pub async fn query_transaction(&mut self, tx_hash: &TxHash) -> Result<Tx, Error> {
        #[cfg(feature = "telemetry")]
        LatencyMetric::new(TELEMETRY_QUERY_TX_DURATION);

        let attempts = DEFAULT_QUERY_TIMEOUT_SECS / DEFAULT_QUERY_INTERVAL_SECS;
        for _ in 0..attempts {
            match self
                .tx
                .get_tx(GetTxRequest {
                    hash: tx_hash.clone(),
                })
                .await
            {
                Ok(r) => {
                    let response = r
                        .into_inner()
                        .tx_response
                        .ok_or_else(|| err!("Tx not present in broadcast response"))?;
                    let tx_bytes = response
                        .tx
                        .ok_or_else(|| err!("TxResponse does not contain Tx bytes!"))?
                        .value;
                    let tx = Tx::from_bytes(&tx_bytes)
                        .map_err(|e| err!("Failed to decode received Tx bytes: {e}"))?;
                    return Ok(tx);
                }
                Err(status) if status.code() == Code::NotFound => {
                    sleep(Duration::from_secs(DEFAULT_QUERY_INTERVAL_SECS)).await;
                }
                Err(status) => {
                    return Err(err!("Error querying Tx {tx_hash}: {status}"));
                }
            }
        }
        Err(err!("Tx {tx_hash} not found after timeout"))
    }

    /// Query the network for a transaction result
    pub async fn query_transaction_result(
        &mut self,
        tx_hash: Result<TxHash, NodeError>,
    ) -> Result<Option<Tx>, Error> {
        match tx_hash {
            Ok(tx_hash) => self.query_transaction(&tx_hash).await.map(Some),
            Err(NodeError::Broadcast(err)) if err.get_collateral_reason().is_some() => Ok(None),
            Err(err) => Err(err.into()),
        }
    }

    /// Query the withrawal and transfer gating status.
    /// Information about whether withdrawals and transfers are blocked for
    /// a collateral pool associated with the passed in perpetual ID.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_withdrawal_and_transfer_gating_status(
        &mut self,
        perpetual_id: u32,
    ) -> Result<QueryGetWithdrawalAndTransfersBlockedInfoResponse, Error> {
        let req = QueryGetWithdrawalAndTransfersBlockedInfoRequest { perpetual_id };

        let info = self
            .subaccounts
            .get_withdrawal_and_transfers_blocked_info(req)
            .await?
            .into_inner();

        Ok(info)
    }

    /// Query the affiliate info for the given address.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_affiliate_info(
        &mut self,
        address: &Address,
    ) -> Result<AffiliateInfoResponse, Error> {
        let request = AffiliateInfoRequest {
            address: address.to_string(),
        };

        let response = self.affiliates.affiliate_info(request).await?;

        Ok(response.into_inner())
    }

    /// Query the affiliate that referred the given address.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_referred_by(&mut self, address: Address) -> Result<Address, Error> {
        let req = ReferredByRequest {
            address: address.into(),
        };
        let affiliate = self
            .affiliates
            .referred_by(req)
            .await?
            .into_inner()
            .affiliate_address;
        Ok(affiliate.into())
    }

    /// Query for the affiliate tiers.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_all_affiliate_tiers(&mut self) -> Result<AffiliateTiers, Error> {
        let req = AllAffiliateTiersRequest {};
        let tiers = self
            .affiliates
            .all_affiliate_tiers(req)
            .await?
            .into_inner()
            .tiers
            .ok_or_else(|| {
                err!("AllAffiliateTiers query response does not contain affiliate list")
            })?;
        Ok(tiers)
    }

    /// Query for the whitelisted affiliates.
    /// If an address is in the whitelist, then the affiliate fee share in
    /// this object will override fee share from the regular affiliate tiers.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_affiliate_whitelist(&mut self) -> Result<AffiliateWhitelist, Error> {
        let req = AffiliateWhitelistRequest {};
        let whitelist = self
            .affiliates
            .affiliate_whitelist(req)
            .await?
            .into_inner()
            .whitelist
            .ok_or_else(|| err!("AffiliateWhiteList query response does not contain whitelist"))?;
        Ok(whitelist)
    }
}
