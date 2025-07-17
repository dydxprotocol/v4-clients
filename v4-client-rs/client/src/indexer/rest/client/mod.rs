pub mod accounts;
pub mod affiliates;
pub mod markets;
pub mod utility;
pub mod vaults;

use super::config::RestConfig;
use super::options::*;
use crate::indexer::{
    rest::{client::affiliates::Affiliates, types::*},
    types::*,
};
use accounts::Accounts;
use markets::Markets;
use reqwest::Client;
use serde::Serialize;
use utility::Utility;
use vaults::Vaults;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
struct Query<'t> {
    address: &'t Address,
    subaccount_number: &'t SubaccountNumber,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
struct QueryParent<'t> {
    address: &'t Address,
    parent_subaccount_number: &'t ParentSubaccountNumber,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
struct GetTransfersBetweenQuery<'t> {
    source_address: &'t Address,
    source_subaccount_number: &'t SubaccountNumber,
    recipient_address: &'t Address,
    recipient_subaccount_number: &'t SubaccountNumber,
}

/// REST client to Indexer.
#[derive(Debug)]
pub(crate) struct RestClient {
    config: RestConfig,
    client: Client,
}

impl RestClient {
    /// Create a new Indexer REST client.
    pub(crate) fn new(config: RestConfig) -> Self {
        Self {
            config,
            client: Client::default(),
        }
    }

    /// Get accounts query dispatcher.
    pub(crate) fn accounts(&self) -> Accounts<'_> {
        Accounts::new(self)
    }

    /// Get markets query dispatcher.
    pub(crate) fn markets(&self) -> Markets<'_> {
        Markets::new(self)
    }

    /// Get utility query dispatcher.
    pub(crate) fn utility(&self) -> Utility<'_> {
        Utility::new(self)
    }

    /// Get vaults query dispatcher.
    pub(crate) fn vaults(&self) -> Vaults<'_> {
        Vaults::new(self)
    }

    /// Get affiliates query dispatcher.
    pub(crate) fn affiliates(&self) -> Affiliates<'_> {
        Affiliates::new(self)
    }
}
