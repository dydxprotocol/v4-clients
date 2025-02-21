mod env;
use env::TestEnv;

use anyhow::Error;
use dydx::node::*;
use serial_test::serial;
use tokio::time::{sleep, Duration};

#[tokio::test]
#[serial]
async fn test_node_auth_add_remove() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let mut account = env.account;
    let address = account.address().clone();
    let paccount = env.wallet.account_offline(1)?;

    // Create authenticator
    let authenticator = AuthenticatorBuilder::empty()
        .signature_verification(paccount.public_key().to_bytes())
        .build()?;

    // Add authenticator
    node.authenticators()
        .add(&mut account, address.clone(), authenticator)
        .await?;

    sleep(Duration::from_secs(4)).await;

    // Grab authenticator list
    let list0 = node
        .authenticators()
        .list(account.address().clone())
        .await?;

    let added_auth_id = list0.last().unwrap().id;

    sleep(Duration::from_secs(4)).await;

    // Remove the authenticator
    node.authenticators().remove(&mut account, address.clone(), added_auth_id).await?;

    sleep(Duration::from_secs(4)).await;

    // Grab authenticator list again
    let list1 = node
        .authenticators()
        .list(account.address().clone())
        .await?;

    println!("list len before removal: {}", list0.len());
    println!("list len after  removal: {}", list1.len());
    println!("removed authenticator still in the list? {:?}", list1.iter().any(|auths| auths.id == added_auth_id));
    
    assert!(list1.len() < list0.len());

    Ok(())
}
