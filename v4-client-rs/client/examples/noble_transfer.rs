use anyhow::Result;

#[cfg(feature = "noble")]
mod noble_transfer_example {
    use super::*;
    use anyhow::{anyhow as err, Error};
    use dydx_v4_rust::config::ClientConfig;
    use dydx_v4_rust::indexer::Token;
    use dydx_v4_rust::noble::{NobleClient, NobleUsdc};
    use dydx_v4_rust::node::{NodeClient, Wallet};
    use tokio::time::{sleep, Duration};

    const TEST_MNEMONIC: &str = "mirror actor skill push coach wait confirm orchard lunch mobile athlete gossip awake miracle matter bus reopen team ladder lazy list timber render wait";
    const DYDX_SOURCE_CHANNEL: &str = "channel-0";
    const NOBLE_SOURCE_CHANNEL: &str = "channel-33";

    pub struct Bridger {
        wallet: Wallet,
        noble: NobleClient,
        node: NodeClient,
    }

    impl Bridger {
        pub async fn connect() -> Result<Self> {
            let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
            let noble = NobleClient::connect(
                config
                    .noble
                    .ok_or_else(|| err!("Config file must contain a [noble] config!"))?,
            )
            .await?;
            let node = NodeClient::connect(config.node).await?;
            let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
            Ok(Self {
                noble,
                wallet,
                node,
            })
        }
    }

    #[tokio::main]
    pub async fn run() -> Result<()> {
        tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
        let mut bridger = Bridger::connect().await?;

        let mut account_dydx = bridger.wallet.account_offline(0)?;
        let mut account_noble = bridger.wallet.noble().account_offline(0)?;

        let address_dydx = account_dydx.address().clone();
        let address_noble = account_noble.address().clone();

        tracing::info!(
            "Before transfer balance: {:?}",
            bridger
                .noble
                .get_account_balances(address_noble.clone())
                .await?
        );
        let tx_hash = bridger
            .node
            .send_token_ibc(
                &mut account_dydx,
                address_dydx.clone(),
                address_noble.clone(),
                Token::Usdc(1.into()),
                DYDX_SOURCE_CHANNEL.into(),
            )
            .await?;
        tracing::info!("dYdX -> Noble Tx hash: {tx_hash}");

        sleep(Duration::from_secs(30)).await;

        tracing::info!(
            "After transfer balance: {:?}",
            bridger
                .noble
                .get_account_balances(address_noble.clone())
                .await?
        );

        let tx_hash = bridger
            .noble
            .send_token_ibc(
                &mut account_noble,
                address_noble.clone(),
                address_dydx,
                NobleUsdc::from(1),
                NOBLE_SOURCE_CHANNEL.into(),
            )
            .await?;
        tracing::info!("Noble -> dYdX Tx hash: {tx_hash}");

        sleep(Duration::from_secs(30)).await;

        tracing::info!(
            "Undo transfer balance: {:?}",
            bridger
                .noble
                .get_account_balances(address_noble.clone())
                .await?
        );

        Ok(())
    }
}

#[cfg(feature = "noble")]
fn main() -> Result<()> {
    noble_transfer_example::run()
}

#[cfg(not(feature = "noble"))]
fn main() {
    eprintln!("Feature 'noble' must be enabled to run this example!")
}
