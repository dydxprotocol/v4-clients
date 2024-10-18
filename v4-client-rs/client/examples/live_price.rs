mod support;
use anyhow::{Error, Result};
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::indexer::{Feed, IndexerClient, MarketsMessage, Ticker};
use dydx_v4_rust::node::{OrderBuilder, Wallet};
use support::constants::TEST_MNEMONIC;

pub struct Feeder {
    ticker: Ticker,
    markets_feed: Feed<MarketsMessage>,
    ordergen: OrderBuilder,
}

impl Feeder {
    pub async fn connect() -> Result<Self> {
        tracing_subscriber::fmt()
            .with_max_level(tracing::Level::DEBUG)
            .try_init()
            .map_err(Error::msg)?;
        #[cfg(feature = "telemetry")]
        support::telemetry::metrics_dashboard().await?;
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let mut indexer = IndexerClient::new(config.indexer);
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        let ticker = "ETH-USD".into();

        let account = wallet.account_offline(0)?;
        let subaccount = account.subaccount(0)?;
        let market = indexer.markets().get_perpetual_market(&ticker).await?;
        let ordergen = OrderBuilder::new(market, subaccount);
        let markets_feed = indexer.feed().markets(false).await?;

        Ok(Self {
            ticker,
            markets_feed,
            ordergen,
        })
    }

    async fn entrypoint(mut self) {
        loop {
            self.step().await;
        }
    }

    async fn step(&mut self) {
        if let Some(msg) = self.markets_feed.recv().await {
            self.handle_markets_msg(msg).await;
        }
    }

    async fn handle_markets_msg(&mut self, msg: MarketsMessage) {
        let price_opt = match msg {
            MarketsMessage::Initial(mut init) => init
                .contents
                .markets
                .remove(&self.ticker)
                .and_then(|market| market.oracle_price),
            MarketsMessage::Update(mut upd) => upd
                .contents
                .first_mut()
                .and_then(|contents| {
                    contents
                        .oracle_prices
                        .as_mut()
                        .and_then(|prices| prices.remove(&self.ticker))
                })
                .map(|opm| opm.oracle_price),
        };
        if let Some(price) = price_opt {
            tracing::info!("Oracle price updated: {price:?}");
            // Since `OrderBuilder` uses the oracle price for slippage protection in Market orders,
            // it is recommended to be updated if the same instance is re-used for different orders.
            self.ordergen.update_market_price(price);
        }
    }
}
#[tokio::main]
async fn main() -> Result<()> {
    let feeder = Feeder::connect().await?;
    feeder.entrypoint().await;
    Ok(())
}
