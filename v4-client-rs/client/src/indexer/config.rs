pub use crate::indexer::{rest::RestConfig, sock::SockConfig};
use serde::{Deserialize, Serialize};

/// Indexer client configuration.
#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct IndexerConfig {
    /// Indexer REST client configuration.
    #[serde(alias = "http")]
    pub rest: RestConfig,
    /// Indexer Websocket client configuration.
    #[serde(alias = "ws")]
    pub sock: SockConfig,
}
