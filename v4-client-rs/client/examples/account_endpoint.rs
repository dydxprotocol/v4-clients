mod support;

use anyhow::{Error, Result};
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::indexer::{
    GetAggregationsOpts, GetFillsOpts, GetHistoricalPnlOpts, GetTradingRewardsOpts,
    GetTransfersOpts, IndexerClient, ListOrdersOpts, ListPositionsOpts, MarketType, OrderSide,
    PerpetualPositionStatus, Ticker, TradingRewardAggregationPeriod,
};
use dydx_v4_rust::node::Wallet;
use support::constants::TEST_MNEMONIC;

pub struct Rester {
    indexer: IndexerClient,
    wallet: Wallet,
}

impl Rester {
    pub async fn connect() -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let indexer = IndexerClient::new(config.indexer);
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        Ok(Self { indexer, wallet })
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    let rester = Rester::connect().await?;
    let account = rester.wallet.account_offline(0)?;
    let indexer = rester.indexer;

    // Test values
    let address = account.address();
    let subaccount = account.subaccount(0)?;
    let parent_subaccount = subaccount.parent();

    let subaccounts = indexer.accounts().get_subaccounts(address).await?;
    tracing::info!("Subaccounts response: {:?}", subaccounts);

    let subaccount_resp = indexer.accounts().get_subaccount(&subaccount).await?;
    tracing::info!("Subaccount response: {:?}", subaccount_resp);

    let asset_positions = indexer.accounts().get_asset_positions(&subaccount).await?;
    tracing::info!("Asset positions response: {:?}", asset_positions);

    let pos_opts = ListPositionsOpts {
        status: PerpetualPositionStatus::Closed.into(),
        limit: Some(3),
        ..Default::default()
    };
    let positions = indexer
        .accounts()
        .list_positions(&subaccount, Some(pos_opts))
        .await?;
    tracing::info!("Perpetual positions response: {:?}", positions);

    let trf_opts = GetTransfersOpts {
        limit: Some(3),
        ..Default::default()
    };
    let transfers = indexer
        .accounts()
        .get_transfers(&subaccount, Some(trf_opts))
        .await?;
    tracing::info!("Transfers response: {:?}", transfers);

    let ord_opts = ListOrdersOpts {
        ticker: Some(Ticker::from("ETH-USD")),
        limit: Some(3),
        side: OrderSide::Buy.into(),
        ..Default::default()
    };
    let orders = indexer
        .accounts()
        .list_orders(&subaccount, Some(ord_opts))
        .await?;
    tracing::info!("Orders response: {:?}", orders);

    let fill_opts = GetFillsOpts {
        limit: Some(3),
        market: Some(Ticker::from("ETH-USD")),
        market_type: Some(MarketType::Perpetual),
        ..Default::default()
    };
    let fills = indexer
        .accounts()
        .get_fills(&subaccount, Some(fill_opts))
        .await?;
    tracing::info!("Fills response: {:?}", fills);

    let pnl_opts = GetHistoricalPnlOpts {
        limit: Some(3),
        ..Default::default()
    };
    let pnls = indexer
        .accounts()
        .get_historical_pnl(&subaccount, Some(pnl_opts))
        .await?;
    tracing::info!("Historical PnLs response: {:?}", pnls);

    let rwds_opts = GetTradingRewardsOpts {
        limit: Some(3),
        ..Default::default()
    };
    let rewards = indexer
        .accounts()
        .get_rewards(account.address(), Some(rwds_opts))
        .await?;
    tracing::info!("Trading rewards response: {:?}", rewards);

    let aggr_opts = GetAggregationsOpts {
        limit: Some(3),
        ..Default::default()
    };
    let aggregated = indexer
        .accounts()
        .get_rewards_aggregated(
            address,
            TradingRewardAggregationPeriod::Daily,
            Some(aggr_opts),
        )
        .await?;
    tracing::info!("Trading rewards aggregated response: {:?}", aggregated);

    // Parent subaccount
    let subaccount_resp = indexer
        .accounts()
        .get_parent_subaccount(&parent_subaccount)
        .await?;
    tracing::info!(
        "Subaccount response (parent subaccount): {:?}",
        subaccount_resp
    );

    let asset_positions = indexer
        .accounts()
        .get_parent_asset_positions(&parent_subaccount)
        .await?;
    tracing::info!(
        "Asset positions response (parent subaccount): {:?}",
        asset_positions
    );

    let pos_opts = ListPositionsOpts {
        status: PerpetualPositionStatus::Closed.into(),
        limit: Some(3),
        ..Default::default()
    };
    let positions = indexer
        .accounts()
        .list_parent_positions(&parent_subaccount, Some(pos_opts))
        .await?;
    tracing::info!(
        "Perpetual positions response (parent subaccount): {:?}",
        positions
    );

    let trf_opts = GetTransfersOpts {
        limit: Some(3),
        ..Default::default()
    };
    let transfers = indexer
        .accounts()
        .get_parent_transfers(&parent_subaccount, Some(trf_opts))
        .await?;
    tracing::info!("Transfers response (parent subaccount): {:?}", transfers);

    let ord_opts = ListOrdersOpts {
        ticker: Some(Ticker::from("ETH-USD")),
        limit: Some(3),
        side: OrderSide::Buy.into(),
        ..Default::default()
    };
    let orders = indexer
        .accounts()
        .list_parent_orders(&parent_subaccount, Some(ord_opts))
        .await?;
    tracing::info!("Orders response (parent subaccount): {:?}", orders);

    let fill_opts = GetFillsOpts {
        limit: Some(3),
        market: Some(Ticker::from("ETH-USD")),
        market_type: Some(MarketType::Perpetual),
        ..Default::default()
    };
    let fills = indexer
        .accounts()
        .get_parent_fills(&parent_subaccount, Some(fill_opts))
        .await?;
    tracing::info!("Fills response (parent subaccount): {:?}", fills);

    let pnl_opts = GetHistoricalPnlOpts {
        limit: Some(3),
        ..Default::default()
    };
    let pnls = indexer
        .accounts()
        .get_parent_historical_pnl(&parent_subaccount, Some(pnl_opts))
        .await?;
    tracing::info!("Historical PnLs response (parent subaccount): {:?}", pnls);

    Ok(())
}
