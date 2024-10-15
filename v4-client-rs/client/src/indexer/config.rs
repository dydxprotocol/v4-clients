pub use crate::indexer::{rest::RestConfig, sock::SockConfig};
use serde::Deserialize;

/// Indexer client configuration.
#[derive(Clone, Debug, Deserialize)]
pub struct IndexerConfig {
    /// Indexer REST client configuration.
    #[serde(alias = "http")]
    pub rest: RestConfig,
    /// Indexer Websocket client configuration.
    #[serde(alias = "ws")]
    pub sock: SockConfig,
}
