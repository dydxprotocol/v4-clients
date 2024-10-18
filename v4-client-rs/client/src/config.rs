#[cfg(feature = "faucet")]
use super::faucet::FaucetConfig;
#[cfg(feature = "noble")]
use super::noble::NobleConfig;
use super::{indexer::IndexerConfig, node::NodeConfig};
use anyhow::Error;
use serde::Deserialize;
use std::path::Path;
use tokio::fs;

/// Serves as a configuration wrapper over configurations for specific clients.
#[derive(Debug, Deserialize)]
pub struct ClientConfig {
    /// Configuration for [`IndexerClient`](crate::indexer::IndexerClient)
    pub indexer: IndexerConfig,
    /// Configuration for [`NodeClient`](crate::node::NodeClient)
    pub node: NodeConfig,
    /// Configuration for [`FaucetClient`](crate::faucet::FaucetClient)
    #[cfg(feature = "faucet")]
    pub faucet: Option<FaucetConfig>,
    /// Configuration for [`NobleClient`](crate::noble::NobleClient)
    #[cfg(feature = "noble")]
    pub noble: Option<NobleConfig>,
}

impl ClientConfig {
    /// Creates a new `ClientConfig` instance from a TOML file at the given path
    pub async fn from_file(path: impl AsRef<Path>) -> Result<Self, Error> {
        let toml_str = fs::read_to_string(path).await?;
        let config = toml::from_str(&toml_str)?;
        Ok(config)
    }
}
