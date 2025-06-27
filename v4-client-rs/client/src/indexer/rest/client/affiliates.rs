use super::*;
use anyhow::Error;

const URI: &str = "/v4/affiliates";

/// Affiliates dispatcher.
///
/// Check [the example](todo!).
pub struct Affiliates<'a> {
    rest: &'a RestClient,
}

impl<'a> Affiliates<'a> {
    /// Create a new affiliates dispatcher.
    pub(crate) fn new(rest: &'a RestClient) -> Self {
        Self { rest }
    }

    /// Get affiliate metadata.
    pub async fn get_metadata(
        &self,
        address: &Address,
    ) -> Result<AffiliateMetadataResponse, Error> {
        let rest = &self.rest;
        let url = format!("{}{URI}/metadata", rest.config.endpoint);
        let resp = rest
            .client
            .get(url)
            .query(&[("address", address.to_string())])
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;
        Ok(resp)
    }

    /// Get affiliate address.
    pub async fn get_address(
        &self,
        referral_code: &str,
    ) -> Result<AffiliateAddressResponse, Error> {
        let rest = &self.rest;
        let url = format!("{}{URI}/address", rest.config.endpoint);
        let resp = rest
            .client
            .get(url)
            .query(&[("referralCode", referral_code.to_string())])
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;
        Ok(resp)
    }

    /// Get affiliate snapshot.
    pub async fn get_snapshot(
        &self,
        address_filter: Option<&[&Address]>,
        sort_by_affiliate_earnings: Option<bool>,
        pagination: Option<PaginationRequest>,
    ) -> Result<AffiliateSnapshotResponse, Error> {
        let rest = &self.rest;
        let url = format!("{}{URI}/snapshot", rest.config.endpoint);
        let pagination = pagination.unwrap_or_default();
        let sort_by_affiliate_earnings = sort_by_affiliate_earnings.unwrap_or(false);

        let mut query = vec![];

        if sort_by_affiliate_earnings {
            query.push(("sortByAffiliateEarnings", "true".to_string()));
        }

        if let Some(address_filter) = address_filter {
            let address_filter = address_filter
                .iter()
                .map(|a| a.to_string())
                .collect::<Vec<String>>()
                .join(",");
            query.push(("addressFilter", address_filter));
        }

        let resp = rest
            .client
            .get(url)
            .query(&query)
            .query(&pagination)
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;
        Ok(resp)
    }

    /// Get affiliate total volume.
    pub async fn get_total_volume(
        &self,
        address: &Address,
    ) -> Result<AffiliateTotalVolumeResponse, Error> {
        let rest = &self.rest;
        let url = format!("{}{URI}/total_volume", rest.config.endpoint);
        let resp = rest
            .client
            .get(url)
            .query(&[("address", address.to_string())])
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;
        Ok(resp)
    }
}
