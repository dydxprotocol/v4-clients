mod env;
use env::TestEnv;

use anyhow::{anyhow as err, Error};
use bigdecimal::{num_traits::cast::ToPrimitive, BigDecimal, One};
use chrono::{TimeDelta, Utc};
use dydx_v4_rust::{
    indexer::{OrderExecution, Token},
    node::*,
};
use rand::{thread_rng, Rng};
use serial_test::serial;
use std::str::FromStr;
use tokio::time::{sleep, Duration};
use v4_proto_rs::dydxprotocol::{
    clob::{
        order::{self, ConditionType, Side, TimeInForce},
        Order, OrderBatch, OrderId,
    },
    subaccounts::SubaccountId,
};

const ETH_USD_PAIR_ID: u32 = 1; // information on market id can be fetch from indexer API

#[tokio::test]
async fn test_node_order_generator() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let market = env.get_market().await?;
    let height = env.get_height().await?;
    let account = env.account;

    // Test values
    let price = BigDecimal::from_str("4000.0")?;
    let subticks = 4_000_000_000_u64;
    let quantity = BigDecimal::from_str("0.1")?;
    let quantums = 100_000_000_u64;
    let client_id = 123456;

    let until_height = height.ahead(SHORT_TERM_ORDER_MAXIMUM_LIFETIME);
    let now = Utc::now();
    let until_time = now + TimeDelta::seconds(60);

    let oracle_price = market
        .oracle_price
        .clone()
        .expect("Market oracle price required for testing");
    let allowed_slippage = BigDecimal::from_str("1.5")?; // %
    let one = <BigDecimal as One>::one();
    let slippaged_price = oracle_price * (one - allowed_slippage.clone() / BigDecimal::from(100));
    let slippaged_subticks = market
        .order_params()
        .quantize_price(slippaged_price)
        .to_u64()
        .ok_or_else(|| err!("Failed converting slippage subticks to u64"))?;

    let generator = OrderBuilder::new(market, account.subaccount(0)?);

    // Short-term market order
    let order_ms = generator
        .clone()
        .market(OrderSide::Sell, quantity.clone())
        .allowed_slippage(allowed_slippage.clone())
        .until(until_height.clone())
        .build(client_id)?;

    let order_ms_r = Order {
        order_id: Some(OrderId {
            subaccount_id: Some(SubaccountId {
                owner: account.address().to_string(),
                number: 0,
            }),
            client_id,
            order_flags: 0_u32,
            clob_pair_id: 1_u32,
        }),
        side: Side::Sell.into(),
        quantums,
        subticks: slippaged_subticks,
        time_in_force: TimeInForce::Ioc.into(),
        reduce_only: false,
        client_metadata: DEFAULT_RUST_CLIENT_METADATA,
        condition_type: ConditionType::Unspecified.into(),
        conditional_order_trigger_subticks: 0u64,
        good_til_oneof: Some(order::GoodTilOneof::GoodTilBlock(until_height.0)),
    };

    // Conditional stop market order
    let order_mc = generator
        .clone()
        .stop_market(OrderSide::Sell, price.clone(), quantity.clone())
        .until(until_time)
        // Optional, defaults to 5%
        .allowed_slippage(allowed_slippage)
        .execution(OrderExecution::Ioc)
        .build(client_id)?;

    let order_mc_r = Order {
        order_id: Some(OrderId {
            subaccount_id: Some(SubaccountId {
                owner: account.address().to_string(),
                number: 0,
            }),
            client_id,
            order_flags: 32_u32,
            clob_pair_id: 1_u32,
        }),
        side: Side::Sell.into(),
        quantums,
        subticks: slippaged_subticks,
        time_in_force: TimeInForce::Ioc.into(),
        reduce_only: false,
        client_metadata: DEFAULT_RUST_CLIENT_METADATA,
        condition_type: ConditionType::StopLoss.into(),
        conditional_order_trigger_subticks: subticks,
        good_til_oneof: Some(order::GoodTilOneof::GoodTilBlockTime(
            until_time.timestamp().try_into().unwrap(),
        )),
    };

    // Long-term limit order
    let order_ll = generator
        .clone()
        .limit(OrderSide::Buy, price, quantity)
        .long_term()
        .until(until_time)
        .build(client_id)?;

    let order_ll_r = Order {
        order_id: Some(OrderId {
            subaccount_id: Some(SubaccountId {
                owner: account.address().to_string(),
                number: 0,
            }),
            client_id,
            order_flags: 64_u32,
            clob_pair_id: 1_u32,
        }),
        side: Side::Buy.into(),
        quantums,
        subticks,
        time_in_force: TimeInForce::Unspecified.into(),
        reduce_only: false,
        client_metadata: DEFAULT_RUST_CLIENT_METADATA,
        condition_type: ConditionType::Unspecified.into(),
        conditional_order_trigger_subticks: 0u64,
        good_til_oneof: Some(order::GoodTilOneof::GoodTilBlockTime(
            until_time.timestamp().try_into().unwrap(),
        )),
    };

    assert_eq!(order_ms.1, order_ms_r);
    assert_eq!(order_mc.1, order_mc_r);
    assert_eq!(order_ll.1, order_ll_r);

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_place_order() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let market = env.get_market().await?;
    let mut node = env.node;
    let mut account = env.account;
    let subaccount = account.subaccount(0)?;

    let (_id, order) = OrderBuilder::new(market, subaccount)
        .limit(OrderSide::Buy, 1, 1)
        .long_term()
        .until(Utc::now() + TimeDelta::seconds(60))
        .build(thread_rng().gen_range(0..100_000_000))?;

    let tx_res = node.place_order(&mut account, order).await;

    node.query_transaction_result(tx_res).await?;

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_place_order_market_short_term() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let market = env.get_market().await?;
    let height = env.get_height().await?;
    let mut node = env.node;
    let mut account = env.account;

    let (_id, order) = OrderBuilder::new(market, account.subaccount(0)?)
        .market(OrderSide::Buy, BigDecimal::from_str("0.001")?)
        .price(10) // Low slippage price to not execute
        .until(height.ahead(10))
        .build(thread_rng().gen_range(0..100_000_000))?;

    node.place_order(&mut account, order).await?;

    Ok(())
}

#[tokio::test]
#[serial]
#[ignore]
async fn test_node_cancel_order() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let market = env.get_market().await?;
    let mut node = env.node;
    let mut account = env.account;
    let subaccount = account.subaccount(0)?;

    let (id, order) = OrderBuilder::new(market, subaccount)
        .limit(OrderSide::Buy, 1, 1)
        .until(Utc::now() + TimeDelta::seconds(60))
        .long_term()
        .build(thread_rng().gen_range(0..100_000_000))?;
    let order_tx_hash = node.place_order(&mut account, order).await?;
    node.query_transaction(&order_tx_hash).await?;

    sleep(Duration::from_secs(2)).await;

    // Following requests will fail if account does not have funds
    let until = OrderGoodUntil::Time(Utc::now() + TimeDelta::seconds(60));
    let tx_res = node.cancel_order(&mut account, id, until).await;
    node.query_transaction_result(tx_res).await?;

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_deposit() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let mut account = env.account;

    let sender = account.address().clone();
    let recipient = account.subaccount(0)?;

    let tx_res = node.deposit(&mut account, sender, recipient, 1).await;
    node.query_transaction_result(tx_res).await?;

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_withdraw() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let mut account = env.account;

    let sender = account.subaccount(0)?;
    let recipient = account.address().clone();

    let tx_res = node.withdraw(&mut account, sender, recipient, 1).await;

    node.query_transaction_result(tx_res).await?;

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_transfer() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let mut account = env.account;

    let sender = account.subaccount(0)?;
    let recipient = account.subaccount(1)?;

    let tx_res = node.transfer(&mut account, sender, recipient, 1).await;

    node.query_transaction_result(tx_res).await?;

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_send_token() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let mut account = env.account;

    let sender = account.address().clone();
    let recipient = account.address().clone();

    let tx_res = node
        .send_token(&mut account, sender, recipient, Token::DydxTnt(1000.into()))
        .await;

    node.query_transaction_result(tx_res).await?;

    Ok(())
}

#[tokio::test]
#[serial]
#[ignore]
async fn test_node_batch_cancel_orders() -> Result<(), Error> {
    let mut env = TestEnv::testnet().await?;

    let order_id0 = env.spawn_order().await?;
    sleep(Duration::from_secs(2)).await;
    let order_id1 = env.spawn_order().await?;
    sleep(Duration::from_secs(2)).await;

    let mut node = env.node;
    let mut account = env.account;

    let subaccount = account.subaccount(0)?;

    let batch = OrderBatch {
        clob_pair_id: ETH_USD_PAIR_ID,
        client_ids: vec![order_id0.client_id, order_id1.client_id],
    };
    let cancels = vec![batch];
    let good_til = node
        .get_latest_block_height()
        .await?
        .ahead(SHORT_TERM_ORDER_MAXIMUM_LIFETIME);

    let tx_res = node
        .batch_cancel_orders(&mut account, subaccount, cancels, good_til)
        .await;
    node.query_transaction_result(tx_res).await?;

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_close_position() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let mut account = env.account;

    let subaccount = account.subaccount(0)?;
    let market = env
        .indexer
        .markets()
        .get_perpetual_market(&env.ticker)
        .await?;

    node.close_position(
        &mut account,
        subaccount,
        market,
        None,
        thread_rng().gen_range(0..100_000_000),
    )
    .await?;

    Ok(())
}
