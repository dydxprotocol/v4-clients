mod support;
use anyhow::{Error, Result};
use dydx::config::ClientConfig;
use dydx::node::{NodeClient, Wallet};
use support::constants::TEST_MNEMONIC;

pub struct Transferor {
    client: NodeClient,
    wallet: Wallet,
}

impl Transferor {
    pub async fn connect() -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let client = NodeClient::connect(config.node).await?;
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        Ok(Self { client, wallet })
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    let mut transferor = Transferor::connect().await?;
    let mut account = transferor.wallet.account(0, &mut transferor.client).await?;

    let sender = account.subaccount(0)?;
    let recipient = account.subaccount(1)?;

    let tx_hash = transferor
        .client
        .transfer(&mut account, sender, recipient, 1)
        .await?;
    tracing::info!("Transfer transaction hash: {:?}", tx_hash);

    Ok(())
}
