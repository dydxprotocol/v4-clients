use anyhow::{Error, Result};
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::indexer::{
    CandleResolution, GetCandlesOpts, GetHistoricalFundingOpts, GetTradesOpts, IndexerClient,
    ListPerpetualMarketsOpts, SparklineTimePeriod, Ticker,
};

const ETH_USD_TICKER: &str = "ETH-USD";

pub struct Rester {
    indexer: IndexerClient,
}

impl Rester {
    pub async fn connect() -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let indexer = IndexerClient::new(config.indexer);
        Ok(Self { indexer })
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    let rester = Rester::connect().await?;
    let indexer = rester.indexer;

    // Test value
    let ticker = Ticker::from(ETH_USD_TICKER);

    let markets_options = ListPerpetualMarketsOpts {
        limit: Some(5),
        ..Default::default()
    };
    let markets = indexer
        .markets()
        .list_perpetual_markets(Some(markets_options))
        .await?;
    tracing::info!("Markets response: {:?}", markets);

    let markets_options = ListPerpetualMarketsOpts {
        ticker: Some(ticker.clone()),
        ..Default::default()
    };
    let market = indexer
        .markets()
        .list_perpetual_markets(Some(markets_options))
        .await?;
    tracing::info!("Market ({ETH_USD_TICKER}) response: {:?}", market);

    let sparklines = indexer
        .markets()
        .get_sparklines(SparklineTimePeriod::SevenDays)
        .await?;
    tracing::info!(
        "Sparklines ({ETH_USD_TICKER}) response: {:?}",
        sparklines.get(&ticker)
    );

    let trades_opts = GetTradesOpts {
        limit: Some(5),
        ..Default::default()
    };
    let trades = indexer
        .markets()
        .get_trades(&ticker, Some(trades_opts))
        .await?;
    tracing::info!("Trades ({ETH_USD_TICKER}) response: {:?}", trades);

    let orderbook = indexer
        .markets()
        .get_perpetual_market_orderbook(&ticker)
        .await?;
    tracing::info!("Orderbook ({ETH_USD_TICKER}) response: {:?}", orderbook);

    let candles_opts = GetCandlesOpts {
        limit: Some(3),
        ..Default::default()
    };
    let candles = indexer
        .markets()
        .get_candles(&ticker, CandleResolution::M1, Some(candles_opts))
        .await?;
    tracing::info!("Candles ({ETH_USD_TICKER}) response: {:?}", candles);

    let fund_opts = GetHistoricalFundingOpts {
        limit: Some(3),
        ..Default::default()
    };
    let funding = indexer
        .markets()
        .get_historical_funding(&ticker, Some(fund_opts))
        .await?;
    tracing::info!(
        "Historical funding ({ETH_USD_TICKER}) response: {:?}",
        funding
    );

    Ok(())
}
