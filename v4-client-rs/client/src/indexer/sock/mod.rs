mod config;
mod connector;
/// Realtime feeds.
pub mod feed;
mod messages;

use anyhow::Result;
use connector::{ChannelSender, Connector, ControlMsg};
use tokio::sync::mpsc;

pub use config::SockConfig;

use crate::indexer::{CandleResolution, ParentSubaccount, Subaccount, Ticker};
pub use feed::*;
pub use messages::*;

#[derive(Debug)]
pub(crate) struct SockClient {
    conn_tx: mpsc::UnboundedSender<ControlMsg>,
}

macro_rules! impl_subscribe {
    ($method_name:ident, $message_type:ty, $channel_sender_variant:ident) => {
        pub(crate) async fn $method_name(
            &mut self,
            sub: Subscription,
            batched: bool,
        ) -> Result<Feed<$message_type>, FeedError> {
            let (tx, rx) = mpsc::unbounded_channel();
            self.conn_tx.send(ControlMsg::Subscribe(
                sub.clone(),
                batched,
                ChannelSender::$channel_sender_variant(tx),
            ))?;
            Feed::setup(rx, sub, self.conn_tx.clone()).await
        }
    };
}

impl SockClient {
    pub(crate) fn new(config: SockConfig) -> Self {
        let (conn_tx, conn_rx) = mpsc::unbounded_channel();

        let connector = Connector::new(config, conn_rx);
        tokio::spawn(connector.entrypoint());

        Self { conn_tx }
    }

    impl_subscribe!(subaccounts, SubaccountsMessage, Subaccounts);
    impl_subscribe!(
        parent_subaccounts,
        ParentSubaccountsMessage,
        ParentSubaccounts
    );
    impl_subscribe!(trades, TradesMessage, Trades);
    impl_subscribe!(orders, OrdersMessage, Orders);
    impl_subscribe!(markets, MarketsMessage, Markets);
    impl_subscribe!(candles, CandlesMessage, Candles);
    impl_subscribe!(block_height, BlockHeightMessage, BlockHeight);
}

impl Drop for SockClient {
    fn drop(&mut self) {
        if let Err(e) = self.conn_tx.send(ControlMsg::Terminate) {
            log::error!("Failed sending control Terminate to WebSocket connector: {e}");
        }
    }
}

/// Feeds dispatcher.
#[derive(Debug)]
pub struct Feeds<'a> {
    sock: &'a mut SockClient,
}

impl<'a> Feeds<'a> {
    pub(crate) fn new(sock: &'a mut SockClient) -> Self {
        Self { sock }
    }

    /// This channel provides realtime information about orders, fills, transfers, perpetual positions, and perpetual assets for a subaccount.
    ///
    /// Initial message returns information on the subaccount like [`get_subaccount`](crate::indexer::Accounts::get_subaccount).
    ///
    /// Subsequent responses will contain any update to open orders, changes in account, changes in open positions, and/or transfers in a single message.
    pub async fn subaccounts(
        &mut self,
        subaccount: Subaccount,
        batched: bool,
    ) -> Result<Feed<SubaccountsMessage>, FeedError> {
        self.sock
            .subaccounts(Subscription::Subaccounts(subaccount), batched)
            .await
    }

    /// This channel provides realtime information about markets.
    ///
    /// Initial message returns information on markets like [`list_perpetual_markets`](crate::indexer::Markets::list_perpetual_markets).
    ///
    /// Subsequent responses will contain any update to markets.
    pub async fn markets(&mut self, batched: bool) -> Result<Feed<MarketsMessage>, FeedError> {
        self.sock.markets(Subscription::Markets, batched).await
    }

    /// This channel provides realtime information about trades for the market.
    ///
    /// Initial message returns information on trades like [`get_trades`](crate::indexer::Markets::get_trades).
    ///
    /// Subsequent responses will contain any update to trades for the market.
    pub async fn trades(
        &mut self,
        ticker: &Ticker,
        batched: bool,
    ) -> Result<Feed<TradesMessage>, FeedError> {
        self.sock
            .trades(Subscription::Trades(ticker.clone()), batched)
            .await
    }

    /// This channel provides realtime information about the orderbook for the market.
    ///
    /// Initial message returns information on orderbook like [`get_perpetual_market_orderbook`](crate::indexer::Markets::get_perpetual_market_orderbook).
    ///
    /// Subsequent responses will contain any update to the orderbook for the market.
    pub async fn orders(
        &mut self,
        ticker: &Ticker,
        batched: bool,
    ) -> Result<Feed<OrdersMessage>, FeedError> {
        self.sock
            .orders(Subscription::Orders(ticker.clone()), batched)
            .await
    }

    /// This channel provides realtime information about the candles for the market.
    ///
    /// Initial message returns information on candles like [`get_candles`](crate::indexer::Markets::get_candles).
    ///
    /// Subsequent responses will contain any update to the candles for the market.
    pub async fn candles(
        &mut self,
        ticker: &Ticker,
        resolution: CandleResolution,
        batched: bool,
    ) -> Result<Feed<CandlesMessage>, FeedError> {
        self.sock
            .candles(Subscription::Candles(ticker.clone(), resolution), batched)
            .await
    }

    /// This channel provides realtime information about orders, fills, transfers, perpetual positions, and perpetual assets for a parent subaccount and its children.
    pub async fn parent_subaccounts(
        &mut self,
        subaccount: ParentSubaccount,
        batched: bool,
    ) -> Result<Feed<ParentSubaccountsMessage>, FeedError> {
        self.sock
            .parent_subaccounts(Subscription::ParentSubaccounts(subaccount), batched)
            .await
    }

    /// This channel provides realtime information about the chain's block height.
    ///
    /// Initial message returns information like [`get_height`](crate::indexer::Utility::get_height).
    ///
    /// Subsequent responses will contain following created blocks.
    pub async fn block_height(
        &mut self,
        batched: bool,
    ) -> Result<Feed<BlockHeightMessage>, FeedError> {
        self.sock
            .block_height(Subscription::BlockHeight, batched)
            .await
    }
}
