use super::*;
use anyhow::Error;

/// Accounts dispatcher.
///
/// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/account_endpoint.rs).
pub struct Accounts<'a> {
    rest: &'a RestClient,
}

impl<'a> Accounts<'a> {
    /// Create a new accounts dispatcher.
    pub(crate) fn new(rest: &'a RestClient) -> Self {
        Self { rest }
    }

    /// Query for all subaccounts infos.
    ///
    /// Compare with [`Self::get_subaccount`].
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#getaddress).
    pub async fn get_subaccounts(&self, address: &Address) -> Result<AddressResponse, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/addresses";
        let url = format!("{}{URI}/{address}", rest.config.endpoint);
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

    /// Query for the subaccount, its current perpetual and asset positions, margin and collateral.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#getsubaccount).
    pub async fn get_subaccount(
        &self,
        subaccount: &Subaccount,
    ) -> Result<SubaccountResponseObject, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/addresses";
        let address = &subaccount.address;
        let number = &subaccount.number;
        let url = format!(
            "{}{URI}/{address}/subaccountNumber/{number}",
            rest.config.endpoint
        );
        let subaccount = rest
            .client
            .get(url)
            .send()
            .await?
            .error_for_status()?
            .json::<SubaccountResponse>()
            .await?
            .subaccount;
        Ok(subaccount)
    }

    /// Query for the parent subaccount, its child subaccounts, equity, collateral and margin.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#getparentsubaccount).
    pub async fn get_parent_subaccount(
        &self,
        subaccount: &ParentSubaccount,
    ) -> Result<ParentSubaccountResponseObject, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/addresses";
        let address = &subaccount.address;
        let number = &subaccount.number;
        let url = format!(
            "{}{URI}/{address}/parentSubaccountNumber/{number}",
            rest.config.endpoint
        );
        let subaccount = rest
            .client
            .get(url)
            .send()
            .await?
            .error_for_status()?
            .json::<ParentSubaccountResponse>()
            .await?
            .subaccount;
        Ok(subaccount)
    }

    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/close_all_positions.rs).
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#listpositions).
    pub async fn list_positions(
        &self,
        subaccount: &Subaccount,
        opts: Option<ListPositionsOpts>,
    ) -> Result<Vec<PerpetualPositionResponseObject>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/perpetualPositions";
        let url = format!("{}{URI}", rest.config.endpoint);
        let query = Query {
            address: &subaccount.address,
            subaccount_number: &subaccount.number,
        };
        let options = opts.unwrap_or_default();
        let positions = rest
            .client
            .get(url)
            .query(&query)
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json::<PerpetualPositionResponse>()
            .await?
            .positions;
        Ok(positions)
    }

    /// List all positions of a parent subaccount.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#listpositionsforparentsubaccount).
    pub async fn list_parent_positions(
        &self,
        subaccount: &ParentSubaccount,
        opts: Option<ListPositionsOpts>,
    ) -> Result<Vec<PerpetualPositionResponseObject>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/perpetualPositions";
        let url = format!("{}{URI}/parentSubaccountNumber", rest.config.endpoint);
        let query = QueryParent {
            address: &subaccount.address,
            parent_subaccount_number: &subaccount.number,
        };
        let options = opts.unwrap_or_default();
        let positions = rest
            .client
            .get(url)
            .query(&query)
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json::<PerpetualPositionResponse>()
            .await?
            .positions;
        Ok(positions)
    }

    /// Query for asset positions (size, buy/sell etc).
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#getassetpositions).
    pub async fn get_asset_positions(
        &self,
        subaccount: &Subaccount,
    ) -> Result<Vec<AssetPositionResponseObject>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/assetPositions";
        let url = format!("{}{URI}", rest.config.endpoint);
        let query = Query {
            address: &subaccount.address,
            subaccount_number: &subaccount.number,
        };
        let positions = rest
            .client
            .get(url)
            .query(&query)
            .send()
            .await?
            .error_for_status()?
            .json::<AssetPositionResponse>()
            .await?
            .positions;
        Ok(positions)
    }

    /// Query for asset positions (size, buy/sell etc) for a parent subaccount.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#getassetpositionsforparentsubaccount).
    pub async fn get_parent_asset_positions(
        &self,
        subaccount: &ParentSubaccount,
    ) -> Result<Vec<AssetPositionResponseObject>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/assetPositions";
        let url = format!("{}{URI}/parentSubaccountNumber", rest.config.endpoint);
        let query = QueryParent {
            address: &subaccount.address,
            parent_subaccount_number: &subaccount.number,
        };
        let positions = rest
            .client
            .get(url)
            .query(&query)
            .send()
            .await?
            .error_for_status()?
            .json::<AssetPositionResponse>()
            .await?
            .positions;
        Ok(positions)
    }

    /// Query for transfers between subaccounts.
    ///
    /// See also [`crate::node::NodeClient::transfer`].
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#gettransfers).
    pub async fn get_transfers(
        &self,
        subaccount: &Subaccount,
        opts: Option<GetTransfersOpts>,
    ) -> Result<Vec<TransferResponseObject>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/transfers";
        let url = format!("{}{URI}", rest.config.endpoint);
        let query = Query {
            address: &subaccount.address,
            subaccount_number: &subaccount.number,
        };
        let options = opts.unwrap_or_default();
        let transfers = rest
            .client
            .get(url)
            .query(&query)
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json::<TransferResponse>()
            .await?
            .transfers;
        Ok(transfers)
    }

    /// Query for transfers between subaccounts associated with a parent subaccount.
    ///
    /// See also [`crate::node::NodeClient::transfer`].
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#gettransfersforparentsubaccount).
    pub async fn get_parent_transfers(
        &self,
        subaccount: &ParentSubaccount,
        opts: Option<GetTransfersOpts>,
    ) -> Result<Vec<TransferResponseObject>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/transfers";
        let url = format!("{}{URI}/parentSubaccountNumber", rest.config.endpoint);
        let query = QueryParent {
            address: &subaccount.address,
            parent_subaccount_number: &subaccount.number,
        };
        let options = opts.unwrap_or_default();
        let transfers = rest
            .client
            .get(url)
            .query(&query)
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json::<TransferResponse>()
            .await?
            .transfers;
        Ok(transfers)
    }

    /// Query for orders filtered by order params.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#listorders).
    pub async fn list_orders(
        &self,
        subaccount: &Subaccount,
        opts: Option<ListOrdersOpts>,
    ) -> Result<ListOrdersResponse, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/orders";
        let url = format!("{}{URI}", rest.config.endpoint);
        let query = Query {
            address: &subaccount.address,
            subaccount_number: &subaccount.number,
        };
        let options = opts.unwrap_or_default();
        let orders = rest
            .client
            .get(url)
            .query(&query)
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;
        Ok(orders)
    }

    /// Query for orders filtered by order params of a parent subaccount.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#listordersforparentsubaccount).
    pub async fn list_parent_orders(
        &self,
        subaccount: &ParentSubaccount,
        opts: Option<ListOrdersOpts>,
    ) -> Result<ListOrdersResponse, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/orders";
        let url = format!("{}{URI}/parentSubaccountNumber", rest.config.endpoint);
        let query = QueryParent {
            address: &subaccount.address,
            parent_subaccount_number: &subaccount.number,
        };
        let options = opts.unwrap_or_default();
        let orders = rest
            .client
            .get(url)
            .query(&query)
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;
        Ok(orders)
    }

    /// Query for the order.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#getorder).
    pub async fn get_order(&self, order_id: &OrderId) -> Result<OrderResponseObject, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/orders";
        let url = format!("{}{URI}/{order_id}", rest.config.endpoint);
        let order = rest
            .client
            .get(url)
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;
        Ok(order)
    }

    /// Query for fills (i.e. filled orders data).
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#getfills).
    pub async fn get_fills(
        &self,
        subaccount: &Subaccount,
        opts: Option<GetFillsOpts>,
    ) -> Result<Vec<FillResponseObject>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/fills";
        let url = format!("{}{URI}", rest.config.endpoint);
        let query = Query {
            address: &subaccount.address,
            subaccount_number: &subaccount.number,
        };
        let options = opts.unwrap_or_default();
        let fills = rest
            .client
            .get(url)
            .query(&query)
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json::<FillResponse>()
            .await?
            .fills;
        Ok(fills)
    }

    /// Query for fills (i.e. filled orders data) for a parent subaccount.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#getfillsforparentsubaccount).
    pub async fn get_parent_fills(
        &self,
        subaccount: &ParentSubaccount,
        opts: Option<GetFillsOpts>,
    ) -> Result<Vec<FillResponseObject>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/fills";
        let url = format!("{}{URI}/parentSubaccountNumber", rest.config.endpoint);
        let query = QueryParent {
            address: &subaccount.address,
            parent_subaccount_number: &subaccount.number,
        };
        let options = opts.unwrap_or_default();
        let fills = rest
            .client
            .get(url)
            .query(&query)
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json::<FillResponse>()
            .await?
            .fills;
        Ok(fills)
    }

    /// Query for profit and loss report for the specified time/block range.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#gethistoricalpnl).
    pub async fn get_historical_pnl(
        &self,
        subaccount: &Subaccount,
        opts: Option<GetHistoricalPnlOpts>,
    ) -> Result<Vec<PnlTicksResponseObject>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/historical-pnl";
        let url = format!("{}{URI}", rest.config.endpoint);
        let query = Query {
            address: &subaccount.address,
            subaccount_number: &subaccount.number,
        };
        let options = opts.unwrap_or_default();
        let pnls = rest
            .client
            .get(url)
            .query(&query)
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json::<HistoricalPnlResponse>()
            .await?
            .historical_pnl;
        Ok(pnls)
    }

    /// Query for profit and loss report for the specified time/block range of a parent subaccount.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#gethistoricalpnlforparentsubaccount).
    pub async fn get_parent_historical_pnl(
        &self,
        subaccount: &ParentSubaccount,
        opts: Option<GetHistoricalPnlOpts>,
    ) -> Result<Vec<PnlTicksResponseObject>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/historical-pnl";
        let url = format!("{}{URI}/parentSubaccountNumber", rest.config.endpoint);
        let query = QueryParent {
            address: &subaccount.address,
            parent_subaccount_number: &subaccount.number,
        };
        let options = opts.unwrap_or_default();
        let pnls = rest
            .client
            .get(url)
            .query(&query)
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json::<HistoricalPnlResponse>()
            .await?
            .historical_pnl;
        Ok(pnls)
    }

    /// Get trader's rewards.
    ///
    /// See also [Trading Rewards](https://docs.dydx.exchange/concepts-trading/rewards_fees_and_parameters#trading-rewards).
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#gettradingrewards).
    pub async fn get_rewards(
        &self,
        address: &Address,
        opts: Option<GetTradingRewardsOpts>,
    ) -> Result<Vec<HistoricalBlockTradingReward>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/historicalBlockTradingRewards";
        let url = format!("{}{URI}/{address}", rest.config.endpoint);
        let options = opts.unwrap_or_default();
        let rewards = rest
            .client
            .get(url)
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json::<HistoricalBlockTradingRewardsResponse>()
            .await?
            .rewards;
        Ok(rewards)
    }

    /// Get trader's rewards aggregation.
    ///
    /// See also [`Self::get_rewards`].
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#getaggregations).
    pub async fn get_rewards_aggregated(
        &self,
        address: &Address,
        period: TradingRewardAggregationPeriod,
        opts: Option<GetAggregationsOpts>,
    ) -> Result<Vec<HistoricalTradingRewardAggregation>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/historicalTradingRewardAggregations";
        let url = format!("{}{URI}/{address}", rest.config.endpoint);
        let options = opts.unwrap_or_default();
        let aggregated = rest
            .client
            .get(url)
            .query(&[("period", &period)])
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json::<HistoricalTradingRewardAggregationsResponse>()
            .await?
            .rewards;
        Ok(aggregated)
    }
}
