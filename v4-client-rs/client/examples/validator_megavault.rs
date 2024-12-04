mod support;
use anyhow::{Error, Result};
use bigdecimal::num_bigint::BigInt;
use dydx::config::ClientConfig;
use dydx::node::{BigIntExt, NodeClient, Wallet};
use support::constants::TEST_MNEMONIC;
use tokio::time::{sleep, Duration};

pub struct MegaVaulter {
    client: NodeClient,
    wallet: Wallet,
}

impl MegaVaulter {
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
    #[cfg(feature = "telemetry")]
    support::telemetry::metrics_dashboard().await?;

    let mut vaulter = MegaVaulter::connect().await?;
    let mut account = vaulter.wallet.account(0, &mut vaulter.client).await?;
    let address = account.address().clone();
    let subaccount = account.subaccount(0)?;

    // Deposit 1 USDC into the MegaVault
    let tx_hash = vaulter
        .client
        .megavault()
        .deposit(&mut account, subaccount.clone(), 1)
        .await?;
    tracing::info!("Deposit transaction hash: {:?}", tx_hash);

    sleep(Duration::from_secs(2)).await;

    // Withdraw 1 share from the MegaVault
    let number_of_shares: BigInt = 1.into();
    let tx_hash = vaulter
        .client
        .megavault()
        .withdraw(&mut account, subaccount, 0, Some(&number_of_shares))
        .await?;
    tracing::info!("Withdraw transaction hash: {:?}", tx_hash);

    // Query methods

    let owner_shares = vaulter
        .client
        .megavault()
        .get_owner_shares(&address)
        .await?;
    tracing::info!("Get owner shares: {owner_shares:?}");

    // Convert serialized integer into an integer (`BigIntExt` trait)
    if let Some(shares) = owner_shares.shares {
        let nshares = BigInt::from_serializable_int(&shares.num_shares)?;
        tracing::info!("Number of owned shares: {}", nshares);
    }

    let withdrawal_info = vaulter
        .client
        .megavault()
        .get_withdrawal_info(&number_of_shares)
        .await?;
    tracing::info!("Get withdrawal info: {withdrawal_info:?}");

    Ok(())
}
