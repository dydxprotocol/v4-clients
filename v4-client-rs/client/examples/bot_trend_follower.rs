mod support;

use anyhow::{anyhow as err, Error, Result};
use chrono::{TimeDelta, Utc};
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::indexer::{
    CandleResolution, ClientId, Feed, GetCandlesOpts, IndexerClient, ListPerpetualMarketsOpts,
    PerpetualMarket, Price, Quantity, Subaccount, SubaccountsMessage, Ticker, TradesMessage,
};
use dydx_v4_rust::node::{
    Account, NodeClient, OrderBuilder, OrderId, OrderSide, Wallet,
    SHORT_TERM_ORDER_MAXIMUM_LIFETIME,
};
use std::fmt;
use support::constants::TEST_MNEMONIC;
use support::order_book::LiveOrderBook;
use tokio::{
    select,
    sync::mpsc,
    time::{sleep, Duration},
};

pub struct Parameters {
    ticker: Ticker,
    position_size: Quantity,
    shorter_span: TimeDelta,
    longer_span: TimeDelta,
}

pub struct Variables {
    position: Quantity,
    shorter_channel: Channel,
    longer_channel: Channel,
    state: State,
}

enum State {
    Waiting,
    InTrend(OrderSide),
}

pub struct Channel {
    high: Price,
    low: Price,
}

impl fmt::Display for Channel {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "[{}, {}]", self.low, self.high)?;
        Ok(())
    }
}

pub struct TrendFollower {
    client: NodeClient,
    indexer: IndexerClient,
    #[allow(dead_code)] // TODO remove after completion
    wallet: Wallet,
    account: Account,
    subaccount: Subaccount,
    market: PerpetualMarket,
    generator: OrderBuilder,
    trades_feed: Feed<TradesMessage>,
    subaccounts_feed: Feed<SubaccountsMessage>,
    order_book: LiveOrderBook,
    channel_rx: mpsc::UnboundedReceiver<Channel>,
    parameters: Parameters,
    variables: Variables,
}

impl TrendFollower {
    pub async fn connect() -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let mut client = NodeClient::connect(config.node).await?;
        let mut indexer = IndexerClient::new(config.indexer.clone());
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        let mut account = wallet.account(0, &mut client).await?;
        let subaccount = account.subaccount(0)?;

        let ticker = Ticker::from("ETH-USD");
        let market = indexer
            .markets()
            .list_perpetual_markets(Some(ListPerpetualMarketsOpts {
                ticker: Some(ticker.clone()),
                limit: None,
            }))
            .await?
            .remove(&ticker)
            .ok_or_else(|| err!("{ticker} not found in markets query response"))?;
        let generator = OrderBuilder::new(market.clone(), subaccount.clone());

        // Close position
        client
            .close_position(
                &mut account,
                subaccount.clone(),
                market.clone(),
                None,
                ClientId::random(),
            )
            .await?;

        let trades_feed = indexer.feed().trades(&ticker, false).await?;
        let orders_feed = indexer.feed().orders(&ticker, false).await?;
        let subaccounts_feed = indexer
            .feed()
            .subaccounts(subaccount.clone(), false)
            .await?;
        let order_book = LiveOrderBook::new(orders_feed);
        let position_size: Quantity = "0.001".parse()?;
        let shorter_span = TimeDelta::minutes(10);
        let longer_span = TimeDelta::minutes(30);

        let shorter_channel = calculate_channel(&indexer, &ticker, shorter_span).await?;
        let longer_channel = calculate_channel(&indexer, &ticker, longer_span).await?;

        tracing::info!("Watching channel: {longer_channel}");

        let (tx, channel_rx) = mpsc::unbounded_channel();
        tokio::spawn(Self::channel_fetcher(
            tx,
            IndexerClient::new(config.indexer),
            ticker.clone(),
            shorter_span,
        ));

        let parameters = Parameters {
            ticker,
            position_size,
            shorter_span,
            longer_span,
        };
        let variables = Variables {
            position: 0.into(),
            shorter_channel,
            longer_channel,
            state: State::Waiting,
        };
        Ok(Self {
            client,
            indexer,
            wallet,
            account,
            subaccount,
            market,
            generator,
            trades_feed,
            subaccounts_feed,
            order_book,
            channel_rx,
            parameters,
            variables,
        })
    }

    async fn entrypoint(mut self) {
        loop {
            if let Err(err) = self.step().await {
                tracing::error!("Bot update failed: {err}");
            }
        }
    }

    async fn step(&mut self) -> Result<()> {
        select! {
            msg = self.trades_feed.recv() => {
                if let Some(msg) = msg {
                    self.handle_trades_message(msg).await?;
                }
            }
            msg = self.subaccounts_feed.recv() => {
                if let Some(msg) = msg {
                    self.handle_subaccounts_message(msg).await?;
                }
            }
            channel = self.channel_rx.recv() => {
                if let Some(channel) = channel {
                    self.variables.shorter_channel = channel;
                }
            }
            _ = self.order_book.changed() => {
                self.handle_order_book().await?;
            }
        }
        Ok(())
    }

    async fn handle_trades_message(&mut self, msg: TradesMessage) -> Result<()> {
        match msg {
            TradesMessage::Initial(_upd) => {}
            TradesMessage::Update(_upd) => {}
        }
        Ok(())
    }

    async fn handle_subaccounts_message(&mut self, msg: SubaccountsMessage) -> Result<()> {
        match msg {
            SubaccountsMessage::Initial(upd) => {
                let positions = upd.contents.subaccount.open_perpetual_positions;
                if let Some(position) = positions.get(&self.parameters.ticker) {
                    self.variables.position = position.size.clone();
                    tracing::info!("Position: {}", self.variables.position);
                }
            }
            SubaccountsMessage::Update(upd) => {
                if let Some(ref positions) = upd
                    .contents
                    .first()
                    .ok_or_else(|| err!("Subaccount message does not have data!"))?
                    .perpetual_positions
                {
                    let size = positions
                        .iter()
                        .find(|p| (p.market == self.parameters.ticker))
                        .map(|p| p.size.clone());
                    if let Some(size) = size {
                        self.variables.position = size;
                        tracing::info!("Position: {}", self.variables.position);
                    }
                }
            }
        }
        Ok(())
    }

    async fn handle_order_book(&mut self) -> Result<()> {
        let spread = self
            .order_book
            .borrow()
            .spread()
            .map(|spread| (spread.bid.price.clone(), spread.ask.price.clone()));

        if let Some((bid, ask)) = spread {
            let price = Price((bid.0 + ask.0) / 2);
            match self.variables.state {
                State::Waiting => {
                    if price > self.variables.longer_channel.high {
                        tracing::info!("Channel broken at {price}. Placing buy order.");
                        self.place_limit_order(OrderSide::Buy, price).await?;
                        self.variables.state = State::InTrend(OrderSide::Buy);
                        self.variables.shorter_channel =
                            self.get_channel(self.parameters.shorter_span).await?;
                        tracing::info!("In-trend channel: {}", self.variables.shorter_channel);
                    } else if price < self.variables.longer_channel.low {
                        tracing::info!("Channel broken at {price}. Placing sell order.");
                        self.place_limit_order(OrderSide::Sell, price).await?;
                        self.variables.state = State::InTrend(OrderSide::Sell);
                        self.variables.shorter_channel =
                            self.get_channel(self.parameters.shorter_span).await?;
                        tracing::info!("In-trend channel: {}", self.variables.shorter_channel);
                    }
                }
                State::InTrend(side) => {
                    let break_price = match side {
                        OrderSide::Buy => {
                            if price < self.variables.shorter_channel.low {
                                Some(price)
                            } else {
                                None
                            }
                        }
                        OrderSide::Sell => {
                            if price > self.variables.shorter_channel.high {
                                Some(price)
                            } else {
                                None
                            }
                        }
                        _ => None,
                    };
                    if let Some(price) = break_price {
                        tracing::info!(
                            "Leaving trend at {price}, channel: {}. Closing position.",
                            self.variables.shorter_channel
                        );
                        self.close_position().await?;
                        self.variables.state = State::Waiting;
                        self.variables.longer_channel =
                            self.get_channel(self.parameters.longer_span).await?;
                        tracing::info!("Watching channel {}.", self.variables.longer_channel);
                    }
                }
            }
        }
        Ok(())
    }

    async fn place_limit_order(&mut self, side: OrderSide, price: Price) -> Result<OrderId> {
        let current_block = self.client.get_latest_block_height().await?;
        let (id, order) = self
            .generator
            .clone()
            .limit(side, price, self.parameters.position_size.clone())
            .until(current_block.ahead(SHORT_TERM_ORDER_MAXIMUM_LIFETIME))
            .build(ClientId::random())?;
        let hash = self.client.place_order(&mut self.account, order).await?;
        tracing::info!("Placing {side:?} order: {hash} (ID: {})", id.client_id);

        Ok(id)
    }

    async fn _cancel_order(&mut self, id: OrderId) -> Result<()> {
        let current_block = self.client.get_latest_block_height().await?;
        let until = current_block.ahead(10);
        let c_id = id.client_id;
        let hash = self
            .client
            .cancel_order(&mut self.account, id, until)
            .await?;
        tracing::info!("Cancelling order: {hash} (ID: {c_id})");

        Ok(())
    }

    async fn close_position(&mut self) -> Result<()> {
        self.client
            .close_position(
                &mut self.account,
                self.subaccount.clone(),
                self.market.clone(),
                None,
                ClientId::random(),
            )
            .await
            .map(|_| ())
            .map_err(|e| err!("Failed closing position: {e}"))
    }

    async fn get_channel(&self, span: TimeDelta) -> Result<Channel> {
        calculate_channel(&self.indexer, &self.parameters.ticker, span).await
    }

    async fn channel_fetcher(
        tx: mpsc::UnboundedSender<Channel>,
        indexer: IndexerClient,
        ticker: Ticker,
        span: TimeDelta,
    ) -> Result<Channel> {
        loop {
            sleep(Duration::from_secs(30)).await;
            let result = calculate_channel(&indexer, &ticker, span).await?;
            tx.send(result)?;
        }
    }
}

async fn calculate_channel(
    indexer: &IndexerClient,
    ticker: &Ticker,
    span: TimeDelta,
) -> Result<Channel> {
    let now = Utc::now();
    let opts = GetCandlesOpts {
        from_iso: Some(now - span),
        to_iso: Some(now),
        limit: None,
    };
    let candles = indexer
        .markets()
        .get_candles(ticker, CandleResolution::M1, Some(opts))
        .await?;
    if candles.is_empty() {
        return Err(err!("Candles response is empty"));
    }
    let high = candles
        .iter()
        .max_by_key(|c| c.high.clone())
        .unwrap()
        .high
        .clone();
    let low = candles
        .iter()
        .min_by_key(|c| c.low.clone())
        .unwrap()
        .low
        .clone();
    Ok(Channel { low, high })
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    #[cfg(feature = "telemetry")]
    support::telemetry::metrics_dashboard().await?;
    let follower = TrendFollower::connect().await?;
    follower.entrypoint().await;
    Ok(())
}
