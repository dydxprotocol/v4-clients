mod support;
use anyhow::{Error, Result};
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::indexer::{AnyId, IndexerClient, Ticker};
use dydx_v4_rust::node::{NodeClient, OrderBuilder, OrderSide, Wallet};
use support::constants::TEST_MNEMONIC;
use tokio::time::{sleep, Duration};
use v4_proto_rs::dydxprotocol::clob::order::TimeInForce;

const ETH_USD_TICKER: &str = "ETH-USD";

pub struct OrderPlacer {
    client: NodeClient,
    indexer: IndexerClient,
    wallet: Wallet,
}

impl OrderPlacer {
    pub async fn connect() -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let client = NodeClient::connect(config.node).await?;
        let indexer = IndexerClient::new(config.indexer);
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        Ok(Self {
            client,
            indexer,
            wallet,
        })
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    #[cfg(feature = "telemetry")]
    support::telemetry::metrics_dashboard().await?;
    let mut placer = OrderPlacer::connect().await?;
    let mut account = placer.wallet.account(0, &mut placer.client).await?;
    let subaccount = account.subaccount(0)?;

    let ticker = Ticker(ETH_USD_TICKER.into());
    let market = placer
        .indexer
        .markets()
        .get_perpetual_market(&ticker)
        .await?;

    let current_block_height = placer.client.get_latest_block_height().await?;
    let good_until = current_block_height.ahead(10);

    let (order_id, order) = OrderBuilder::new(market, subaccount)
        .limit(OrderSide::Buy, 100, 3)
        .reduce_only(false)
        .time_in_force(TimeInForce::Unspecified)
        .until(good_until.clone())
        .build(AnyId)?;

    let place_tx_hash = placer.client.place_order(&mut account, order).await?;
    tracing::info!("Place order transaction hash: {:?}", place_tx_hash);

    sleep(Duration::from_secs(5)).await;

    // Cancel order
    let cancel_tx_hash = placer
        .client
        .cancel_order(&mut account, order_id, good_until)
        .await?;
    tracing::info!("Cancel order transaction hash: {:?}", cancel_tx_hash);

    Ok(())
}
