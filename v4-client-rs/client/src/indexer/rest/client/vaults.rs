use super::*;
use anyhow::Error;

/// Vaults dispatcher.
///
/// Check [the example](https://github.com/NethermindEth/dydx-v4-rust/blob/trunk/client/examples/vaults_endpoint.rs).
pub struct Vaults<'a> {
    rest: &'a RestClient,
}

impl<'a> Vaults<'a> {
    /// Create a new vaults dispatcher.
    pub(crate) fn new(rest: &'a RestClient) -> Self {
        Self { rest }
    }

    /// MegaVault historical PnL.
    pub async fn get_megavault_historical_pnl(
        &self,
        resolution: PnlTickInterval,
    ) -> Result<Vec<PnlTicksResponseObject>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/vault/v1/megavault/historicalPnl";
        let url = format!("{}{URI}", rest.config.endpoint);
        let resp = rest
            .client
            .get(url)
            .query(&[("resolution", resolution)])
            .send()
            .await?
            .error_for_status()?
            .json::<MegaVaultHistoricalPnlResponse>()
            .await?
            .megavault_pnl;
        Ok(resp)
    }

    /// Vaults historical PnL.
    pub async fn get_vaults_historical_pnl(
        &self,
        resolution: PnlTickInterval,
    ) -> Result<Vec<VaultHistoricalPnl>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/vault/v1/vaults/historicalPnl";
        let url = format!("{}{URI}", rest.config.endpoint);
        let resp = rest
            .client
            .get(url)
            .query(&[("resolution", resolution)])
            .send()
            .await?
            .error_for_status()?
            .json::<VaultsHistoricalPnLResponse>()
            .await?
            .vaults_pnl;
        Ok(resp)
    }

    /// MegaVault positions.
    pub async fn get_megavault_positions(&self) -> Result<Vec<VaultPosition>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/vault/v1/megavault/positions";
        let url = format!("{}{URI}", rest.config.endpoint);
        let resp = rest
            .client
            .get(url)
            .send()
            .await?
            .error_for_status()?
            .json::<MegaVaultPositionResponse>()
            .await?
            .positions;
        Ok(resp)
    }
}
