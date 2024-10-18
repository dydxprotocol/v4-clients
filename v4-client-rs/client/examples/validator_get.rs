mod support;
use anyhow::{Error, Result};
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::node::{NodeClient, Wallet};
use support::constants::TEST_MNEMONIC;

const ETH_USD_PAIR_ID: u32 = 1;

pub struct Getter {
    client: NodeClient,
    wallet: Wallet,
}

impl Getter {
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

    let block = getter.client.get_latest_block().await?;
    tracing::info!("Get latest block: {block:?}");

    let height = getter.client.get_latest_block_height().await?;
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

    let equity_tier_limit = getter.client.get_equity_tier_limit_config().await?;
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

    Ok(())
}
