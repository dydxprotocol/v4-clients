mod support;
use anyhow::{Error, Result};
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::indexer::IndexerClient;
use dydx_v4_rust::node::Wallet;
use support::constants::TEST_MNEMONIC;

pub struct Rester {
    indexer: IndexerClient,
    wallet: Wallet,
}

impl Rester {
    pub async fn connect() -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let indexer = IndexerClient::new(config.indexer);
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        Ok(Self { indexer, wallet })
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    let rester = Rester::connect().await?;
    let account = rester.wallet.account_offline(0)?;
    let indexer = rester.indexer;

    // Test values
    let address = account.address();

    let time = indexer.utility().get_time().await?;
    tracing::info!("Time: {time:?}");

    let height = indexer.utility().get_height().await?;
    tracing::info!("Height: {height:?}");

    let screen = indexer.utility().get_screen(address).await?;
    tracing::info!("Screen for address {address}: {screen:?}");

    Ok(())
}
