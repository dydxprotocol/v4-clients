mod support;
use anyhow::{Error, Result};
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::indexer::{
    BlockHeightMessage, CandleResolution, CandlesMessage, Feed, IndexerClient, MarketsMessage,
    OrdersMessage, ParentSubaccountsMessage, SubaccountsMessage, Ticker, TradesMessage,
};
use dydx_v4_rust::node::Wallet;
use support::constants::TEST_MNEMONIC;
use tokio::select;

pub struct Feeder {
    trades_feed: Feed<TradesMessage>,
    orders_feed: Feed<OrdersMessage>,
    markets_feed: Feed<MarketsMessage>,
    subaccounts_feed: Feed<SubaccountsMessage>,
    parent_subaccounts_feed: Feed<ParentSubaccountsMessage>,
    candles_feed: Feed<CandlesMessage>,
    height_feed: Feed<BlockHeightMessage>,
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

        let account = wallet.account_offline(0)?;
        let subaccount = account.subaccount(127)?;

        let ticker = Ticker::from("ETH-USD");
        let markets_feed = indexer.feed().markets(false).await?;
        let trades_feed = indexer.feed().trades(&ticker, false).await?;
        let orders_feed = indexer.feed().orders(&ticker, false).await?;
        let candles_feed = indexer
            .feed()
            .candles(&ticker, CandleResolution::M1, false)
            .await?;
        let subaccounts_feed = indexer
            .feed()
            .subaccounts(subaccount.clone(), false)
            .await?;
        let parent_subaccounts_feed = indexer
            .feed()
            .parent_subaccounts(subaccount.parent(), false)
            .await?;
        let height_feed = indexer.feed().block_height(false).await?;

        Ok(Self {
            trades_feed,
            markets_feed,
            orders_feed,
            candles_feed,
            subaccounts_feed,
            parent_subaccounts_feed,
            height_feed,
        })
    }

    async fn step(&mut self) {
        select! {
            msg = self.trades_feed.recv() => if let Some(msg) = msg { tracing::info!("Received trades message: {msg:?}") },
            msg = self.orders_feed.recv() => if let Some(msg) = msg { tracing::info!("Received orders message: {msg:?}") },
            msg = self.markets_feed.recv() => if let Some(msg) = msg { tracing::info!("Received markets message: {msg:?}") },
            msg = self.subaccounts_feed.recv() => if let Some(msg) = msg { tracing::info!("Received subaccounts message: {msg:?}") },
            msg = self.parent_subaccounts_feed.recv() => if let Some(msg) = msg { tracing::info!("Received parent subaccounts message: {msg:?}") },
            msg = self.candles_feed.recv() => if let Some(msg) = msg { tracing::info!("Received candles message: {msg:?}") },
            msg = self.height_feed.recv() => if let Some(msg) = msg { tracing::info!("Received block height message: {msg:?}") },
        }
    }

    async fn entrypoint(mut self) {
        loop {
            self.step().await;
        }
    }
}
#[tokio::main]
async fn main() -> Result<()> {
    let feeder = Feeder::connect().await?;
    feeder.entrypoint().await;
    Ok(())
}
