mod support;
use anyhow::{Error, Result};
use async_trait::async_trait;
use bigdecimal::BigDecimal;
use chrono::{TimeDelta, Utc};
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::indexer::{
    Address, ClientId, IndexerClient, PerpetualMarket, Subaccount, Ticker,
};
use dydx_v4_rust::node::{sequencer::*, Account, NodeClient, OrderBuilder, OrderSide, Wallet};
use std::sync::Arc;
use support::constants::TEST_MNEMONIC;
use tokio::sync::Mutex;
use tokio::time::{sleep, Duration};
use v4_proto_rs::dydxprotocol::clob::order::TimeInForce;

const ETH_USD_TICKER: &str = "ETH-USD";

pub struct OrderPlacer {
    client: NodeClient,
    market: PerpetualMarket,
    account: Account,
    subaccount: Subaccount,
}

impl OrderPlacer {
    pub async fn connect() -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let mut client = NodeClient::connect(config.node).await?;
        let indexer = IndexerClient::new(config.indexer);
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        let ticker = Ticker(ETH_USD_TICKER.into());
        let market = indexer.markets().get_perpetual_market(&ticker).await?;
        let account = wallet.account(0, &mut client).await?;
        let subaccount = account.subaccount(0)?;
        Ok(Self {
            client,
            market,
            account,
            subaccount,
        })
    }

    pub async fn place_order(&mut self) -> Result<()> {
        let (_, order) = OrderBuilder::new(self.market.clone(), self.subaccount.clone())
            .limit(OrderSide::Buy, 123, BigDecimal::new(2.into(), 2))
            .time_in_force(TimeInForce::Unspecified)
            .until(Utc::now() + TimeDelta::seconds(60))
            .long_term()
            .build(ClientId::random())?;

        self.client
            .place_order(&mut self.account, order)
            .await
            .map(drop)
            .map_err(Error::msg)
    }

    pub async fn fetch_sequence_number(&mut self) -> Result<u64> {
        let (_, sequence_number) = self.client.query_address(self.account.address()).await?;
        Ok(sequence_number)
    }
}

#[derive(Clone)]
pub struct CustomSequencer {
    counter: Arc<Mutex<u64>>,
    // Or use an Atomic in this case
}

impl CustomSequencer {
    pub fn new(start_at: u64) -> Self {
        Self {
            counter: Arc::new(Mutex::new(start_at)),
        }
    }
}

#[async_trait]
impl Sequencer for CustomSequencer {
    async fn next_nonce(&mut self, _: &Address) -> Result<Nonce, Error> {
        let mut counter = self.counter.lock().await;
        *counter += 1;
        Ok(Nonce::Sequence(*counter - 1))
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    #[cfg(feature = "telemetry")]
    support::telemetry::metrics_dashboard().await?;
    let mut placer = OrderPlacer::connect().await?;

    // In Cosmos-based blockchains, like dYdX, an account sequence number is used as a nonce to
    // prevent replay attacks. This affects only relevant requests: non-short term orders and transfer methods.
    // This crate provides three different mechanisms to set the account number:
    //
    // - QueryingSequencer: a request is made to the network to fetch the correct sequence number
    // to be used in the next transaction. This request is made for every relevant request
    // previously to the transaction broadcast.
    // - IncrementalSequencer: for each relevant request, a simple counter is increased. The
    // starting value counter must be set manually, using for example the value returned by
    // NodeClient::query_address().
    // - TimestamperSequencer: for each relevant request, the current timestamp (milliseconds) is
    // used.
    //
    // The Sequencer trait can be used to provide custom sequencers to the NodeClient.

    // By default, NodeClient uses the QueryingSequencer.
    placer.place_order().await?;
    sleep(Duration::from_secs(4)).await;
    tracing::info!(
        "(After QueryingSequencer) Sequence number: {}",
        placer.fetch_sequence_number().await?
    );

    // To use the incremental sequencer, create one with the to-be used addresses and initial
    // counters.
    let incremental_sequencer = IncrementalSequencer::new(&[(
        placer.account.address().clone(),
        placer.fetch_sequence_number().await?,
    )]);
    placer.client.with_sequencer(incremental_sequencer);

    placer.place_order().await?;
    sleep(Duration::from_secs(4)).await;
    tracing::info!(
        "(After IncrementalSequencer) Sequence number: {}",
        placer.fetch_sequence_number().await?
    );

    // And the timestamper sequencer,
    let timestamper_sequencer = TimestamperSequencer;
    placer.client.with_sequencer(timestamper_sequencer);

    placer.place_order().await?;
    sleep(Duration::from_secs(4)).await;
    tracing::info!(
        "(After TimestamperSequencer) Sequence number: {}",
        placer.fetch_sequence_number().await?
    );

    // To tackle other specific scenarios, a Sequencer can also be provided.
    // Here we try to tackle a concurrent scenario where different trading bots running in the same
    // process are utilizing the same account to issue long-term orders.
    // Note: here, orders may reach the network out-of-order, resulting in a sequencing error.
    let custom_sequencer = CustomSequencer::new(placer.fetch_sequence_number().await?);
    let mut placer1 = OrderPlacer::connect().await?;
    let mut placer2 = OrderPlacer::connect().await?;
    placer1.client.with_sequencer(custom_sequencer.clone());
    placer2.client.with_sequencer(custom_sequencer.clone());

    tokio::try_join!(placer1.place_order(), placer2.place_order())?;
    sleep(Duration::from_secs(4)).await;
    tracing::info!(
        "(After CustomSequencer, two orders) Sequence number: {}",
        placer.fetch_sequence_number().await?
    );

    Ok(())
}
