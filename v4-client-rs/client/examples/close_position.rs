mod support;
use anyhow::{Error, Result};
use bigdecimal::BigDecimal;
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::indexer::{
    ClientId, IndexerClient, ListPositionsOpts,
    PerpetualPositionResponseObject as PerpetualPosition, PerpetualPositionStatus, Subaccount,
    Ticker,
};
use dydx_v4_rust::node::{NodeClient, Wallet};
use std::str::FromStr;
use support::constants::TEST_MNEMONIC;
use tokio::time::{sleep, Duration};

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

async fn get_open_position(
    indexer: &IndexerClient,
    subaccount: &Subaccount,
    ticker: &Ticker,
) -> Option<PerpetualPosition> {
    indexer
        .accounts()
        .list_positions(
            subaccount,
            Some(ListPositionsOpts {
                status: Some(PerpetualPositionStatus::Open),
                ..Default::default()
            }),
        )
        .await
        .ok()
        .and_then(|positions| positions.into_iter().find(|pos| pos.market == *ticker))
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
        .get_perpetual_market(&ETH_USD_TICKER.into())
        .await?;

    println!(
        "Current open position: {:?}",
        get_open_position(&placer.indexer, &subaccount, &ticker).await
    );

    // Reduce position by an amount, if open, matching best current market prices
    let reduce_by = BigDecimal::from_str("0.0001")?;
    let tx_hash = placer
        .client
        .close_position(
            &mut account,
            subaccount.clone(),
            market.clone(),
            Some(reduce_by),
            ClientId::random(),
        )
        .await?;
    tracing::info!(
        "Partial position close broadcast transaction hash: {:?}",
        tx_hash
    );

    sleep(Duration::from_secs(3)).await;

    // Fully close the position, if open, matching best current market prices
    let tx_hash = placer
        .client
        .close_position(
            &mut account,
            subaccount.clone(),
            market,
            None,
            ClientId::random(),
        )
        .await?;
    tracing::info!(
        "Fully position close broadcast transaction hash: {:?}",
        tx_hash
    );

    sleep(Duration::from_secs(3)).await;

    println!(
        "Current open position: {:?}",
        get_open_position(&placer.indexer, &subaccount, &ticker).await
    );

    Ok(())
}
