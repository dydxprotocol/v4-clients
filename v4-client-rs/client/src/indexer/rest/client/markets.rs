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
    /// [Reference](https://docs.dydx.xyz/indexer-client/http#get-perpetual-markets).
    #[deprecated(since = "0.3.0", note = "Use `get_perpetual_markets` instead")]
    pub async fn list_perpetual_markets(
        &self,
        opts: Option<ListPerpetualMarketsOpts>,
    ) -> Result<HashMap<Ticker, PerpetualMarket>, Error> {
        self.get_perpetual_markets(opts).await
    }

    /// Query for perpetual markets data.
    ///
    /// [Reference](https://docs.dydx.xyz/indexer-client/http#get-perpetual-markets).
    pub async fn get_perpetual_markets(
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
            .get_perpetual_markets(Some(ListPerpetualMarketsOpts {
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
    /// [Reference](https://docs.dydx.xyz/indexer-client/http#get-perpetual-market-orderbook).
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
    /// [Reference](https://docs.dydx.xyz/indexer-client/http#get-trades).
    #[deprecated(since = "0.3.0", note = "Use `get_perpetual_market_trades` instead")]
    pub async fn get_trades(
        &self,
        ticker: &Ticker,
        opts: Option<GetTradesOpts>,
    ) -> Result<Vec<TradeResponseObject>, Error> {
        self.get_perpetual_market_trades(ticker, opts).await
    }

    /// Query for trades.
    ///
    /// [Reference](https://docs.dydx.xyz/indexer-client/http#get-trades).
    pub async fn get_perpetual_market_trades(
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
    /// [Reference](https://docs.dydx.xyz/indexer-client/http#get-candles).
    #[deprecated(since = "0.3.0", note = "Use `get_perpetual_market_candles` instead")]
    pub async fn get_candles(
        &self,
        ticker: &Ticker,
        res: CandleResolution,
        opts: Option<GetCandlesOpts>,
    ) -> Result<Vec<CandleResponseObject>, Error> {
        self.get_perpetual_market_candles(ticker, res, opts).await
    }

    /// Query for [candles](https://dydx.exchange/crypto-learning/candlestick-patterns).
    ///
    /// [Reference](https://docs.dydx.xyz/indexer-client/http#get-candles).
    pub async fn get_perpetual_market_candles(
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
    /// [Reference](https://docs.dydx.xyz/indexer-client/http#get-historical-funding).
    #[deprecated(
        since = "0.3.0",
        note = "Use `get_perpetual_market_historical_funding` instead"
    )]
    pub async fn get_historical_funding(
        &self,
        ticker: &Ticker,
        opts: Option<GetHistoricalFundingOpts>,
    ) -> Result<Vec<HistoricalFundingResponseObject>, Error> {
        self.get_perpetual_market_historical_funding(ticker, opts)
            .await
    }

    /// Query for funding till time/block specified.
    ///
    /// [Reference](https://docs.dydx.xyz/indexer-client/http#get-historical-funding).
    pub async fn get_perpetual_market_historical_funding(
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
    /// [Reference](https://docs.dydx.xyz/indexer-client/http#get-sparklines).
    #[deprecated(
        since = "0.3.0",
        note = "Use `get_perpetual_market_sparklines` instead"
    )]
    pub async fn get_sparklines(
        &self,
        period: SparklineTimePeriod,
    ) -> Result<SparklineResponseObject, Error> {
        self.get_perpetual_market_sparklines(period).await
    }

    /// Query for [sparklines](https://en.wikipedia.org/wiki/Sparkline).
    ///
    /// [Reference](https://docs.dydx.xyz/indexer-client/http#get-sparklines).
    pub async fn get_perpetual_market_sparklines(
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
