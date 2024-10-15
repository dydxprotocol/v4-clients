mod support;
use anyhow::{Error, Result};
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::indexer::Token;
use dydx_v4_rust::node::{NodeClient, Wallet};
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

    let mut account0 = transferor.wallet.account(0, &mut transferor.client).await?;
    let sender = account0.address().clone();

    let account1 = transferor.wallet.account(1, &mut transferor.client).await?;
    let recipient = account1.address().clone();

    let tx_hash = transferor
        .client
        .send_token(&mut account0, sender, recipient, Token::DydxTnt(1.into()))
        .await?;
    tracing::info!("Send token transaction hash: {:?}", tx_hash);

    Ok(())
}
