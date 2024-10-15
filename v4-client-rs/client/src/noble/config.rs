use crate::indexer::Denom;
use cosmrs::tendermint::chain::Id as ChainId;
use serde::Deserialize;

/// Configuration for [`NobleClient`](crate::noble::NobleClient)
#[derive(Debug, Deserialize)]
pub struct NobleConfig {
    /// Node endpoint.
    pub endpoint: String,
    /// Timeout in milliseconds
    #[serde(default = "default_timeout")]
    pub timeout: u64,
    /// [`ChainId`] to specify the chain.
    pub chain_id: ChainId,
    /// Fee [`Denom`].
    pub fee_denom: Denom,
    /// The sequence is a value that represents the number of transactions sent from an account.
    /// Either the client manages it automatically via quering the network for the next
    /// sequence number or it is a responsibility of a user.
    /// It is a [replay prevention](https://docs.cosmos.network/v0.47/learn/beginner/tx-lifecycle).
    #[serde(default = "default_manage_sequencing")]
    pub manage_sequencing: bool,
}

fn default_timeout() -> u64 {
    1_000
}

fn default_manage_sequencing() -> bool {
    true
}
