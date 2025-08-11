use serde::{Deserialize, Serialize};

/// REST Indexer client configuration.
#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct RestConfig {
    /// REST endpoint.
    ///
    /// You can select REST endpoints from [the list](https://docs.dydx.xyz/nodes/resources#resources).
    pub endpoint: String,
}
