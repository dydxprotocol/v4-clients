mod support;
use anyhow::{Error, Result};
use bigdecimal::BigDecimal;
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::indexer::{ClientId, IndexerClient};
use dydx_v4_rust::node::{
    NodeClient, OrderBuilder, OrderSide, Wallet, SHORT_TERM_ORDER_MAXIMUM_LIFETIME,
};
use rand::thread_rng;
use std::str::FromStr;
use support::constants::TEST_MNEMONIC;
use tokio::time::{sleep, Duration};
use v4_proto_rs::dydxprotocol::clob::{order::TimeInForce, OrderBatch};

const N_ORDERS: usize = 6;

const ETH_USD_TICKER: &str = "ETH-USD";

pub struct OrderPlacer {
    client: NodeClient,
    indexer: IndexerClient,
    wallet: Wallet,
}

impl OrderPlacer {
    pub async fn connect() -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let client = NodeClient::connect(config.node).await?;
        let indexer = IndexerClient::new(config.indexer);
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        Ok(Self {
            client,
            indexer,
            wallet,
        })
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    #[cfg(feature = "telemetry")]
    support::telemetry::metrics_dashboard().await?;
    let mut placer = OrderPlacer::connect().await?;
    let mut account = placer.wallet.account(0, &mut placer.client).await?;

    let subaccount = account.subaccount(0)?;

    let market = placer
        .indexer
        .markets()
        .get_perpetual_market(&ETH_USD_TICKER.into())
        .await?;

    let builder = OrderBuilder::new(market.clone(), subaccount.clone())
        .market(OrderSide::Buy, BigDecimal::from_str("0.001")?)
        .price(100)
        .reduce_only(false)
        .time_in_force(TimeInForce::Unspecified);

    let mut client_ids = Vec::new();
    // Push some orders
    for _id in 0..N_ORDERS {
        // Short term orders have a maximum validity of 20 blocks
        let height = placer.client.get_latest_block_height().await?;
        let order_builder = builder.clone().until(height.ahead(10));

        let (order_id, order) =
            order_builder.build(ClientId::random_with_rng(&mut thread_rng()))?;
        let client_id = order_id.client_id;
        client_ids.push(client_id);
        let tx_hash = placer.client.place_order(&mut account, order).await?;
        tracing::info!("Broadcast order ({client_id}) transaction hash: {tx_hash:?}");
        sleep(Duration::from_secs(2)).await;
    }

    // Batch cancel
    let batch = OrderBatch {
        clob_pair_id: market.clob_pair_id.0,
        client_ids,
    };
    let til_height = placer
        .client
        .get_latest_block_height()
        .await?
        .ahead(SHORT_TERM_ORDER_MAXIMUM_LIFETIME);
    let tx_hash = placer
        .client
        .batch_cancel_orders(&mut account, subaccount, vec![batch], til_height)
        .await?;
    tracing::info!(
        "Broadcast cancel orders batch transaction hash: {:?}",
        tx_hash
    );

    Ok(())
}
