use bigdecimal::BigDecimal;
use chrono::{DateTime, Utc};
use derive_more::{Display, From};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::indexer::types::*;

/// REST Indexer response error.
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct ResponseError {
    /// Errors.
    pub errors: Vec<ErrorMsg>,
}

/// REST Indexer error message.
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
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

/// PnL tick resolution.
#[derive(
    Deserialize, Serialize, Debug, Clone, Copy, From, Display, PartialEq, Eq, PartialOrd, Ord, Hash,
)]
#[serde(rename_all = "lowercase")]
pub enum PnlTickInterval {
    /// Hour.
    Hour,
    /// Day.
    Day,
}

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
#[serde(deny_unknown_fields)]
pub struct HistoricalFundingResponse {
    /// List of fundings
    pub historical_funding: Vec<HistoricalFundingResponseObject>,
}

/// Funding response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
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
#[serde(deny_unknown_fields)]
pub struct TimeResponse {
    /// Time (UTC).
    pub iso: DateTime<Utc>,
    /// Unix epoch.
    pub epoch: f64,
}

/// Compliance response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct ComplianceResponse {
    /// Whether the address is restricted.
    pub restricted: bool,
    /// Reason.
    pub reason: Option<String>,
}

/// Compliance status.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ComplianceStatus {
    /// Compliant.
    Compliant,
    /// First strike close only.
    FirstStrikeCloseOnly,
    /// First strike.
    FirstStrike,
    /// Close only.
    CloseOnly,
    /// Blocked.
    Blocked,
}

/// Compliance reason.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ComplianceReason {
    /// Manual.
    Manual,
    /// US geo.
    UsGeo,
    /// CA geo.
    CaGeo,
    /// GB geo.
    GbGeo,
    /// Sanctioned geo.
    SanctionedGeo,
    /// Compliance provider.
    ComplianceProvider,
}

/// Compliance response v2.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct ComplianceV2Response {
    /// Status.
    pub status: ComplianceStatus,
    /// Reason.
    pub reason: Option<ComplianceReason>,
    /// Updated at.
    pub updated_at: Option<DateTime<Utc>>,
}

/// Address response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct AddressResponse {
    /// List of all subaccounts.
    pub subaccounts: Vec<SubaccountResponseObject>,
    /// Total rewards.
    pub total_trading_rewards: BigDecimal,
}

/// Subaccount response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct SubaccountResponse {
    /// Subaccount.
    pub subaccount: SubaccountResponseObject,
}

/// Parent subaccount response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct ParentSubaccountResponse {
    /// Subaccount.
    pub subaccount: ParentSubaccountResponseObject,
}

/// Asset positions response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct AssetPositionResponse {
    /// Asset positions.
    pub positions: Vec<AssetPositionResponseObject>,
}

/// Perpetual positions response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct PerpetualPositionResponse {
    /// Perpetual positions.
    pub positions: Vec<PerpetualPositionResponseObject>,
}

/// Pagination request.
#[derive(Serialize, Default, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct PaginationRequest {
    /// Limit.
    pub limit: Option<u32>,
    /// Offset.
    pub offset: Option<u32>,
}

/// Affiliate metadata response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct AffiliateMetadataResponse {
    /// Referral code.
    pub referral_code: String,
    /// Is volume eligible.
    pub is_volume_eligible: bool,
    /// Is affiliate.
    pub is_affiliate: bool,
}

/// Affiliate address response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct AffiliateAddressResponse {
    /// Address.
    pub address: Address,
}

/// Affiliate snapshot response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct AffiliateSnapshotResponse {
    /// Affiliate list.
    pub affiliate_list: Vec<AffiliateSnapshotResponseObject>,
    /// Total.
    pub total: u32,
    /// Current offset.
    pub current_offset: u32,
}

/// Affiliate snapshot response object.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct AffiliateSnapshotResponseObject {
    /// Affiliate address.
    pub affiliate_address: Address,
    /// Affiliate referral code.
    pub affiliate_referral_code: String,
    /// Affiliate earnings.
    pub affiliate_earnings: BigDecimal,
    /// Affiliate referred trades.
    pub affiliate_referred_trades: u32,
    /// Affiliate total referred fees.
    pub affiliate_total_referred_fees: BigDecimal,
    /// Affiliate referred users.
    pub affiliate_referred_users: u32,
    /// Affiliate referred net protocol earnings.
    pub affiliate_referred_net_protocol_earnings: BigDecimal,
    /// Affiliate referred total volume.
    pub affiliate_referred_total_volume: BigDecimal,
    /// Affiliate referred maker fees.
    pub affiliate_referred_maker_fees: BigDecimal,
    /// Affiliate referred taker fees.
    pub affiliate_referred_taker_fees: BigDecimal,
    /// Affiliate referred maker rebates.
    pub affiliate_referred_maker_rebates: BigDecimal,
}

/// Affiliate total volume response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct AffiliateTotalVolumeResponse {
    /// Total volume.
    pub total_volume: Option<BigDecimal>,
}

/// Pagination response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct PaginationResponse {
    /// Page size.
    pub page_size: Option<u32>,
    /// Total results.
    pub total_results: Option<u32>,
    /// Offset.
    pub offset: Option<u32>,
}

/// Transfers response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct TransferResponse {
    /// List of transfers.
    pub transfers: Vec<TransferResponseObject>,
    /// Pagination.
    #[serde(flatten)]
    pub pagination: PaginationResponse,
}

/// Parent subaccount transfer response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct ParentSubaccountTransferResponse {
    /// List of transfers.
    pub transfers: Vec<ParentSubaccountTransferResponseObject>,
}

/// Trader search response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct TraderSearchResponse {
    /// Result.
    pub result: Option<TraderSearchResponseObject>,
}

/// Trader search response object.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct TraderSearchResponseObject {
    /// Address.
    pub address: Address,
    /// Subaccount number.
    pub subaccount_number: SubaccountNumber,
    /// Subaccount id.
    pub subaccount_id: SubaccountId,
    /// Username.
    pub username: String,
}

/// Transfer between response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct TransferBetweenResponse {
    /// List of transfers.
    pub transfers_subset: Vec<TransferResponseObject>,
    /// Total net transfers.
    pub total_net_transfers: BigDecimal,
    /// Pagination.
    #[serde(flatten)]
    pub pagination: PaginationResponse,
}

/// Funding payment response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct FundingPaymentResponse {
    /// List of funding payments.
    pub funding_payments: Vec<FundingPaymentResponseObject>,
    /// Pagination.
    #[serde(flatten)]
    pub pagination: PaginationResponse,
}

/// Funding payment response object.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct FundingPaymentResponseObject {
    /// Time (UTC).
    pub created_at: DateTime<Utc>,
    /// Block height.
    pub created_at_height: Height,
    /// Perpetual id.
    pub perpetual_id: String,
    /// Ticker.
    pub ticker: Ticker,
    /// Oracle price.
    pub oracle_price: BigDecimal,
    /// Size.
    pub size: BigDecimal,
    /// Side.
    pub side: FundingOrderSide,
    /// Rate.
    pub rate: BigDecimal,
    /// Payment.
    pub payment: BigDecimal,
    /// Subaccount number.
    pub subaccount_number: SubaccountNumber,
    /// Funding index.
    pub funding_index: String,
}

/// Funding order side.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum FundingOrderSide {
    /// Long.
    Long,
    /// Short.
    Short,
}

/// Transfer response.
/// T is the type of the sender and recipient.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct TransferResponseObject {
    /// Transfer id.
    pub id: TransferId,
    /// Sender of transfer.
    pub sender: Account,
    /// Recipient of transfer.
    pub recipient: Account,
    /// Size of transfer.
    pub size: BigDecimal,
    /// Time (UTC).
    pub created_at: DateTime<Utc>,
    /// Block height.
    pub created_at_height: Height,
    /// Token symbol.
    pub symbol: Symbol,
    /// Transfer type.
    #[serde(rename = "type")]
    pub transfer_type: TransferType,
    /// Transfer transaction hash.
    pub transaction_hash: String,
}

/// Parent subaccount transfer response object.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct ParentSubaccountTransferResponseObject {
    /// Transfer id.
    pub id: TransferId,
    /// Sender of transfer.
    pub sender: AccountWithParentSubaccountNumber,
    /// Recipient of transfer.
    pub recipient: AccountWithParentSubaccountNumber,
    /// Size of transfer.
    pub size: BigDecimal,
    /// Time (UTC).
    pub created_at: DateTime<Utc>,
    /// Block height.
    pub created_at_height: Height,
    /// Token symbol.
    pub symbol: Symbol,
    /// Transfer type.
    #[serde(rename = "type")]
    pub transfer_type: TransferType,
    /// Transfer transaction hash.
    pub transaction_hash: String,
}

/// Orders list response.
pub type ListOrdersResponse = Vec<OrderResponseObject>;

/// Fills response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct FillResponse {
    /// List of fills.
    pub fills: Vec<FillResponseObject>,
}

/// Fill response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct FillResponseObject {
    /// Fill id.
    pub id: FillId,
    /// Side (buy/sell).
    pub side: OrderSide,
    /// Liquidity.
    pub liquidity: Liquidity,
    /// Fill type.
    #[serde(rename = "type")]
    pub fill_type: FillType,
    /// Market ticker.
    pub market: Ticker,
    /// Market type.
    pub market_type: MarketType,
    /// Price.
    pub price: Price,
    /// Size.
    pub size: BigDecimal,
    /// Fee.
    pub fee: BigDecimal,
    /// Affiliate rev share.
    pub affiliate_rev_share: BigDecimal,
    /// Time (UTC).
    pub created_at: DateTime<Utc>,
    /// Block height.
    pub created_at_height: Height,
    /// Order id.
    pub order_id: Option<OrderId>,
    /// Client metadata.
    pub client_metadata: Option<ClientMetadata>,
    /// Subaccount number.
    pub subaccount_number: SubaccountNumber,
    /// Builder fee.
    pub builder_fee: Option<BigDecimal>,
    /// Builder address.
    pub builder_address: Option<Address>,
}

/// Profit and loss reports.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct HistoricalPnlResponse {
    /// List of PnL reports.
    pub historical_pnl: Vec<PnlTicksResponseObject>,
}

/// Profit and loss report.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct PnlTicksResponseObject {
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
#[serde(deny_unknown_fields)]
pub struct HistoricalBlockTradingRewardsResponse {
    /// List of reports.
    pub rewards: Vec<HistoricalBlockTradingReward>,
}

/// Trading rewards report.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
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
#[serde(deny_unknown_fields)]
pub struct HistoricalTradingRewardAggregationsResponse {
    /// List of reports.
    pub rewards: Vec<HistoricalTradingRewardAggregation>,
}

/// Trading rewards aggregation report.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
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

/// MegaVault Profit and loss reports.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct MegaVaultHistoricalPnlResponse {
    /// List of PnL reports.
    pub megavault_pnl: Vec<PnlTicksResponseObject>,
}

/// MegaVault Profit and loss reports.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct MegaVaultPositionResponse {
    /// List MegaVault positions.
    pub positions: Vec<VaultPosition>,
}

/// Vaults profit and loss reports.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct VaultsHistoricalPnLResponse {
    /// List of PnL reports.
    pub vaults_pnl: Vec<VaultHistoricalPnl>,
}

/// Vault Profit and loss reports.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct VaultHistoricalPnl {
    /// Associated ticker.
    pub ticker: String,
    /// List of PnL reports.
    pub historical_pnl: Vec<PnlTicksResponseObject>,
}

/// Vault position.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct VaultPosition {
    /// Associated ticker.
    pub ticker: String,
    /// Asset position.
    pub asset_position: Option<AssetPositionResponseObject>,
    /// Perpetual position.
    pub perpetual_position: Option<PerpetualPositionResponseObject>,
    /// Equity.
    pub equity: BigDecimal,
}
