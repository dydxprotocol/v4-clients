pub use crate::indexer::{Address, Subaccount, SubaccountNumber, Usdc};
use anyhow::{anyhow as err, Error};
use bigdecimal::num_traits::ToPrimitive;
use reqwest::Client;
use serde::{Deserialize, Serialize};

/// Configuration for the Faucet client.
#[derive(Debug, Deserialize)]
pub struct FaucetConfig {
    /// The base url of the faucet service.
    pub endpoint: String,
}

/// [Faucet](https://docs.dydx.exchange/infrastructure_providers-network/faucet)
/// serves as a source of funds for test purposes.
///
/// See also [What is a Crypto Faucet?](https://dydx.exchange/crypto-learning/crypto-faucet).
///
/// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/faucet_endpoint.rs).
#[derive(Debug)]
pub struct FaucetClient {
    config: FaucetConfig,
    client: Client,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct FillReq<'t> {
    address: &'t Address,
    subaccount_number: &'t SubaccountNumber,
    amount: u64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct FillNativeReq<'t> {
    address: &'t Address,
}

impl FaucetClient {
    /// Creates a new `FaucetClient`
    pub fn new(config: FaucetConfig) -> Self {
        Self {
            config,
            client: Client::default(),
        }
    }

    /// add USDC to a subaccount
    pub async fn fill(&self, subaccount: &Subaccount, amount: &Usdc) -> Result<(), Error> {
        const URI: &str = "/faucet/tokens";
        let url = format!("{}{URI}", self.config.endpoint);
        let body = FillReq {
            address: &subaccount.address,
            subaccount_number: &subaccount.number,
            amount: amount
                .to_u64()
                .ok_or_else(|| err!("Failed converting USDC amount to u64"))?,
        };
        let _resp = self
            .client
            .post(url)
            .json(&body)
            .send()
            .await?
            .error_for_status()?;
        Ok(())
    }

    /// add native dYdX testnet token to an address
    pub async fn fill_native(&self, address: &Address) -> Result<(), Error> {
        const URI: &str = "/faucet/native-token";
        let url = format!("{}{URI}", self.config.endpoint);
        let body = FillNativeReq { address };
        let _resp = self
            .client
            .post(url)
            .json(&body)
            .send()
            .await?
            .error_for_status()?;
        Ok(())
    }
}
