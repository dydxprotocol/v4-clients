use serde::{Deserialize, Serialize};

/// REST Indexer client configuration.
#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct RestConfig {
    /// REST endpoint.
    ///
    /// You can select REST endpoints from [the list](https://docs.dydx.exchange/infrastructure_providers-network/resources#indexer-endpoints).
    pub endpoint: String,
}
