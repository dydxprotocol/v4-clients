mod support;
use anyhow::Result;

#[cfg(feature = "faucet")]
mod faucet_endpoint_example {
    use super::support::constants::TEST_MNEMONIC;
    use anyhow::{anyhow as err, Error, Result};
    use dydx_v4_rust::config::ClientConfig;
    use dydx_v4_rust::faucet::FaucetClient;
    use dydx_v4_rust::indexer::Usdc;
    use dydx_v4_rust::node::Wallet;
    pub struct FaucetRequester {
        faucet: FaucetClient,
        wallet: Wallet,
    }

    impl FaucetRequester {
        pub async fn connect() -> Result<Self> {
            let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
            let faucet = FaucetClient::new(
                config
                    .faucet
                    .ok_or_else(|| err!("Config file must contain a [faucet] config!"))?,
            );
            let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
            Ok(Self { faucet, wallet })
        }
    }

    pub async fn run() -> Result<()> {
        tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
        let requester = FaucetRequester::connect().await?;
        let subaccount = requester.wallet.account_offline(0)?.subaccount(0)?;

        requester
            .faucet
            .fill(&subaccount, &Usdc::from(1000))
            .await?;

        Ok(())
    }
}

#[cfg(feature = "faucet")]
#[tokio::main]
async fn main() -> Result<()> {
    faucet_endpoint_example::run().await?;
    Ok(())
}

#[cfg(not(feature = "faucet"))]
fn main() {
    eprintln!("Feature 'faucet' must be enabled to run this example!")
}
