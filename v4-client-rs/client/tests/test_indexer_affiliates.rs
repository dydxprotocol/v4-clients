use crate::env::TestEnv;
use anyhow::Result;

mod env;

#[tokio::test]
async fn test_indexer_affiliates_get_metadata() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer.affiliates().get_metadata(&env.address).await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_affiliates_get_address() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer.affiliates().get_address("UpperJamX3B").await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_affiliates_get_address_not_found() -> Result<()> {
    let env = TestEnv::testnet().await?;
    assert!(env.indexer.affiliates().get_address("test").await.is_err());
    Ok(())
}

#[tokio::test]
async fn test_indexer_affiliates_get_snapshot() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .affiliates()
        .get_snapshot(&[&env.address], None, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_affiliates_get_total_volume() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .affiliates()
        .get_total_volume(&env.address)
        .await?;
    Ok(())
}
