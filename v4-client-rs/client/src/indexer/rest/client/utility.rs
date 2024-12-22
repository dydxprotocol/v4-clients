use super::*;
use anyhow::Error;

/// Other data dispatcher.
///
/// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/utility_endpoint.rs).
pub struct Utility<'a> {
    rest: &'a RestClient,
}

impl<'a> Utility<'a> {
    /// Create a new utility dispatcher.
    pub(crate) fn new(rest: &'a RestClient) -> Self {
        Self { rest }
    }

    /// Current server time (UTC) of Indexer.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#gettime).
    pub async fn get_time(&self) -> Result<TimeResponse, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/time";
        let url = format!("{}{URI}", rest.config.endpoint);
        let resp = rest
            .client
            .get(url)
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;
        Ok(resp)
    }

    /// Current block height and block time (UTC) parsed by Indexer.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#getheight).
    pub async fn get_height(&self) -> Result<HeightResponse, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/height";
        let url = format!("{}{URI}", rest.config.endpoint);
        let resp = rest
            .client
            .get(url)
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;
        Ok(resp)
    }

    /// Query for screening results (compliance) of the address.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#screen).
    pub async fn get_screen(&self, query: &Address) -> Result<ComplianceResponse, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/screen";
        let url = format!("{}{URI}", rest.config.endpoint);
        let resp = rest
            .client
            .get(url)
            .query(&[("address", query)])
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;
        Ok(resp)
    }
}
