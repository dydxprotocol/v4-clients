use crate::indexer::types::*;
use chrono::{DateTime, Utc};
use serde::Serialize;

/// Filter options for perpetual markets.
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ListPerpetualMarketsOpts {
    /// Limit.
    pub limit: Option<u32>,
    /// Ticker.
    pub ticker: Option<Ticker>,
}

/// Filter options for trades.
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GetTradesOpts {
    /// Limit.
    pub limit: Option<u32>,
    /// Block height.
    pub created_before_or_at_height: Option<Height>,
    /// Time.
    pub created_before_or_at: Option<DateTime<Utc>>,
}

/// Filter options for candles.
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GetCandlesOpts {
    /// Limit.
    pub limit: Option<u32>,
    /// Time.
    #[serde(rename = "fromISO")]
    pub from_iso: Option<DateTime<Utc>>,
    /// Time.
    #[serde(rename = "toISO")]
    pub to_iso: Option<DateTime<Utc>>,
}

/// Filter options for fundings.
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GetHistoricalFundingOpts {
    /// Limit.
    pub limit: Option<u32>,
    /// Block height.
    pub effective_before_or_at_height: Option<Height>,
    /// Time.
    pub effective_before_or_at: Option<DateTime<Utc>>,
}

/// Filter options for positions.
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ListPositionsOpts {
    /// Perpetual postion status.
    pub status: Option<PerpetualPositionStatus>,
    /// Limit.
    pub limit: Option<u32>,
    /// Block height.
    pub created_before_or_at_height: Option<Height>,
    /// Time.
    pub created_before_or_at: Option<DateTime<Utc>>,
}

/// Filter options for transfers.
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GetTransfersOpts {
    /// Limit.
    pub limit: Option<u32>,
    /// Block height.
    pub created_before_or_at_height: Option<Height>,
    /// Time.
    pub created_before_or_at: Option<DateTime<Utc>>,
}

/// Filter options for orders.
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ListOrdersOpts {
    /// Limit.
    pub limit: Option<u32>,
    /// Ticker.
    pub ticker: Option<Ticker>,
    /// Side (buy/sell).
    pub side: Option<OrderSide>,
    // TODO: Arrays is supported
    /// Order status.
    pub status: Option<OrderStatus>,
    /// Order type.
    #[serde(rename = "type")]
    pub order_type: Option<OrderType>,
    /// Block height.
    pub good_til_block_before_or_at: Option<Height>,
    /// Time.
    pub good_til_block_time_before_or_at: Option<DateTime<Utc>>,
    /// Whether to return the latest orders.
    pub return_latest_orders: Option<bool>,
}

/// Filter options for fills.
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GetFillsOpts {
    /// Limit.
    pub limit: Option<u32>,
    /// Block height.
    pub created_before_or_at_height: Option<Height>,
    /// Time.
    pub created_before_or_at: Option<DateTime<Utc>>,
    /// Ticker.
    pub market: Option<Ticker>,
    /// Market type.
    pub market_type: Option<MarketType>,
}

/// Filter options for profit and loss.
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GetHistoricalPnlOpts {
    /// Limit.
    pub limit: Option<u32>,
    /// Block height.
    pub created_before_or_at_height: Option<Height>,
    /// Time.
    pub created_before_or_at: Option<DateTime<Utc>>,
    /// Block height.
    pub created_on_or_after_height: Option<Height>,
    /// Time.
    pub created_on_or_after: Option<DateTime<Utc>>,
}

/// Filter options for rewards.
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GetTradingRewardsOpts {
    /// Limit.
    pub limit: Option<u32>,
    /// Block height.
    pub starting_before_or_at_height: Option<Height>,
    /// Time.
    pub starting_before_or_at: Option<DateTime<Utc>>,
}

/// Filter options for aggregated rewards.
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GetAggregationsOpts {
    /// Limit.
    pub limit: Option<u32>,
    /// Block height.
    pub starting_before_or_at_height: Option<Height>,
    /// Time.
    pub starting_before_or_at: Option<DateTime<Utc>>,
}
