//! Permissioned keys/authenticators example.
//! For more information see [the docs](https://docs.dydx.xyz/interaction/permissioned-keys).

mod support;
use anyhow::{Error, Result};
use bigdecimal::BigDecimal;
use dydx::config::ClientConfig;
use dydx::indexer::{IndexerClient, Subaccount};
use dydx::node::{
    Account, Authenticator, NodeClient, OrderBuilder, OrderSide, PublicAccount, Wallet,
};
use dydx_proto::dydxprotocol::clob::order::TimeInForce;
use std::str::FromStr;
use support::constants::TEST_MNEMONIC;
use tokio::time::{sleep, Duration};

const ETH_USD_TICKER: &str = "ETH-USD";

pub struct Trader {
    client: NodeClient,
    indexer: IndexerClient,
    account: Account,
}

impl Trader {
    pub async fn connect(index: u32) -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let mut client = NodeClient::connect(config.node).await?;
        let indexer = IndexerClient::new(config.indexer);
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        let account = wallet.account(index, &mut client).await?;
        Ok(Self {
            client,
            indexer,
            account,
        })
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    #[cfg(feature = "telemetry")]
    support::telemetry::metrics_dashboard().await?;

    // We will just create two (isolated) accounts using the same mnemonic.
    // In a more realistic setting each user would have its own mnemonic/wallet.
    let mut master = Trader::connect(0).await?;
    let master_address = master.account.address().clone();
    let mut permissioned = Trader::connect(1).await?;

    // -- Permissioning account actions --

    log::info!("[master] Creating the authenticator.");

    // For permissioned trading, the permissioned account needs an associated authenticator ID,
    // created by the permissioning account.
    // An authenticator declares the conditions/permissions that allow the permissioned account to
    // trade under.
    let authenticator = Authenticator::AllOf(vec![
        // The permissioned account needs to share its public key with the permissioning account.
        // Through other channels, users can share their public keys using hex strings, e.g.,
        // let keystring = hex::encode(&account.public_key().to_bytes())
        // let bytes = hex::decode(&keystring);
        Authenticator::SignatureVerification(permissioned.account.public_key().to_bytes()),
        // The allowed actions. Several message types are allowed to be defined, separated by commas.
        Authenticator::MessageFilter("/dydxprotocol.clob.MsgPlaceOrder".into()),
        // The allowed markets. Several IDs allowed to be defined.
        Authenticator::ClobPairIdFilter("0,1".into()),
        // The allowed subaccounts. Several subaccounts allowed to be defined.
        Authenticator::SubaccountFilter("0".into()),
        // A transaction will only be accepted if all conditions above are satisfied.
        // Alternatively, `Authenticator::AnyOf` can be used.
        // If only one condition was declared (if so, it must be a `Authenticator::SignatureVerification`),
        // `AllOf` or `AnyOf` should not be used.
    ]);

    // Broadcast the built authenticator.
    master
        .client
        .authenticators()
        .add(&mut master.account, master_address.clone(), authenticator)
        .await?;

    sleep(Duration::from_secs(3)).await;

    // -- Permissioned account actions --

    log::info!("[trader] Fetching the authenticator.");

    // The permissioned account needs then to acquire the ID associated with the authenticator.
    // Here, we will just grab the last authenticator ID pushed under the permissioning account.
    let id = permissioned
        .client
        .authenticators()
        .list(master_address.clone())
        .await?
        .last()
        .unwrap()
        .id;

    // The permissioned account then adds that ID.
    // An updated `PublicAccount` account, representing the permissioner, needs to be created.
    let external_account =
        PublicAccount::updated(master_address.clone(), &mut permissioned.client).await?;
    permissioned
        .account
        .authenticators_mut()
        .add(external_account, id);

    let master_subaccount = Subaccount {
        address: master_address.clone(),
        number: 0.try_into()?,
    };

    log::info!("[trader] Creating the order. Using authenticator ID {id}.");

    // Create an order as usual, however for the permissioning account's subaccount.
    let market = permissioned
        .indexer
        .markets()
        .get_perpetual_market(&ETH_USD_TICKER.into())
        .await?;
    let current_block_height = permissioned.client.get_latest_block_height().await?;

    let size = BigDecimal::from_str("0.02")?;
    let (_id, order) = OrderBuilder::new(market, master_subaccount)
        .market(OrderSide::Buy, size)
        .reduce_only(false)
        .price(100) // market-order slippage protection price
        .time_in_force(TimeInForce::Unspecified)
        .until(current_block_height.ahead(10))
        .build(123456)?;

    let tx_hash = permissioned
        .client
        .place_order(&mut permissioned.account, order)
        .await?;
    tracing::info!("Broadcast transaction hash: {:?}", tx_hash);

    // -- Permissioning account actions --

    log::info!("[master] Removing the authenticator.");

    // Authenticators can also be removed when not needed anymore
    master
        .client
        .authenticators()
        .remove(&mut master.account, master_address, id)
        .await?;

    Ok(())
}
