mod env;
use env::TestEnv;

use anyhow::Error;
use bigdecimal::BigDecimal;
use dydx::node::*;
use rand::{thread_rng, Rng};
use serial_test::serial;
use std::str::FromStr;
use tokio::time::{sleep, Duration};

#[tokio::test]
async fn test_node_auth_list() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let account = env.account;

    node.authenticators()
        .list(account.address().clone())
        .await?;

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_auth_add_allof() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let mut account = env.account;
    let address = account.address().clone();
    let paccount = env.wallet.account_offline(1)?;

    let authenticator = AuthenticatorBuilder::empty()
        .all_of()
        .signature_verification(paccount.public_key().to_bytes())
        .filter_message(&["/dydxprotocol.clob.MsgPlaceOrder"])
        .filter_subaccount([0])?
        .filter_clob_pair([0, 1])
        .build()?;
    println!("authenticator: {authenticator:?}");
    node.authenticators()
        .add(&mut account, address, authenticator)
        .await?;

    sleep(Duration::from_secs(3)).await;

    let list = node
        .authenticators()
        .list(account.address().clone())
        .await?;
    assert!(!list.is_empty());

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_auth_add_single() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let mut account = env.account;
    let address = account.address().clone();
    let paccount = env.wallet.account_offline(1)?;

    let authenticator = AuthenticatorBuilder::empty()
        .signature_verification(paccount.public_key().to_bytes())
        .filter_message(&["/dydxprotocol.clob.MsgPlaceOrder"])
        .build()?;
    node.authenticators()
        .add(&mut account, address, authenticator)
        .await?;

    sleep(Duration::from_secs(3)).await;

    let list = node
        .authenticators()
        .list(account.address().clone())
        .await?;
    assert!(!list.is_empty());

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_auth_place_order_short_term() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let market = env.get_market().await?;
    let height = env.get_height().await?;
    let mut node = env.node;
    let mut account = env.account;
    let address = account.address().clone();
    let mut paccount = env.wallet.account(1, &mut node).await?;

    // Add authenticator
    let authenticator = AuthenticatorBuilder::empty()
        .signature_verification(paccount.public_key().to_bytes())
        .filter_message(&["/dydxprotocol.clob.MsgPlaceOrder"])
        .all_of()
        .build()?;
    node.authenticators()
        .add(&mut account, address.clone(), authenticator)
        .await?;

    sleep(Duration::from_secs(3)).await;

    // Grab last authenticator ID
    let list = node.authenticators().list(address.clone()).await?;
    let master = PublicAccount::updated(account.address().clone(), &mut node).await?;
    paccount
        .authenticators_mut()
        .add(master, list.last().unwrap().id);

    // Create order for permissioning account
    let (_, order) = OrderBuilder::new(market, account.subaccount(0)?)
        .market(OrderSide::Buy, BigDecimal::from_str("0.001")?)
        .price(10) // Low slippage price to not execute
        .until(height.ahead(10))
        .build(thread_rng().gen_range(0..100_000_000))?;

    // Push order by permissioned account
    node.place_order(&mut paccount, order).await?;

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_auth_remove() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let mut account = env.account;
    let address = account.address().clone();

    let list = node.authenticators().list(address.clone()).await?;
    // Lets take the opportunity here and remove a few
    for auth in list.iter().rev().take(5) {
        node.authenticators()
            .remove(&mut account, address.clone(), auth.id)
            .await?;
        sleep(Duration::from_secs(3)).await;
    }

    Ok(())
}
