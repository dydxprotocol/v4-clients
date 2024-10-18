use bigdecimal::Zero;
use derive_more::{Deref, DerefMut};
use dydx_v4_rust::indexer::{
    Feed, OrderBookResponseObject, OrderbookResponsePriceLevel, OrdersMessage, Price, Quantity,
};
use std::collections::BTreeMap;
use std::fmt;
use tokio::sync::watch;
use tokio::task::JoinHandle;

#[derive(Deref, DerefMut)]
pub struct LiveOrderBook {
    handle: JoinHandle<()>,
    #[deref]
    #[deref_mut]
    rx: watch::Receiver<OrderBook>,
}

impl LiveOrderBook {
    pub fn new(feed: Feed<OrdersMessage>) -> Self {
        let (tx, rx) = watch::channel(OrderBook::default());
        let task = LiveOrderBookTask { feed, tx };
        let handle = tokio::spawn(task.entrypoint());
        Self { handle, rx }
    }
}

impl Drop for LiveOrderBook {
    fn drop(&mut self) {
        self.handle.abort();
    }
}

struct LiveOrderBookTask {
    feed: Feed<OrdersMessage>,
    tx: watch::Sender<OrderBook>,
}

impl LiveOrderBookTask {
    async fn entrypoint(mut self) {
        while let Some(msg) = self.feed.recv().await {
            match msg {
                OrdersMessage::Initial(upd) => {
                    self.tx.send_modify(move |order_book| {
                        order_book.update_bids(upd.contents.bids);
                        order_book.update_asks(upd.contents.asks);
                    });
                }
                OrdersMessage::Update(upd) => {
                    self.tx.send_modify(move |order_book| {
                        if let Some(bids) = upd.contents.bids {
                            order_book.update_bids(bids);
                        }
                        if let Some(asks) = upd.contents.asks {
                            order_book.update_asks(asks);
                        }
                    });
                }
            }
        }
    }
}

pub struct Quote<'a> {
    pub price: &'a Price,
    pub quantity: &'a Quantity,
}

impl<'a> From<(&'a Price, &'a Quantity)> for Quote<'a> {
    fn from((price, quantity): (&'a Price, &'a Quantity)) -> Self {
        Self { price, quantity }
    }
}

pub struct Spread<'a> {
    pub bid: Quote<'a>,
    pub ask: Quote<'a>,
}

#[derive(Default, Debug)]
pub struct OrderBook {
    /// Prices you can sell
    pub bids: BTreeMap<Price, Quantity>,
    /// Prices you can buy (how much the seller asks)
    pub asks: BTreeMap<Price, Quantity>,
}

impl OrderBook {
    pub fn bids(&self) -> impl Iterator<Item = Quote> {
        self.bids.iter().map(Quote::from).rev()
    }

    pub fn asks(&self) -> impl Iterator<Item = Quote> {
        self.asks.iter().map(Quote::from)
    }

    pub fn spread(&self) -> Option<Spread> {
        let bid = self.bids().next()?;
        let ask = self.asks().next()?;
        Some(Spread { bid, ask })
    }

    fn update(map: &mut BTreeMap<Price, Quantity>, levels: Vec<OrderbookResponsePriceLevel>) {
        for level in levels {
            if level.size.is_zero() {
                map.remove(&level.price);
            } else {
                map.insert(level.price, level.size);
            }
        }
    }

    pub fn update_bids(&mut self, bids: Vec<OrderbookResponsePriceLevel>) {
        Self::update(&mut self.bids, bids);
    }

    pub fn update_asks(&mut self, asks: Vec<OrderbookResponsePriceLevel>) {
        Self::update(&mut self.asks, asks);
    }

    pub fn table(&self) -> OrderBookTable {
        OrderBookTable { inner: self }
    }
}

impl From<OrderBookResponseObject> for OrderBook {
    fn from(response: OrderBookResponseObject) -> Self {
        let mut order_book = OrderBook::default();
        order_book.update_bids(response.bids);
        order_book.update_asks(response.asks);
        order_book
    }
}

pub struct OrderBookTable<'a> {
    inner: &'a OrderBook,
}

impl<'a> fmt::Display for OrderBookTable<'a> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        for (price, size) in &self.inner.bids {
            writeln!(f, "BID: {} - {}", price, size)?;
        }
        for (price, size) in &self.inner.asks {
            writeln!(f, "ASK: {} - {}", price, size)?;
        }
        Ok(())
    }
}
