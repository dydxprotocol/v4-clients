use serde::Deserialize;
use std::num::NonZeroU32;

/// Websocket Indexer client configuration.
#[derive(Clone, Debug, Deserialize)]
pub struct SockConfig {
    /// Websocket endpoint.
    ///
    /// You can select Websocket endpoints from [the list](https://docs.dydx.exchange/infrastructure_providers-network/resources#indexer-endpoints).
    pub endpoint: String,
    /// Reconnect interval.
    #[serde(default = "default_timeout")]
    pub timeout: u64,
    /// Rate limit.
    ///
    /// See also [Rate Limiting](https://docs.dydx.exchange/api_integration-indexer/indexer_websocket#rate-limiting).
    #[serde(default = "default_rate_limit")]
    pub rate_limit: NonZeroU32,
}

fn default_timeout() -> u64 {
    1_000
}

fn default_rate_limit() -> NonZeroU32 {
    NonZeroU32::new(2).unwrap()
}
