mod env;
use env::TestEnv;

use anyhow::{anyhow as err, Result};
use bigdecimal::BigDecimal;
use dydx_v4_rust::indexer::*;
use std::str::FromStr;

#[tokio::test]
async fn test_indexer_markets_list_perpetual_markets() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer.markets().list_perpetual_markets(None).await?;

    let opts = ListPerpetualMarketsOpts {
        ticker: Some(env.ticker),
        ..Default::default()
    };
    env.indexer
        .markets()
        .list_perpetual_markets(Some(opts))
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_markets_get_perpetual_market() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .markets()
        .get_perpetual_market(&env.ticker)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_markets_get_perpetual_market_orderbook() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .markets()
        .get_perpetual_market_orderbook(&env.ticker)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_markets_get_trades() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer.markets().get_trades(&env.ticker, None).await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_markets_get_candles() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let res = CandleResolution::M1;
    env.indexer
        .markets()
        .get_candles(&env.ticker, res, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_markets_get_historical_funding() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .markets()
        .get_historical_funding(&env.ticker, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_markets_get_sparklines() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let period = SparklineTimePeriod::OneDay;
    env.indexer.markets().get_sparklines(period).await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_utility_get_time() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer.utility().get_time().await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_utility_get_height() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer.utility().get_height().await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_utility_get_screen() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer.utility().get_screen(&env.address).await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_subaccounts() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer.accounts().get_subaccounts(&env.address).await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_subaccount() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_subaccount(&env.subaccount)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_parent_subaccount() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_parent_subaccount(&env.subaccount.parent())
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_list_positions() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .list_positions(&env.subaccount, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_list_parent_positions() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .list_parent_positions(&env.subaccount.parent(), None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_asset_positions() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_asset_positions(&env.subaccount)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_parent_asset_positions() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_parent_asset_positions(&env.subaccount.parent())
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_transfers() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_transfers(&env.subaccount, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_parent_transfers() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_parent_transfers(&env.subaccount.parent(), None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_list_orders() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .list_orders(&env.subaccount, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_list_parent_orders() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .list_parent_orders(&env.subaccount.parent(), None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_order() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let orders = env
        .indexer
        .accounts()
        .list_orders(&env.subaccount, None)
        .await?;
    let order = orders
        .first()
        .ok_or_else(|| err!("at least one order is required for testing"))?;
    env.indexer.accounts().get_order(&order.id).await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_fills() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_fills(&env.subaccount, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_parent_fills() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_parent_fills(&env.subaccount.parent(), None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_historical_pnl() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_historical_pnl(&env.subaccount, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_parent_historical_pnl() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_parent_historical_pnl(&env.subaccount.parent(), None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_rewards() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_rewards(&env.address, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_rewards_aggregated() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let period = TradingRewardAggregationPeriod::Daily;
    env.indexer
        .accounts()
        .get_rewards_aggregated(&env.address, period, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_perpetual_market_quantization() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let markets = env.indexer.markets().list_perpetual_markets(None).await?;
    let params = markets
        .get(&env.ticker)
        .ok_or_else(|| err!("The ticker {} has not found!", env.ticker))?
        .order_params();

    let price = BigDecimal::from_str("4321.1234")?;
    let quantized = params.quantize_price(price);
    let expected = BigDecimal::from_str("4321100000")?;
    assert_eq!(quantized, expected);

    let size = BigDecimal::from_str("4321.1234")?;
    let quantized = params.quantize_quantity(size);
    let expected = BigDecimal::from_str("4321123000000")?;
    assert_eq!(quantized, expected);
    Ok(())
}
