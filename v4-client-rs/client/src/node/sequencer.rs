use anyhow::{anyhow as err, Error, Result};
use async_trait::async_trait;
#[allow(unused_imports)]
use chrono::{DateTime, Utc};

use super::Address;
use std::collections::HashMap;
use tonic::{transport::Channel, Request};
use tower::timeout::Timeout;
use v4_proto_rs::cosmos_sdk_proto::{
    cosmos::auth::v1beta1::{
        query_client::QueryClient as QueryGrpcClient, BaseAccount, QueryAccountRequest,
    },
    traits::Message,
};

/// Transaction sequence number validation value used to enable protection against replay attacks.
#[derive(Clone, Debug)]
pub enum Nonce {
    /// A sequence number is incremental, associated with the number of transactions (short-term
    /// orders excluded) issued by an [`Account`](super::wallet::Account).
    Sequence(u64),
    /// A valid timestamp nonce folows the rules:
    /// 1. now - 30s ≤ timestamp ≤ now + 30s;
    /// 2. timestamp is strictly larger than any of the largest 20 timestamp nonces previously submitted in the account’s lifetime;
    /// 3. timestamp has never been used before.
    Timestamp(u64),
}

impl Nonce {
    /// Create a new timestamp `Nonce` using the current timestamp
    pub fn now() -> Self {
        Self::Timestamp(Utc::now().timestamp_millis() as u64)
    }
}

/// A trait to produce [`Nonce`]s for [`Account`](super::Account).
#[async_trait]
pub trait Sequencer: Send + 'static {
    /// Returns the next nonce.
    async fn next_nonce(&mut self, address: &Address) -> Result<Nonce, Error>;
}

/// A simple incremental sequencer.
/// An internal counter is increased in every `next_nonce()` call.
#[allow(dead_code)] // TODO remove after completion
#[derive(Clone, Debug)]
pub struct IncrementalSequencer {
    counters: HashMap<Address, u64>,
}

impl IncrementalSequencer {
    /// Add relevant `Address`es and respective starting counter values
    #[allow(dead_code)] // TODO remove after completion
    pub fn new(addresses: &[(Address, u64)]) -> Self {
        Self {
            counters: addresses.iter().cloned().collect(),
        }
    }

    /// Adds an `Address` with a starting counter value to the sequencer
    #[allow(dead_code)] // TODO remove after completion
    pub fn add_address(&mut self, address: Address, start_at: u64) -> Option<u64> {
        self.counters.insert(address, start_at)
    }
}

#[async_trait]
impl Sequencer for IncrementalSequencer {
    async fn next_nonce(&mut self, address: &Address) -> Result<Nonce, Error> {
        let counter = self
            .counters
            .get_mut(address)
            .ok_or_else(|| err!("Address {address} not found in sequencer"))?;
        *counter += 1;
        Ok(Nonce::Sequence(*counter - 1))
    }
}

/// A sequencer which fetches the next sequence number from the network.
#[allow(dead_code)] // TODO remove after completion
#[derive(Clone, Debug)]
pub struct QueryingSequencer {
    querier: QueryGrpcClient<Timeout<Channel>>,
}

impl QueryingSequencer {
    /// Creates a new `QueryingSequencer` using a gRPC [`Channel`].
    #[allow(dead_code)] // TODO remove after completion
    pub fn new(channel: Timeout<Channel>) -> Self {
        Self {
            querier: QueryGrpcClient::new(channel),
        }
    }
}

#[async_trait]
impl Sequencer for QueryingSequencer {
    async fn next_nonce(&mut self, address: &Address) -> Result<Nonce, Error> {
        let response = self
            .querier
            .account(Request::new(QueryAccountRequest {
                address: address.to_string(),
            }))
            .await?
            .into_inner();
        let sequence = BaseAccount::decode(
            &response
                .account
                .ok_or_else(|| err!("Query account request failure, account should exist."))?
                .value[..],
        )
        .map(|res| res.sequence)
        .map_err(|e| err!("Query account request decode failure: {e}"))?;

        Ok(Nonce::Sequence(sequence))
    }
}

/// A sequencer which uses a current timestamp as a sequence number.
#[allow(dead_code)] // TODO remove after completion
#[derive(Clone, Debug)]
pub struct TimestamperSequencer;

#[async_trait]
impl Sequencer for TimestamperSequencer {
    async fn next_nonce(&mut self, _: &Address) -> Result<Nonce, Error> {
        Ok(Nonce::now())
    }
}
