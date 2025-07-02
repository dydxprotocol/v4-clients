mod support;

use anyhow::{Error, Result};
use dydx::config::ClientConfig;
use dydx::indexer::IndexerClient;
use dydx::node::Wallet;
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

    let metadata = indexer.affiliates().get_metadata(&address).await?;
    tracing::info!("Metadata: {metadata:?}");

    let address_from_referral_code = indexer.affiliates().get_address("UpperJamX3B").await?;
    tracing::info!("Address: {address_from_referral_code:?}");

    let snapshot = indexer.affiliates().get_snapshot(None, None, None).await?;
    tracing::info!("Snapshot: {snapshot:?}");

    let total_volume = indexer.affiliates().get_total_volume(&address).await?;
    tracing::info!("Total volume: {total_volume:?}");

    Ok(())
}
