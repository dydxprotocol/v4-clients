use bigdecimal::BigDecimal;
use chrono::{DateTime, Utc};
use derive_more::{Display, From};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::indexer::types::*;

/// REST Indexer response error.
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponseError {
    /// Errors.
    pub errors: Vec<ErrorMsg>,
}

/// REST Indexer error message.
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ErrorMsg {
    /// Message.
    pub msg: String,
    /// Parameter.
    pub param: String,
    /// Location.
    pub location: String,
}

/// Profit and loss tick id.
#[derive(Deserialize, Debug, Clone, From, Display, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct PnlTickId(pub String);

/// Transfer id.
#[derive(
    Serialize, Deserialize, Debug, Clone, From, Display, PartialEq, Eq, PartialOrd, Ord, Hash,
)]
pub struct TransferId(pub String);

/// Period to aggregate rewards over.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum TradingRewardAggregationPeriod {
    /// Day.
    Daily,
    /// Week.
    Weekly,
    /// Month.
    Monthly,
}

/// Sparkline time period.
#[derive(Serialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum SparklineTimePeriod {
    /// 1 day.
    OneDay,
    /// 7 days.
    SevenDays,
}

/// Fundings response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HistoricalFundingResponse {
    /// List of fundings
    pub historical_funding: Vec<HistoricalFundingResponseObject>,
}

/// Funding response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HistoricalFundingResponseObject {
    /// Market ticker.
    pub ticker: Ticker,
    /// Time.
    pub effective_at: DateTime<Utc>,
    /// Block height.
    pub effective_at_height: Height,
    /// Price.
    pub price: Price,
    /// Funding rate.
    pub rate: BigDecimal,
}

/// Sparkline response.
pub type SparklineResponseObject = HashMap<Ticker, Vec<BigDecimal>>;

/// Indexer server time.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TimeResponse {
    /// Time (UTC).
    pub iso: DateTime<Utc>,
    /// Unix epoch.
    pub epoch: f64,
}

/// Compliance response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ComplianceResponse {
    /// Whether the address is restricted.
    pub restricted: bool,
    /// Reason.
    pub reason: Option<String>,
}

/// Address response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AddressResponse {
    /// List of all subaccounts.
    pub subaccounts: Vec<SubaccountResponseObject>,
    /// Total rewards.
    pub total_trading_rewards: BigDecimal,
}

/// Subaccount response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SubaccountResponse {
    /// Subaccount.
    pub subaccount: SubaccountResponseObject,
}

/// Parent subaccount response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ParentSubaccountResponse {
    /// Subaccount.
    pub subaccount: ParentSubaccountResponseObject,
}

/// Asset positions response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AssetPositionResponse {
    /// Asset positions.
    pub positions: Vec<AssetPositionResponseObject>,
}

/// Perpetual positions response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PerpetualPositionResponse {
    /// Perpetual positions.
    pub positions: Vec<PerpetualPositionResponseObject>,
}

/// Transfers response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TransferResponse {
    /// List of transfers.
    pub transfers: Vec<TransferResponseObject>,
}

/// Transfer response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TransferResponseObject {
    /// Transfer id.
    pub id: TransferId,
    /// Time (UTC).
    pub created_at: DateTime<Utc>,
    /// Block height.
    pub created_at_height: Height,
    /// Sender of transfer.
    pub sender: Account,
    /// Recipient of transfer.
    pub recipient: Account,
    /// Size of transfer.
    pub size: BigDecimal,
    /// Token symbol.
    pub symbol: Symbol,
    /// Transfer transaction hash.
    pub transaction_hash: String,
    /// Transfer type.
    #[serde(rename = "type")]
    pub transfer_type: TransferType,
}

/// Orders list response.
pub type ListOrdersResponse = Vec<OrderResponseObject>;

/// Fills response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FillResponse {
    /// List of fills.
    pub fills: Vec<FillResponseObject>,
}

/// Fill response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FillResponseObject {
    /// Fill id.
    pub id: FillId,
    /// Side (buy/sell).
    pub side: OrderSide,
    /// Size.
    pub size: BigDecimal,
    /// Fee.
    pub fee: BigDecimal,
    /// Fill type.
    #[serde(rename = "type")]
    pub fill_type: FillType,
    /// Liquidity.
    pub liquidity: Liquidity,
    /// Market ticker.
    pub market: Ticker,
    /// Market type.
    pub market_type: MarketType,
    /// Price.
    pub price: Price,
    /// Subaccount number.
    pub subaccount_number: SubaccountNumber,
    /// Block height.
    pub created_at_height: Height,
    /// Time (UTC).
    pub created_at: DateTime<Utc>,
    /// Client metadata.
    pub client_metadata: Option<ClientMetadata>,
    /// Order id.
    pub order_id: Option<OrderId>,
}

/// Profit and loss reports.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HistoricalPnlResponse {
    /// List of PnL reports.
    pub historical_pnl: Vec<PnlTicksResponseObject>,
}

/// Profit and loss report.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PnlTicksResponseObject {
    /// Report id.
    pub id: PnlTickId,
    /// Subaccount id.
    pub subaccount_id: SubaccountId,
    /// Block height.
    pub block_height: Height,
    /// Time (UTC).
    pub block_time: DateTime<Utc>,
    /// Time (UTC).
    pub created_at: DateTime<Utc>,
    /// Equity.
    pub equity: BigDecimal,
    /// Total PnL.
    pub total_pnl: BigDecimal,
    /// Net transfers.
    pub net_transfers: BigDecimal,
}

/// Trading rewards reports.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HistoricalBlockTradingRewardsResponse {
    /// List of reports.
    pub rewards: Vec<HistoricalBlockTradingReward>,
}

/// Trading rewards report.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HistoricalBlockTradingReward {
    /// Trading reward amount.
    pub trading_reward: BigDecimal,
    /// Block height.
    pub created_at_height: Height,
    /// Time (UTC).
    pub created_at: DateTime<Utc>,
}

/// Trading rewards aggregation reports.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HistoricalTradingRewardAggregationsResponse {
    /// List of reports.
    pub rewards: Vec<HistoricalTradingRewardAggregation>,
}

/// Trading rewards aggregation report.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HistoricalTradingRewardAggregation {
    /// Trading reward amount.
    pub trading_reward: BigDecimal,
    /// Block height.
    pub started_at_height: Height,
    /// Time (UTC).
    pub started_at: DateTime<Utc>,
    /// Block height.
    pub ended_at_height: Option<Height>,
    /// Time (UTC).
    pub ended_at: Option<DateTime<Utc>>,
    /// Aggregation period.
    pub period: TradingRewardAggregationPeriod,
}
