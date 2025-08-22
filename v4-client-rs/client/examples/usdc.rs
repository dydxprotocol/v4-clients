mod support;

use anyhow::{Error, Result};
use bigdecimal::num_bigint::{BigInt, ToBigInt};
use dydx::config::ClientConfig;
use dydx::indexer::IndexerClient;
use dydx::node::{BigIntExt, NodeClient, Wallet};
use support::constants::TEST_MNEMONIC;

pub struct Getter {
    indexer: IndexerClient,
    client: NodeClient,
    wallet: Wallet,
}

impl Getter {
    pub async fn connect() -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let indexer = IndexerClient::new(config.indexer);
        let client = NodeClient::connect(config.node).await?;
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        Ok(Self {
            indexer,
            client,
            wallet,
        })
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    let mut getter = Getter::connect().await?;
    let account = getter.wallet.account_offline(0)?;
    let subacc = account.subaccount(0)?;

    let indexer_subaccount = getter.indexer.accounts().get_subaccount(&subacc).await?;
    tracing::info!("Indexer subaccount: {:?}", indexer_subaccount);

    let node_subaccount = getter.client.get_subaccount(&subacc).await?;
    tracing::info!("Node subaccount: {:?}", node_subaccount);

    // Assume only one asset position, get its size
    let indexer_size = indexer_subaccount
        .asset_positions
        .iter()
        .next()
        .unwrap()
        .1
        .size
        .to_bigint()
        .unwrap();
    // USDC size is provided as micro USDC
    let node_size = BigInt::from_serializable_int(&node_subaccount.asset_positions[0].quantums)
        .unwrap()
        / 1_000_000;

    println!("Indexer asset position size: {indexer_size:?}");
    println!("Node asset position size: {node_size:?}");

    Ok(())
}
