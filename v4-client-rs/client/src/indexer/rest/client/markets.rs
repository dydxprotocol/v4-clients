use super::*;
use anyhow::{anyhow as err, Error};
use std::collections::HashMap;

/// Markets dispatcher.
///
/// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/market_endpoint.rs).
pub struct Markets<'a> {
    rest: &'a RestClient,
}

impl<'a> Markets<'a> {
    /// Create a new markets dispatcher.
    pub(crate) fn new(rest: &'a RestClient) -> Self {
        Self { rest }
    }

    /// Query for perpetual markets data.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#listperpetualmarkets).
    pub async fn list_perpetual_markets(
        &self,
        opts: Option<ListPerpetualMarketsOpts>,
    ) -> Result<HashMap<Ticker, PerpetualMarket>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/perpetualMarkets";
        let url = format!("{}{URI}", rest.config.endpoint);
        let options = opts.unwrap_or_default();
        let markets = rest
            .client
            .get(url)
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json::<PerpetualMarketResponse>()
            .await?
            .markets;
        Ok(markets)
    }

    /// Query for the perpetual market.
    pub async fn get_perpetual_market(&self, ticker: &Ticker) -> Result<PerpetualMarket, Error> {
        let mut markets = self
            .list_perpetual_markets(Some(ListPerpetualMarketsOpts {
                limit: Some(1),
                ticker: Some(ticker.clone()),
            }))
            .await?;
        markets
            .remove(ticker)
            .ok_or_else(|| err!("Market ticker not found in list Markets response"))
    }

    /// Query for bids-asks for the perpetual market.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#getperpetualmarket).
    pub async fn get_perpetual_market_orderbook(
        &self,
        ticker: &Ticker,
    ) -> Result<OrderBookResponseObject, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/orderbooks/perpetualMarket";
        let url = format!("{}{URI}/{ticker}", rest.config.endpoint);
        let orderbook = rest
            .client
            .get(url)
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;
        Ok(orderbook)
    }

    /// Query for trades.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#gettrades).
    pub async fn get_trades(
        &self,
        ticker: &Ticker,
        opts: Option<GetTradesOpts>,
    ) -> Result<Vec<TradeResponseObject>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/trades/perpetualMarket";
        let url = format!("{}{URI}/{ticker}", rest.config.endpoint);
        let options = opts.unwrap_or_default();
        let trades = rest
            .client
            .get(url)
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json::<TradeResponse>()
            .await?
            .trades;
        Ok(trades)
    }

    /// Query for [candles](https://dydx.exchange/crypto-learning/candlestick-patterns).
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#getcandles).
    pub async fn get_candles(
        &self,
        ticker: &Ticker,
        res: CandleResolution,
        opts: Option<GetCandlesOpts>,
    ) -> Result<Vec<CandleResponseObject>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/candles/perpetualMarkets";
        let url = format!("{}{URI}/{ticker}", rest.config.endpoint);
        let options = opts.unwrap_or_default();
        let candles = rest
            .client
            .get(url)
            .query(&[("resolution", &res)])
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json::<CandleResponse>()
            .await?
            .candles;
        Ok(candles)
    }

    /// Query for funding till time/block specified.
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#gethistoricalfunding).
    pub async fn get_historical_funding(
        &self,
        ticker: &Ticker,
        opts: Option<GetHistoricalFundingOpts>,
    ) -> Result<Vec<HistoricalFundingResponseObject>, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/historicalFunding";
        let url = format!("{}{URI}/{ticker}", rest.config.endpoint);
        let options = opts.unwrap_or_default();
        let funding = rest
            .client
            .get(url)
            .query(&options)
            .send()
            .await?
            .error_for_status()?
            .json::<HistoricalFundingResponse>()
            .await?
            .historical_funding;
        Ok(funding)
    }

    /// Query for [sparklines](https://en.wikipedia.org/wiki/Sparkline).
    ///
    /// [Reference](https://docs.dydx.exchange/api_integration-indexer/indexer_api#get).
    pub async fn get_sparklines(
        &self,
        period: SparklineTimePeriod,
    ) -> Result<SparklineResponseObject, Error> {
        let rest = &self.rest;
        const URI: &str = "/v4/sparklines";
        let url = format!("{}{URI}", rest.config.endpoint);
        let sparklines = rest
            .client
            .get(url)
            .query(&[("timePeriod", &period)])
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;
        Ok(sparklines)
    }
}
