mod support;
use anyhow::{Error, Result};
use bigdecimal::BigDecimal;
use chrono::{TimeDelta, Utc};
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::indexer::{ClientId, IndexerClient, Ticker};
use dydx_v4_rust::node::{NodeClient, OrderBuilder, OrderSide, Wallet};
use support::constants::TEST_MNEMONIC;
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

    // Test values
    let subaccount = account.subaccount(0)?;
    let client_id = ClientId::random();
    let ticker = Ticker(ETH_USD_TICKER.into());
    let market = placer
        .indexer
        .markets()
        .get_perpetual_market(&ticker)
        .await?;

    let now = Utc::now();
    let time_in_force_seconds = now + TimeDelta::seconds(60);

    let (_id, order) = OrderBuilder::new(market, subaccount)
        .limit(OrderSide::Buy, 123, BigDecimal::new(2.into(), 2))
        .time_in_force(TimeInForce::Unspecified)
        .until(time_in_force_seconds)
        .long_term()
        .build(client_id)?;

    let tx_hash = placer.client.place_order(&mut account, order).await?;
    tracing::info!("Broadcast transaction hash: {:?}", tx_hash);

    Ok(())
}
