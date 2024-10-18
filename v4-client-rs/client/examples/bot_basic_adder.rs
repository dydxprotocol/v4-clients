mod support;

use anyhow::{anyhow as err, Error, Result};
use bigdecimal::{BigDecimal, One, Signed};
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::indexer::{
    AnyId, Feed, IndexerClient, ListPerpetualMarketsOpts, PerpetualMarket, Price, Quantity,
    SubaccountsMessage, Ticker, TradesMessage,
};
use dydx_v4_rust::node::{Account, NodeClient, OrderBuilder, OrderId, OrderSide, Wallet};
use std::str::FromStr;
use support::constants::TEST_MNEMONIC;
use support::order_book::LiveOrderBook;
use tokio::select;

pub struct Parameters {
    ticker: Ticker,
    depth: BigDecimal,
    allowed_deviation: BigDecimal,
    max_position: Quantity,
}

pub struct Variables {
    position: Quantity,
    state: State,
}

enum State {
    Resting { price: Price, oid: OrderId },
    InFlightOrder,
    Cancelled,
}

pub struct BasicAdder {
    client: NodeClient,
    #[allow(dead_code)] // TODO remove after completion
    indexer: IndexerClient,
    #[allow(dead_code)] // TODO remove after completion
    wallet: Wallet,
    account: Account,
    #[allow(dead_code)] // TODO remove after completion
    market: PerpetualMarket,
    generator: OrderBuilder,
    trades_feed: Feed<TradesMessage>,
    subaccounts_feed: Feed<SubaccountsMessage>,
    order_book: LiveOrderBook,
    parameters: Parameters,
    variables: Variables,
}

impl BasicAdder {
    pub async fn connect() -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let mut client = NodeClient::connect(config.node).await?;
        let mut indexer = IndexerClient::new(config.indexer);
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        let account = wallet.account(0, &mut client).await?;
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

        let trades_feed = indexer.feed().trades(&ticker, false).await?;
        let orders_feed = indexer.feed().orders(&ticker, false).await?;
        let subaccounts_feed = indexer.feed().subaccounts(subaccount, false).await?;
        let order_book = LiveOrderBook::new(orders_feed);
        let depth: BigDecimal = BigDecimal::from_str("0.001")?;
        let allowed_deviation: BigDecimal = BigDecimal::from_str("0.2")?;
        let max_position: Quantity = "1.0".parse()?;
        let parameters = Parameters {
            ticker,
            depth,
            allowed_deviation,
            max_position,
        };
        let variables = Variables {
            position: 0.into(),
            state: State::Cancelled,
        };
        Ok(Self {
            client,
            indexer,
            wallet,
            account,
            market,
            generator,
            trades_feed,
            subaccounts_feed,
            order_book,
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
            let side = if self.variables.position.is_negative() {
                OrderSide::Buy
            } else {
                OrderSide::Sell
            };

            let one = <BigDecimal as One>::one();
            let (book_price, ideal_price) = match side {
                OrderSide::Buy => (&bid, bid.clone() * (one + &self.parameters.depth)),
                OrderSide::Sell => (&ask, ask.clone() * (one - &self.parameters.depth)),
                other => panic!("Unhandled side {other:?}!"),
            };
            let ideal_distance = &book_price.0 * &self.parameters.depth;

            match &self.variables.state {
                State::Resting { price, oid } => {
                    let distance = (ideal_price.clone() - price.clone()).abs();
                    if distance > &self.parameters.allowed_deviation * ideal_distance {
                        tracing::info!(
                            "Cancelling order due to deviation: ID:{} side:{:?} ideal_price:{} price:{}",
                            oid.client_id, side, ideal_price, price
                        );
                        self.cancel_order(oid.clone()).await?;
                        self.variables.state = State::Cancelled;
                    }
                }
                State::InFlightOrder => {
                    tracing::info!("Not placing an order because in flight");
                }
                State::Cancelled => {
                    let size = &self.parameters.max_position.0 - self.variables.position.abs();
                    if &size * &ideal_price.0 < BigDecimal::from_str("3.0")? {
                        tracing::info!("Not placing an order because at position limit: size:{size} ideal_price:{ideal_price}");
                        return Ok(());
                    }
                    self.variables.state = State::InFlightOrder;
                    if let Ok(oid) = self
                        .place_limit_order(side, ideal_price.clone(), size)
                        .await
                    {
                        self.variables.state = State::Resting {
                            price: ideal_price,
                            oid,
                        };
                    } else {
                        self.variables.state = State::Cancelled;
                    }
                }
            }
        }
        Ok(())
    }

    async fn place_limit_order(
        &mut self,
        side: OrderSide,
        price: Price,
        size: BigDecimal,
    ) -> Result<OrderId> {
        let current_block = self.client.get_latest_block_height().await?;
        let (id, order) = self
            .generator
            .clone()
            .limit(side, price, size)
            .until(current_block.ahead(10))
            .build(AnyId)?;
        let hash = self.client.place_order(&mut self.account, order).await?;
        tracing::info!("Placing {side:?} order: {hash} (ID: {})", id.client_id);

        Ok(id)
    }

    async fn cancel_order(&mut self, id: OrderId) -> Result<()> {
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
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    #[cfg(feature = "telemetry")]
    support::telemetry::metrics_dashboard().await?;
    let adder = BasicAdder::connect().await?;
    adder.entrypoint().await;
    Ok(())
}
