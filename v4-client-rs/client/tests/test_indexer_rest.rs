mod env;
use env::TestEnv;

use anyhow::{anyhow as err, Result};
use bigdecimal::BigDecimal;
use dydx::indexer::*;
use std::str::FromStr;

#[tokio::test]
async fn test_indexer_markets_get_perpetual_markets() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer.markets().get_perpetual_markets(None).await?;

    let opts = ListPerpetualMarketsOpts {
        ticker: Some(env.ticker),
        ..Default::default()
    };
    env.indexer
        .markets()
        .get_perpetual_markets(Some(opts))
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
async fn test_indexer_markets_get_perpetual_market_trades() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .markets()
        .get_perpetual_market_trades(&env.ticker, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_markets_get_perpetual_market_candles() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let res = CandleResolution::M1;
    env.indexer
        .markets()
        .get_perpetual_market_candles(&env.ticker, res, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_markets_get_perpetual_market_historical_funding() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .markets()
        .get_perpetual_market_historical_funding(&env.ticker, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_markets_get_perpetual_market_sparklines() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let period = SparklineTimePeriod::OneDay;
    env.indexer
        .markets()
        .get_perpetual_market_sparklines(period)
        .await?;
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
async fn test_indexer_utility_screen() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer.utility().screen(&env.address).await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_utility_compliance_screen() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .utility()
        .compliance_screen(&env.address)
        .await?;
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
async fn test_indexer_account_get_subaccount_perpetual_positions() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_subaccount_perpetual_positions(&env.subaccount, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_parent_subaccount_perpetual_positions() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_parent_subaccount_perpetual_positions(&env.subaccount.parent(), None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_subaccount_asset_positions() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_subaccount_asset_positions(&env.subaccount)
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
async fn test_indexer_account_get_subaccount_transfers() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_subaccount_transfers(&env.subaccount, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_parent_subaccount_number_transfers() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_parent_subaccount_number_transfers(&env.subaccount.parent(), None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_subaccount_orders() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_subaccount_orders(&env.subaccount, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_parent_subaccount_number_orders() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_parent_subaccount_number_orders(&env.subaccount.parent(), None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_order() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let orders = env
        .indexer
        .accounts()
        .get_subaccount_orders(&env.subaccount, None)
        .await?;
    let order = orders
        .first()
        .ok_or_else(|| err!("at least one order is required for testing"))?;
    env.indexer.accounts().get_order(&order.id).await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_subaccount_fills() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_subaccount_fills(&env.subaccount, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_parent_subaccount_number_fills() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_parent_subaccount_number_fills(&env.subaccount.parent(), None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_subaccount_historical_pnls() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_subaccount_historical_pnls(&env.subaccount, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_parent_subaccount_number_historical_pnls() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_parent_subaccount_number_historical_pnls(&env.subaccount.parent(), None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_historical_block_trading_rewards() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_historical_block_trading_rewards(&env.address, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_historical_trading_rewards_aggregations() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let period = TradingRewardAggregationPeriod::Daily;
    env.indexer
        .accounts()
        .get_historical_trading_rewards_aggregations(&env.address, period, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_vaults_get_megavault_historical_pnl() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let resolution = PnlTickInterval::Hour;
    env.indexer
        .vaults()
        .get_megavault_historical_pnl(resolution)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_vaults_get_vaults_historical_pnl() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let resolution = PnlTickInterval::Hour;
    env.indexer
        .vaults()
        .get_vaults_historical_pnl(resolution)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_vaults_get_megavault_positions() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer.vaults().get_megavault_positions().await?;
    Ok(())
}

#[tokio::test]
async fn test_perpetual_market_quantization() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let markets = env.indexer.markets().get_perpetual_markets(None).await?;
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

#[tokio::test]
async fn test_indexer_account_get_transfers_between() -> Result<()> {
    let env = TestEnv::testnet().await?;

    let _transfers = env
        .indexer
        .accounts()
        .get_transfers_between(&env.subaccount, &env.subaccount_2, None)
        .await?;

    Ok(())
}

#[tokio::test]
async fn test_indexer_account_search_trader() -> Result<()> {
    const ADDRESS: &str = "dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art";
    const USERNAME: &str = "NoisyPlumPOX";
    const SUBACCOUNT_ID: &str = "8586bcf6-1f58-5ec9-a0bc-e53db273e7b0";
    const SUBACCOUNT_NUMBER: u32 = 0;

    let env = TestEnv::testnet().await?;
    let query_strings = vec![ADDRESS, USERNAME];

    for query in query_strings {
        let TraderSearchResponse { result } = env.indexer.accounts().search_trader(query).await?;
        let result = result.ok_or_else(|| err!("Trader not found"))?;

        assert_eq!(result.address, Address::from_str(ADDRESS)?);
        assert_eq!(
            result.subaccount_number,
            SubaccountNumber::try_from(SUBACCOUNT_NUMBER)?
        );
        assert_eq!(result.username, USERNAME);
        assert_eq!(
            result.subaccount_id,
            SubaccountId(SUBACCOUNT_ID.to_string())
        );
    }

    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_funding_payments() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_funding_payments(&env.subaccount, None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_indexer_account_get_funding_payments_for_parent_subaccount() -> Result<()> {
    let env = TestEnv::testnet().await?;
    env.indexer
        .accounts()
        .get_funding_payments_for_parent_subaccount(&env.subaccount.parent(), None)
        .await?;

    Ok(())
}
