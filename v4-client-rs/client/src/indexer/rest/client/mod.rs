pub mod accounts;
pub mod markets;
pub mod utility;

use super::config::RestConfig;
use super::options::*;
use crate::indexer::{rest::types::*, types::*};
use accounts::Accounts;
use markets::Markets;
use reqwest::Client;
use serde::Serialize;
use utility::Utility;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Query<'t> {
    address: &'t Address,
    subaccount_number: &'t SubaccountNumber,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct QueryParent<'t> {
    address: &'t Address,
    parent_subaccount_number: &'t ParentSubaccountNumber,
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
}
