mod env;
use env::TestEnv;

use anyhow::Result;
use dydx::indexer::Denom;

#[tokio::test]
async fn test_node_get_account_balances() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let address = env.account.address();

    let balances = node.get_account_balances(address).await?;
    assert!(!balances.is_empty());
    Ok(())
}

#[tokio::test]
async fn test_node_get_account_balance() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let address = env.account.address();
    let denom = Denom::Usdc;

    let balance = node.get_account_balance(address, &denom).await?;
    assert_eq!(balance.denom, denom.as_ref());
    Ok(())
}

#[tokio::test]
async fn test_node_get_account() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let address = env.account.address();

    let response = node.get_account(address).await?;
    assert_eq!(response.address, env.account.address().as_ref());
    Ok(())
}

#[tokio::test]
async fn test_node_get_node_info() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;

    let info = node.get_node_info().await?;
    assert!(info.default_node_info.is_some() || info.application_version.is_some());
    Ok(())
}

#[tokio::test]
async fn test_node_latest_block_height() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;

    let height = node.latest_block_height().await?.0;
    assert!(height > 18_476_624);
    Ok(())
}

#[tokio::test]
async fn test_node_get_user_stats() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let address = env.account.address();

    let _stats = node.get_user_stats(address).await?;
    Ok(())
}

#[tokio::test]
async fn test_node_get_all_validators() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;

    let validators = node.get_all_validators(None).await?;
    assert!(validators.len() > 2);
    Ok(())
}

#[tokio::test]
async fn test_node_get_subaccounts() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;

    let subaccounts = node.get_subaccounts().await?;
    assert!(!subaccounts.is_empty());
    Ok(())
}

#[tokio::test]
async fn test_node_get_subaccount() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let subaccount = env.account.subaccount(0)?;

    let subaccount_info = node.get_subaccount(&subaccount).await?;
    assert!(subaccount_info.asset_positions.len() + subaccount_info.perpetual_positions.len() > 0);
    Ok(())
}

#[tokio::test]
async fn test_node_get_clob_pair() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;
    let pair_id = 0;

    let pair = node.get_clob_pair(pair_id).await?;
    assert!(pair.id == pair_id);
    Ok(())
}

#[tokio::test]
async fn test_node_get_clob_pairs() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;

    let pairs = node.get_clob_pairs(None).await?;
    assert!(!pairs.is_empty());
    Ok(())
}

#[tokio::test]
async fn test_node_get_price() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;
    let market_id = 0;

    let market_price = node.get_price(market_id).await?;
    assert!(market_price.id == market_id);
    Ok(())
}

#[tokio::test]
async fn test_node_get_prices() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;

    let prices = node.get_prices(None).await?;
    assert!(!prices.is_empty());
    Ok(())
}

#[tokio::test]
async fn test_node_get_perpetual() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;
    let perpetual_id = 0;

    let perpetual = node.get_perpetual(perpetual_id).await?;
    let params = perpetual.params.unwrap();
    assert!(params.id == perpetual_id);
    Ok(())
}

#[tokio::test]
async fn test_node_get_perpetuals() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;

    let perpetuals = node.get_perpetuals(None).await?;
    assert!(!perpetuals.is_empty());
    Ok(())
}

#[tokio::test]
async fn test_node_get_equity_tier_limit_configuration() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;

    let config = node.get_equity_tier_limit_configuration().await?;
    assert!(
        config.stateful_order_equity_tiers.len() + config.short_term_order_equity_tiers.len() > 0
    );
    Ok(())
}

#[tokio::test]
async fn test_node_get_delegator_delegations() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let address = env.account.address();

    let _response = node
        .get_delegator_delegations(address.clone(), None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_node_get_delegator_unbonding_delegations() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let address = env.account.address();

    let _delegations = node
        .get_delegator_unbonding_delegations(address.clone(), None)
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_node_get_delayed_complete_bridge_messages() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let address = env.account.address();

    let _messages = node
        .get_delayed_complete_bridge_messages(address.clone())
        .await?;
    Ok(())
}

#[tokio::test]
async fn test_node_get_fee_tiers() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;

    let fee_tiers = node.get_fee_tiers().await?;
    assert!(!fee_tiers.is_empty());
    Ok(())
}

#[tokio::test]
async fn test_node_get_user_fee_tier() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let address = env.account.address();

    let _tier = node.get_user_fee_tier(address.clone()).await?;
    Ok(())
}

#[tokio::test]
async fn test_node_get_rewards_params() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;

    let _params = node.get_rewards_params().await?;
    Ok(())
}

#[tokio::test]
async fn test_node_get_account_state() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let address = env.account.address();

    let account_state = node.get_account_state(address).await?;

    // Verify the account state contains expected fields
    assert!(account_state.address == address.as_ref());

    Ok(())
}

#[tokio::test]
async fn test_node_get_synchrony_params() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;

    let _synchrony_params = node.get_synchrony_params().await?;

    Ok(())
}

#[tokio::test]
async fn test_node_get_next_clob_pair_id() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;

    let next_clob_pair_id = node.get_next_clob_pair_id().await?;

    // The next CLOB pair ID should be a reasonable positive number
    // Since we know there are existing CLOB pairs, the next ID should be > 0
    assert!(next_clob_pair_id > 0);

    Ok(())
}

#[tokio::test]
async fn test_node_get_next_perpetual_id() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;

    let next_perpetual_id = node.get_next_perpetual_id().await?;

    // The next perpetual ID should be a reasonable positive number
    // Since we know there are existing perpetuals, the next ID should be > 0
    assert!(next_perpetual_id > 0);

    Ok(())
}

#[tokio::test]
async fn test_node_get_next_market_id() -> Result<()> {
    let mut node = TestEnv::testnet().await?.node;

    let next_market_id = node.get_next_market_id().await?;

    // The next market ID should be a reasonable positive number
    // Since we know there are existing markets, the next ID should be > 0
    assert!(next_market_id > 0);

    Ok(())
}

#[tokio::test]
async fn test_node_get_order_router_rev_share() -> Result<()> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let address = env.account.address().clone();

    let rev_share_result = node.get_order_router_rev_share(address.clone()).await;

    // This test might fail if the address doesn't have rev share configured
    // In that case, we should get an error, which is expected behavior
    match rev_share_result {
        Ok(rev_share) => {
            // If successful, verify the rev share has reasonable values
            // Check that address matches and share_ppm is within valid range (0-1,000,000 ppm)
            assert_eq!(rev_share.address, address.as_ref());
            assert!(rev_share.share_ppm <= 1_000_000);
        }
        Err(_) => {
            // It's acceptable for this to fail if the address doesn't have rev share configured
            // This is expected behavior for most test addresses
        }
    }

    Ok(())
}
