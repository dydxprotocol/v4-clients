mod support;
use anyhow::{Error, Result};
use dydx::config::ClientConfig;
use dydx::node::{NodeClient, Wallet};
use dydx_proto::dydxprotocol::ratelimit::{
    QueryCapacityByDenomRequest, QueryCapacityByDenomResponse,
};
use support::constants::TEST_MNEMONIC;

const ETH_USD_PAIR_ID: u32 = 1;

pub struct Getter {
    client: NodeClient,
    wallet: Wallet,
}

impl Getter {
    pub async fn connect() -> Result<Self> {
        // Initialize rustls crypto provider
        support::crypto::init_crypto_provider();

        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let client = NodeClient::connect(config.node).await?;
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        Ok(Self { client, wallet })
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    let mut getter = Getter::connect().await?;
    // Test values
    let account = getter.wallet.account_offline(0)?;
    let address = account.address().clone();
    let subaccount = account.subaccount(0)?;

    let account = getter.client.get_account(&address).await?;
    tracing::info!("Get account: {account:?}");

    let balances = getter.client.get_account_balances(&address).await?;
    tracing::info!("Get account balances: {balances:?}");

    let balance = getter
        .client
        .get_account_balance(&address, &"adv4tnt".parse()?)
        .await?;
    tracing::info!("Get account balance: {balance:?}");

    let node_info = getter.client.get_node_info().await?;
    let version = node_info
        .application_version
        .map(|v| format!("{} v{} @{}", v.name, v.version, &v.git_commit[0..7]));
    tracing::info!(
        "Get node info (node version): {}",
        version.unwrap_or("unknown".into())
    );

    let block = getter.client.latest_block().await?;
    tracing::info!("Get latest block: {block:?}");

    let height = getter.client.latest_block_height().await?;
    tracing::info!("Get latest block height: {height:?}");

    let stats = getter.client.get_user_stats(&address).await?;
    tracing::info!("Get user stats: {stats:?}");

    let validators = getter.client.get_all_validators(None).await?;
    tracing::info!("Get all validators: {validators:?}");

    let subaccount = getter.client.get_subaccount(&subaccount).await?;
    tracing::info!("Get subaccount: {subaccount:?}");

    let subaccounts = getter.client.get_subaccounts().await?;
    tracing::info!("Get subaccounts: {subaccounts:?}");

    let clob_pair = getter.client.get_clob_pair(ETH_USD_PAIR_ID).await?;
    tracing::info!("Get clob pair: {clob_pair:?}");

    let clob_pairs = getter.client.get_clob_pairs(None).await?;
    tracing::info!("Get clob pairs: {clob_pairs:?}");

    let price = getter.client.get_price(ETH_USD_PAIR_ID).await?;
    tracing::info!("Get price: {price:?}");

    let prices = getter.client.get_prices(None).await?;
    tracing::info!("Get prices: {prices:?}");

    let perpetual = getter.client.get_perpetual(ETH_USD_PAIR_ID).await?;
    tracing::info!("Get perpetual: {perpetual:?}");

    let perpetuals = getter.client.get_perpetuals(None).await?;
    tracing::info!("Get perpetuals: {perpetuals:?}");

    let equity_tier_limit = getter.client.get_equity_tier_limit_configuration().await?;
    tracing::info!("Get equity tier limit config: {equity_tier_limit:?}");

    let delegations = getter
        .client
        .get_delegator_delegations(address.clone(), None)
        .await?;
    tracing::info!("Get delegator delegations: {delegations:?}");

    let unbonding_delegations = getter
        .client
        .get_delegator_unbonding_delegations(address.clone(), None)
        .await?;
    tracing::info!("Get delegator unbonding delegations: {unbonding_delegations:?}");

    let bridge_messages = getter
        .client
        .get_delayed_complete_bridge_messages(address.clone())
        .await?;
    tracing::info!("Get delayed complete bridge messages: {bridge_messages:?}");

    let fee_tiers = getter.client.get_fee_tiers().await?;
    tracing::info!("Get fee tiers: {fee_tiers:?}");

    let user_fee_tier = getter.client.get_user_fee_tier(address.clone()).await?;
    tracing::info!("Get user fee tier: {user_fee_tier:?}");

    let reward_params = getter.client.get_rewards_params().await?;
    tracing::info!("Get reward params: {reward_params:?}");

    let get_withdrawal_and_transfer_gating_status = getter
        .client
        .get_withdrawal_and_transfer_gating_status(ETH_USD_PAIR_ID)
        .await?;
    tracing::info!(
        "Get withdrawal and transfer gating status: {get_withdrawal_and_transfer_gating_status:?}"
    );

    let rewards_params: QueryCapacityByDenomResponse = getter
        .client
        .send_query(
            QueryCapacityByDenomRequest {
                denom: "adv4tnt".parse()?,
            },
            "/dydxprotocol.ratelimit.Query/CapacityByDenom",
        )
        .await?;
    tracing::info!("Capacity by denom request (using send_query): {rewards_params:?}");

    let get_withdrawal_capacity_by_denom = getter
        .client
        .get_withdrawal_capacity_by_denom("adv4tnt".parse()?)
        .await?;
    tracing::info!("Get withdrawal capacity by denom: {get_withdrawal_capacity_by_denom:?}");

    let affiliate_info = getter.client.get_affiliate_info(&address).await?;
    tracing::info!("Get affiliate info: {affiliate_info:?}");

    let affiliate_tiers = getter.client.get_all_affiliate_tiers().await?;
    tracing::info!("Get affiliate tiers: {affiliate_tiers:?}");

    let affiliate_whitelist = getter.client.get_affiliate_whitelist().await?;
    tracing::info!("Get affiliate whitelist: {affiliate_whitelist:?}");

    let referred_by = getter.client.get_referred_by(address.clone()).await?;
    tracing::info!("Get referred by: {referred_by:?}");

    // Account state query - returns timestamp nonce information
    let account_state = getter.client.get_account_state(&address).await?;
    tracing::info!("Get account state: {account_state:?}");

    // Synchrony params query - returns blockchain synchrony parameters
    let synchrony_params = getter.client.get_synchrony_params().await?;
    tracing::info!("Get synchrony params: {synchrony_params:?}");

    // Next CLOB pair ID - returns the next available CLOB pair identifier
    let next_clob_pair_id = getter.client.get_next_clob_pair_id().await?;
    tracing::info!("Get next CLOB pair ID: {next_clob_pair_id:?}");

    // Next perpetual ID - returns the next available perpetual identifier
    let next_perpetual_id = getter.client.get_next_perpetual_id().await?;
    tracing::info!("Get next perpetual ID: {next_perpetual_id:?}");

    // Next market ID - returns the next available market identifier
    let next_market_id = getter.client.get_next_market_id().await?;
    tracing::info!("Get next market ID: {next_market_id:?}");

    // Order router rev share - may return an error if address doesn't have rev share configured
    match getter.client.get_order_router_rev_share(address).await {
        Ok(rev_share) => {
            tracing::info!("Get order router rev share: {rev_share:?}");
        }
        Err(e) => {
            tracing::warn!("Order router rev share not configured for this address: {e}");
        }
    }

    // Market mapper revenue share params - returns global revenue share parameters
    let market_mapper_params = getter.client.get_market_mapper_revenue_share_params().await?;
    tracing::info!("Get market mapper revenue share params: {market_mapper_params:?}");

    // Market mapper rev share details - returns details for a specific market
    let market_mapper_details = getter.client.get_market_mapper_rev_share_details(ETH_USD_PAIR_ID).await?;
    tracing::info!("Get market mapper rev share details for market {ETH_USD_PAIR_ID}: {market_mapper_details:?}");

    // Unconditional rev share config - returns unconditional revenue share configuration
    let unconditional_config = getter.client.get_unconditional_rev_share_config().await?;
    tracing::info!("Get unconditional rev share config: {unconditional_config:?}");

    Ok(())
}
