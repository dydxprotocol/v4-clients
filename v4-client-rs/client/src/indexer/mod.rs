/// Indexer client configuration.
pub mod config;
mod rest;
mod sock;
/// Tokens.
pub mod tokens;
/// Types for Indexer data.
pub mod types;

pub use config::IndexerConfig;
pub use rest::*;
pub use sock::*;
pub use tokens::*;
pub use types::*;

/// Indexer client.
#[derive(Debug)]
pub struct IndexerClient {
    rest: RestClient,
    sock: SockClient,
}

impl IndexerClient {
    /// Create a new Indexer client.
    pub fn new(config: IndexerConfig) -> Self {
        Self {
            rest: RestClient::new(config.rest),
            sock: SockClient::new(config.sock),
        }
    }

    /// Get accounts query dispatcher.
    pub fn accounts(&self) -> rest::Accounts {
        self.rest.accounts()
    }

    /// Get markets query dispatcher.
    pub fn markets(&self) -> rest::Markets {
        self.rest.markets()
    }

    /// Get utility query dispatcher.
    pub fn utility(&self) -> rest::Utility {
        self.rest.utility()
    }

    /// Get feeds dispatcher.
    pub fn feed(&mut self) -> Feeds<'_> {
        Feeds::new(&mut self.sock)
    }
}
