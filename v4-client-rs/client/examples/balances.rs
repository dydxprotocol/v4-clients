mod support;
use anyhow::{Error, Result};
use dydx::config::ClientConfig;
use dydx::indexer::Denom;
use dydx::node::{NodeClient, Wallet};
use support::constants::TEST_MNEMONIC;

pub struct Transferor {
    client: NodeClient,
    wallet: Wallet,
    wallet_2: Wallet,
}

const DYDX_TEST_MNEMONIC_2: &str = "movie yard still copper exile wear brisk chest ride dizzy novel future menu finish radar lunar claim hub middle force turtle mouse frequent embark";

impl Transferor {
    pub async fn connect() -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let client = NodeClient::connect(config.node).await?;
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        let wallet_2 = Wallet::from_mnemonic(DYDX_TEST_MNEMONIC_2)?;
        Ok(Self { client, wallet, wallet_2 })
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    let mut transferor = Transferor::connect().await?;
    let mut account = transferor.wallet.account(0, &mut transferor.client).await?;
    let account_2 = transferor.wallet_2.account(0, &mut transferor.client).await?;

    let sender = account.subaccount(0)?;
    let recipient = account_2.subaccount(0)?;

    let balances = transferor.client.get_account_balance(&sender.address,    &Denom::Usdc).await?;
    println!("balances: {:?}", balances);


    let tx_hash = transferor
        .client
        .deposit(&mut account, sender.address.clone(), recipient, 1)
        .await?;

    transferor.client.query_transaction(&tx_hash).await?;

    tracing::info!("Transfer transaction hash: {:?}", tx_hash);

    let balances = transferor.client.get_account_balance(&sender.address, &Denom::Usdc).await?;
    println!("balances: {:?}", balances);

    Ok(())
}
