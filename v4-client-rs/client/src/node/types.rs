use cosmrs::tendermint::{chain::Id, error::Error};
use serde::Deserialize;
use strum::{AsRefStr, Display};

/// [Chain ID](https://docs.dydx.exchange/infrastructure_providers-network/network_constants#chain-id)
/// serves as a unique chain identificator to prevent replay attacks.
///
/// See also [Cosmos ecosystem](https://cosmos.directory/).
#[derive(Debug, Eq, PartialEq, Clone, Display, AsRefStr, Deserialize)]
pub enum ChainId {
    /// Testnet.
    #[strum(serialize = "dydx-testnet-4")]
    #[serde(rename = "dydx-testnet-4")]
    Testnet4,
    /// Mainnet.
    #[strum(serialize = "dydx-mainnet-1")]
    #[serde(rename = "dydx-mainnet-1")]
    Mainnet1,
}

impl TryFrom<ChainId> for Id {
    type Error = Error;

    fn try_from(chain_id: ChainId) -> Result<Self, Self::Error> {
        chain_id.as_ref().parse()
    }
}
