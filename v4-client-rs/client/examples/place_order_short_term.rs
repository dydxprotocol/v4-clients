mod support;
use anyhow::{Error, Result};
use bigdecimal::BigDecimal;
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::indexer::IndexerClient;
use dydx_v4_rust::node::{NodeClient, OrderBuilder, OrderSide, Wallet};
use std::str::FromStr;
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
    let subaccount = account.subaccount(0)?;

    let market = placer
        .indexer
        .markets()
        .get_perpetual_market(&ETH_USD_TICKER.into())
        .await?;

    let current_block_height = placer.client.get_latest_block_height().await?;

    let size = BigDecimal::from_str("0.02")?;
    let (_id, order) = OrderBuilder::new(market, subaccount)
        .market(OrderSide::Buy, size)
        .reduce_only(false)
        .price(100) // market-order slippage protection price
        .time_in_force(TimeInForce::Unspecified)
        .until(current_block_height.ahead(10))
        .build(123456)?;

    let tx_hash = placer.client.place_order(&mut account, order).await?;
    tracing::info!("Broadcast transaction hash: {:?}", tx_hash);

    Ok(())
}
