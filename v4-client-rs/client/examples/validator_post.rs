mod support;
use anyhow::{Error, Result};
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::node::{NodeClient, Wallet};
use rand::{thread_rng, Rng};
use support::constants::TEST_MNEMONIC;
use tokio::time::{sleep, Duration};
use v4_proto_rs::dydxprotocol::clob::{
    order::{ConditionType, GoodTilOneof, Side, TimeInForce},
    Order, OrderId,
};
use v4_proto_rs::dydxprotocol::subaccounts::SubaccountId;

const ETH_USD_PAIR_ID: u32 = 1;
const ETH_USD_QUANTUMS: u64 = 10_000_000; // calculated based on market
const SUBTICKS: u64 = 40_000_000_000; // calculated based on market and price
const ORDER_FLAGS_SHORT_TERM: u32 = 0; // for short term order is 0
const N_ORDERS: usize = 6;

pub struct OrderPlacer {
    client: NodeClient,
    wallet: Wallet,
}

impl OrderPlacer {
    pub async fn connect() -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let client = NodeClient::connect(config.node).await?;
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        Ok(Self { client, wallet })
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    #[cfg(feature = "telemetry")]
    support::telemetry::metrics_dashboard().await?;
    let mut placer = OrderPlacer::connect().await?;
    let mut account = placer.wallet.account(0, &mut placer.client).await?;

    let subaccount = SubaccountId {
        owner: account.address().to_string(),
        number: 0,
    };
    let order_ids = (0..N_ORDERS)
        .map(|_| OrderId {
            subaccount_id: Some(subaccount.clone()),
            client_id: thread_rng().gen_range(0..100_000_000),
            order_flags: ORDER_FLAGS_SHORT_TERM,
            clob_pair_id: ETH_USD_PAIR_ID,
        })
        .collect::<Vec<OrderId>>();

    // Push some orders
    for id in &order_ids {
        // Short term orders have a maximum validity of 20 blocks
        let til_height = placer.client.get_latest_block_height().await?.ahead(10).0;
        let order = Order {
            order_id: Some(id.clone()),
            side: Side::Sell.into(),
            quantums: ETH_USD_QUANTUMS,
            subticks: SUBTICKS,
            time_in_force: TimeInForce::Unspecified.into(),
            reduce_only: false,
            client_metadata: 0u32,
            condition_type: ConditionType::Unspecified.into(),
            conditional_order_trigger_subticks: 0u64,
            good_til_oneof: Some(GoodTilOneof::GoodTilBlock(til_height)),
        };

        let tx_hash = placer.client.place_order(&mut account, order).await?;
        tracing::info!(
            "Broadcast order ({}) transaction hash: {:?}",
            id.client_id,
            tx_hash
        );
        sleep(Duration::from_secs(2)).await;
    }

    Ok(())
}
