mod support;
use anyhow::{Error, Result};
use dydx::config::ClientConfig;
use dydx::indexer::{IndexerClient, PnlTickInterval};

pub struct Rester {
    indexer: IndexerClient,
}

impl Rester {
    pub async fn connect() -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let indexer = IndexerClient::new(config.indexer);
        Ok(Self { indexer })
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    let rester = Rester::connect().await?;
    let indexer = rester.indexer;

    // Test values
    let resolution = PnlTickInterval::Hour;

    let pnls = indexer
        .vaults()
        .get_megavault_historical_pnl(resolution)
        .await?;
    tracing::info!("MegaVault historical PnLs: {pnls:?}");

    let vaults_pnls = indexer
        .vaults()
        .get_vaults_historical_pnl(resolution)
        .await?;
    tracing::info!("Vaults historical PnLs: {vaults_pnls:?}");

    let positions = indexer.vaults().get_megavault_positions().await?;
    tracing::info!("MegaVault positions: {positions:?}");

    Ok(())
}
