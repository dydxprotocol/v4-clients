mod env;
use env::TestEnv;

use anyhow::Error;
use serial_test::serial;

#[tokio::test]
#[serial]
async fn test_node_megavault_deposit() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let mut account = env.account;

    let subaccount = account.subaccount(0)?;

    let tx_res = node.megavault().deposit(&mut account, subaccount, 1).await;
    node.query_transaction_result(tx_res).await?;

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_megavault_withdraw() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let mut account = env.account;

    let subaccount = account.subaccount(0)?;

    let tx_res = node
        .megavault()
        .withdraw(&mut account, subaccount, 0, Some(&1.into()))
        .await;

    node.query_transaction_result(tx_res).await?;

    Ok(())
}

#[tokio::test]
async fn test_node_megavault_get_owner_shares() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let account = env.account;

    node.megavault().get_owner_shares(account.address()).await?;

    Ok(())
}

#[tokio::test]
async fn test_node_megavault_get_withdrawal_info() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;

    node.megavault().get_withdrawal_info(&1.into()).await?;

    Ok(())
}
