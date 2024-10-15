use crate::node::OrderMarketParams;
use anyhow::{anyhow as err, Error};
use bigdecimal::BigDecimal;
use chrono::{DateTime, Utc};
use cosmrs::{AccountId, Denom as CosmosDenom};
use derive_more::{Add, Deref, DerefMut, Display, Div, From, Mul, Sub};
use rand::{thread_rng, Rng};
use serde::{Deserialize, Serialize};
use serde_with::{serde_as, DisplayFromStr};
use std::collections::HashMap;
use std::convert::TryFrom;
use std::{fmt, str::FromStr};
use v4_proto_rs::dydxprotocol::subaccounts::SubaccountId as ProtoSubaccountId;

// Shared types used by REST API, WS

/// A trader's account.
#[derive(Deserialize, Debug, Clone, Eq, Hash, PartialOrd, Ord, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Account {
    /// Address.
    pub address: Address,
}

/// [Address](https://dydx.exchange/crypto-learning/what-is-a-wallet-address).
#[derive(
    Serialize, Deserialize, Debug, Clone, From, Display, PartialEq, Eq, PartialOrd, Ord, Hash,
)]
pub struct Address(String);

impl FromStr for Address {
    type Err = Error;
    fn from_str(value: &str) -> Result<Self, Error> {
        Ok(Self(
            value.parse::<AccountId>().map_err(Error::msg)?.to_string(),
        ))
    }
}

impl AsRef<str> for Address {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

impl From<Address> for String {
    fn from(address: Address) -> Self {
        address.0
    }
}

/// Order status.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase", untagged)]
pub enum ApiOrderStatus {
    /// Order status.
    OrderStatus(OrderStatus),
    /// Best effort.
    BestEffort(BestEffortOpenedStatus),
}

/// [Time-in-Force](https://docs.dydx.exchange/api_integration-trading/order_types#time-in-force).
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ApiTimeInForce {
    /// GTT represents Good-Til-Time, where an order will first match with existing orders on the book
    /// and any remaining size will be added to the book as a maker order, which will expire at a
    /// given expiry time.
    Gtt,
    /// FOK represents Fill-Or-KILl where it's enforced that an order will either be filled
    /// completely and immediately by maker orders on the book or canceled if the entire amount can't
    /// be filled.
    Fok,
    /// IOC represents Immediate-Or-Cancel, where it's enforced that an order only be matched with
    /// maker orders on the book. If the order has remaining size after matching with existing orders
    /// on the book, the remaining size is not placed on the book.
    Ioc,
}

/// Asset id.
#[derive(
    Serialize, Deserialize, Debug, Clone, From, Display, PartialEq, Eq, PartialOrd, Ord, Hash,
)]
pub struct AssetId(pub String);

/// Best-effort opened status.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum BestEffortOpenedStatus {
    /// Best-effort opened.
    BestEffortOpened,
}

/// Candle resolution.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum CandleResolution {
    /// 1-minute.
    #[serde(rename = "1MIN")]
    M1,
    /// 5-minutes.
    #[serde(rename = "5MINS")]
    M5,
    /// 15-minutes.
    #[serde(rename = "15MINS")]
    M15,
    /// 30-minutes.
    #[serde(rename = "30MINS")]
    M30,
    /// 1-hour.
    #[serde(rename = "1HOUR")]
    H1,
    /// 4-hours.
    #[serde(rename = "4HOURS")]
    H4,
    /// 1-day.
    #[serde(rename = "1DAY")]
    D1,
}

/// Representatio of an arbitrary ID.
#[derive(Clone, Debug)]
pub struct AnyId;

/// Client ID defined by the user to identify orders.
///
/// This value should be different for different orders.
/// To update a specific previously submitted order, the new [`Order`](v4_proto_rs::dydxprotocol::clob::Order) must have the same client ID, and the same [`OrderId`].
/// See also: [How can I replace an order?](https://docs.dydx.exchange/introduction-onboarding_faqs).
#[serde_as]
#[derive(Deserialize, Debug, Clone, Display, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ClientId(#[serde_as(as = "DisplayFromStr")] pub u32);

impl ClientId {
    /// Creates a new `ClientId` from a provided `u32`.
    pub fn new(id: u32) -> Self {
        ClientId(id)
    }

    /// Creates a random `ClientId` using the default rand::thread_rng.
    pub fn random() -> Self {
        ClientId(thread_rng().gen())
    }

    /// Creates a random `ClientId` using a user-provided RNG.
    pub fn random_with_rng<R: Rng>(rng: &mut R) -> Self {
        ClientId(rng.gen())
    }
}

impl From<u32> for ClientId {
    fn from(value: u32) -> Self {
        Self(value)
    }
}

impl From<AnyId> for ClientId {
    fn from(_: AnyId) -> Self {
        Self::random()
    }
}

/// Clob pair id.
#[serde_as]
#[derive(Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ClobPairId(#[serde_as(as = "DisplayFromStr")] pub u32);

impl From<u32> for ClobPairId {
    fn from(value: u32) -> Self {
        Self(value)
    }
}

/// Client metadata.
#[serde_as]
#[derive(Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ClientMetadata(#[serde_as(as = "DisplayFromStr")] pub u32);

impl From<u32> for ClientMetadata {
    fn from(value: u32) -> Self {
        Self(value)
    }
}

/// Fill id.
#[derive(Deserialize, Debug, Clone, From, Display, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct FillId(pub String);

/// Fill type.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum FillType {
    /// LIMIT is the fill type for a fill with a limit taker order.
    Limit,
    /// LIQUIDATED is for the taker side of the fill where the subaccount was liquidated.
    ///
    /// The subaccountId associated with this fill is the liquidated subaccount.
    Liquidated,
    /// LIQUIDATION is for the maker side of the fill, never used for orders.
    Liquidation,
    /// DELEVERAGED is for the subaccount that was deleveraged in a deleveraging event.
    ///
    /// The fill type will be set to taker.
    Deleveraged,
    /// OFFSETTING is for the offsetting subaccount in a deleveraging event.
    ///
    /// The fill type will be set to maker.
    Offsetting,
}

/// Block height.
#[serde_as]
#[derive(
    Serialize, Deserialize, Debug, Clone, From, Display, PartialEq, Eq, PartialOrd, Ord, Hash,
)]
pub struct Height(#[serde_as(as = "DisplayFromStr")] pub u32);

impl Height {
    /// Get the block which is n blocks ahead.
    pub fn ahead(&self, n: u32) -> Height {
        Height(self.0 + n)
    }
}

/// Liquidity position.
///
/// See also [Market Makers vs Market Takers](https://dydx.exchange/crypto-learning/market-makers-vs-market-takers).
#[derive(Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Liquidity {
    /// [Taker](https://dydx.exchange/crypto-learning/glossary?#taker).
    Taker,
    /// [Maker](https://dydx.exchange/crypto-learning/glossary?#maker).
    Maker,
}

/// Perpetual market status
#[derive(Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum PerpetualMarketStatus {
    /// Active.
    Active,
    /// Paused.
    Paused,
    /// Cancel-only.
    CancelOnly,
    /// Post-only.
    PostOnly,
    /// Initializing.
    Initializing,
    /// Final settlement.
    FinalSettlement,
}

/// Perpetual position status.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum PerpetualPositionStatus {
    /// Open.
    Open,
    /// Closed.
    Closed,
    /// Liquidated.
    Liquidated,
}

/// Position.
///
/// See also [How to Short Crypto: A Beginner’s Guide](https://dydx.exchange/crypto-learning/how-to-short-crypto).
#[derive(Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum PositionSide {
    /// Long.
    Long,
    /// Short.
    Short,
}

/// Market type.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum MarketType {
    /// [Perpetuals](https://dydx.exchange/crypto-learning/perpetuals-crypto).
    Perpetual,
    /// [Spot](https://dydx.exchange/crypto-learning/what-is-spot-trading).
    Spot,
}

/// Perpetual market type.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum PerpetualMarketType {
    /// Cross.
    Cross,
    /// [Isolated](https://docs.dydx.exchange/api_integration-trading/isolated_markets).
    Isolated,
}

/// Order id.
#[derive(Deserialize, Debug, Clone, From, Display, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct OrderId(pub String);

/// Order status.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum OrderStatus {
    /// Opened.
    Open,
    /// Filled.
    Filled,
    /// Canceled.
    Canceled,
    /// Short term cancellations are handled best-effort, meaning they are only gossiped.
    BestEffortCanceled,
    /// Untriggered.
    Untriggered,
}

/// When the order enters the execution phase
///
/// See also [Time in force](https://docs.dydx.exchange/api_integration-indexer/indexer_api#apitimeinforce).
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum OrderExecution {
    /// Leaving order execution as unspecified/empty represents the default behavior
    /// where an order will first match with existing orders on the book, and any remaining size
    /// will be added to the book as a maker order.
    Default,
    /// IOC represents Immediate-Or-Cancel, where it's enforced that an order only be matched with
    /// maker orders on the book. If the order has remaining size after matching with existing orders
    /// on the book, the remaining size is not placed on the book.
    Ioc,
    /// FOK represents Fill-Or-KILl where it's enforced that an order will either be filled
    /// completely and immediately by maker orders on the book or canceled if the entire amount can't
    /// be filled.
    Fok,
    /// Post only enforces that an order only be placed on the book as a maker order.
    /// Note this means that validators will cancel any newly-placed post only orders that would cross with other maker orders.
    PostOnly,
}

/// Order flags.
#[derive(Clone, Debug, Deserialize)]
pub enum OrderFlags {
    /// Short-term order.
    #[serde(rename = "0")]
    ShortTerm = 0,
    /// Conditional order.
    #[serde(rename = "32")]
    Conditional = 32,
    /// Long-term (stateful) order.
    #[serde(rename = "64")]
    LongTerm = 64,
}

// TODO: Consider using 12-bytes array, and deserialize from hex
/// Trade id.
#[derive(
    Serialize, Deserialize, Debug, Clone, From, Display, PartialEq, Eq, PartialOrd, Ord, Hash,
)]
pub struct TradeId(pub String);

/// Order side.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum OrderSide {
    /// Buy.
    Buy,
    /// Sell.
    Sell,
}

/// Order types.
///
/// See also [OrderType](https://docs.dydx.exchange/api_integration-indexer/indexer_api#ordertype).
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum OrderType {
    /// Limit.
    Limit,
    /// Market.
    Market,
    /// Stop-limit.
    StopLimit,
    /// Stop-market.
    StopMarket,
    /// Trailing-stop.
    TrailingStop,
    /// Take-profit.
    TakeProfit,
    /// Take-profit-market.
    TakeProfitMarket,
    /// Hard-trade.
    HardTrade,
    /// Failed-hard-trade.
    FailedHardTrade,
    /// Transfer-placeholder.
    TransferPlaceholder,
}

/// Subaccount.
#[derive(Deserialize, Debug, Clone, Eq, Hash, PartialOrd, Ord, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Subaccount {
    /// Address.
    pub address: Address,
    /// Subaccount number.
    pub number: SubaccountNumber,
}

impl Subaccount {
    /// Create a new Subaccount.
    pub fn new(address: Address, number: SubaccountNumber) -> Self {
        Self { address, number }
    }

    /// Get the parent of this Subaccount.
    pub fn parent(&self) -> ParentSubaccount {
        let number = ParentSubaccountNumber(self.number.0 % 128);
        ParentSubaccount::new(self.address.clone(), number)
    }

    /// Check if this Subaccount is a parent?
    pub fn is_parent(&self) -> bool {
        self.number.0 < 128
    }
}

impl From<Subaccount> for ProtoSubaccountId {
    fn from(subacc: Subaccount) -> Self {
        ProtoSubaccountId {
            owner: subacc.address.0,
            number: subacc.number.0,
        }
    }
}

/// Subaccount number.
#[derive(Serialize, Deserialize, Debug, Clone, Display, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct SubaccountNumber(pub(crate) u32);

impl SubaccountNumber {
    /// Get the subaccount number value.
    pub fn value(&self) -> u32 {
        self.0
    }
}

impl TryFrom<u32> for SubaccountNumber {
    type Error = Error;
    fn try_from(number: u32) -> Result<Self, Error> {
        match number {
            0..=128_000 => Ok(SubaccountNumber(number)),
            _ => Err(err!("Subaccount number must be [0, 128_000]")),
        }
    }
}

impl From<ParentSubaccountNumber> for SubaccountNumber {
    fn from(parent: ParentSubaccountNumber) -> Self {
        Self(parent.value())
    }
}

/// Parent subaccount.
///
/// A parent subaccount can have multiple positions opened and all posititions are cross-margined.
/// See also [how isolated positions are handled in dYdX](https://docs.dydx.exchange/api_integration-guides/how_to_isolated#mapping-of-isolated-positions-to-subaccounts).
#[derive(Deserialize, Debug, Clone, Eq, Hash, PartialOrd, Ord, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ParentSubaccount {
    /// Address.
    pub address: Address,
    /// Parent subaccount number.
    pub number: ParentSubaccountNumber,
}

impl ParentSubaccount {
    /// Create a new Subaccount.
    pub fn new(address: Address, number: ParentSubaccountNumber) -> Self {
        Self { address, number }
    }
}

impl std::cmp::PartialEq<Subaccount> for ParentSubaccount {
    fn eq(&self, other: &Subaccount) -> bool {
        self.address == other.address && self.number == other.number
    }
}

/// Subaccount number.
#[derive(Serialize, Deserialize, Debug, Clone, Display, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ParentSubaccountNumber(u32);

impl ParentSubaccountNumber {
    /// Get parent subaccount number value.
    pub fn value(&self) -> u32 {
        self.0
    }
}

impl TryFrom<u32> for ParentSubaccountNumber {
    type Error = Error;
    fn try_from(number: u32) -> Result<Self, Error> {
        match number {
            0..=127 => Ok(ParentSubaccountNumber(number)),
            _ => Err(err!("Parent subaccount number must be [0, 127]")),
        }
    }
}

impl std::cmp::PartialEq<SubaccountNumber> for ParentSubaccountNumber {
    fn eq(&self, other: &SubaccountNumber) -> bool {
        self.0 == other.value()
    }
}

/// Subaccount id.
#[derive(Deserialize, Debug, Clone, From, Display, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct SubaccountId(pub String);

/// Token symbol.
#[derive(
    Serialize, Deserialize, Debug, Clone, From, Display, PartialEq, Eq, PartialOrd, Ord, Hash,
)]
pub struct Symbol(pub String);

/// Trade type.
#[derive(Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum TradeType {
    /// LIMIT is the trade type for a fill with a limit taker order.
    Limit,
    /// LIQUIDATED is the trade type for a fill with a liquidated taker order.
    Liquidated,
    /// DELEVERAGED is the trade type for a fill with a deleveraged taker order.
    Deleveraged,
}

/// Transfer type.
#[derive(Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum TransferType {
    /// Transfer-in.
    TransferIn,
    /// Transfer-out.
    TransferOut,
    /// Deposit.
    Deposit,
    /// Withdrawal.
    Withdrawal,
}

/// Ticker.
#[derive(
    Serialize, Deserialize, Debug, Clone, From, Display, PartialEq, Eq, PartialOrd, Ord, Hash,
)]
pub struct Ticker(pub String);

impl<'a> From<&'a str> for Ticker {
    fn from(value: &'a str) -> Self {
        Self(value.into())
    }
}

const USDC_DENOM: &str = "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5";
const DYDX_DENOM: &str = "adydx";
const DYDX_TNT_DENOM: &str = "adv4tnt";
#[cfg(feature = "noble")]
const NOBLE_USDC_DENOM: &str = "uusdc";

/// Denom.
///
/// A more convenient type for Cosmos' [`Denom`](CosmosDenom).
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub enum Denom {
    /// USDC IBC token.
    #[serde(rename = "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5")]
    Usdc,
    /// dYdX native mainnet token.
    #[serde(rename = "adydx")]
    Dydx,
    /// dYdX native testnet token.
    #[serde(rename = "adv4tnt")]
    DydxTnt,
    /// Noble USDC token.
    #[cfg(feature = "noble")]
    #[serde(rename = "uusdc")]
    NobleUsdc,
    /// Custom denom representation.
    #[serde(untagged)]
    Custom(CosmosDenom),
}

impl Denom {
    /// Gas price per atomic unit.
    /// This price is only available for `Denom`s which can be used to cover transactions gas fees.
    pub fn gas_price(&self) -> Option<BigDecimal> {
        match self {
            // Defined dYdX micro USDC per Gas unit.
            // As defined in [1](https://docs.dydx.exchange/infrastructure_providers-validators/required_node_configs#base-configuration) and [2](https://github.com/dydxprotocol/v4-chain/blob/ba731b00e3163f7c3ff553b4300d564c11eaa81f/protocol/cmd/dydxprotocold/cmd/config.go#L15).
            Self::Usdc => Some(BigDecimal::new(25.into(), 3)),
            // Defined dYdX native tokens per Gas unit. Recommended to be roughly the same in value as 0.025 micro USDC.
            // As defined in [1](https://github.com/dydxprotocol/v4-chain/blob/ba731b00e3163f7c3ff553b4300d564c11eaa81f/protocol/cmd/dydxprotocold/cmd/config.go#L21).
            Self::Dydx | Self::DydxTnt => Some(BigDecimal::new(25_000_000_000u64.into(), 0)),
            #[cfg(feature = "noble")]
            Self::NobleUsdc => Some(BigDecimal::new(1.into(), 1)),
            _ => None,
        }
    }
}

impl FromStr for Denom {
    type Err = Error;
    fn from_str(value: &str) -> Result<Self, Error> {
        match value {
            USDC_DENOM => Ok(Self::Usdc),
            DYDX_DENOM => Ok(Self::Dydx),
            DYDX_TNT_DENOM => Ok(Self::DydxTnt),
            _ => Ok(Self::Custom(
                value.parse::<CosmosDenom>().map_err(Error::msg)?,
            )),
        }
    }
}

impl AsRef<str> for Denom {
    fn as_ref(&self) -> &str {
        match self {
            Self::Usdc => USDC_DENOM,
            Self::Dydx => DYDX_DENOM,
            Self::DydxTnt => DYDX_TNT_DENOM,
            #[cfg(feature = "noble")]
            Self::NobleUsdc => NOBLE_USDC_DENOM,
            Self::Custom(denom) => denom.as_ref(),
        }
    }
}

impl fmt::Display for Denom {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_ref())
    }
}

impl TryFrom<Denom> for CosmosDenom {
    type Error = Error;
    fn try_from(value: Denom) -> Result<Self, Self::Error> {
        value.as_ref().parse().map_err(Self::Error::msg)
    }
}

/// Parent subaccount response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ParentSubaccountResponseObject {
    /// Address.
    pub address: Address,
    /// Subaccount number.
    pub parent_subaccount_number: SubaccountNumber,
    /// Equity.
    pub equity: BigDecimal,
    /// Free collateral.
    pub free_collateral: BigDecimal,
    /// Is margin enabled?
    pub margin_enabled: Option<bool>,
    /// Associated child subaccounts.
    pub child_subaccounts: Vec<SubaccountResponseObject>,
}

/// Subaccount response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SubaccountResponseObject {
    /// Address.
    pub address: Address,
    /// Subaccount number.
    pub subaccount_number: SubaccountNumber,
    /// Equity.
    pub equity: BigDecimal,
    /// Free collateral.
    pub free_collateral: BigDecimal,
    /// Is margin enabled?
    pub margin_enabled: Option<bool>,
    /// Asset positions.
    pub asset_positions: AssetPositionsMap,
    /// Opened perpetual positions.
    pub open_perpetual_positions: PerpetualPositionsMap,
}

/// Asset position response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AssetPositionResponseObject {
    /// Token symbol.
    pub symbol: Symbol,
    /// Position.
    pub side: PositionSide,
    /// Size.
    pub size: Quantity,
    /// Subaccount number.
    pub subaccount_number: SubaccountNumber,
    /// Asset id.
    pub asset_id: AssetId,
}

/// Perpetual position response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PerpetualPositionResponseObject {
    /// Market ticker.
    pub market: Ticker,
    /// Position status.
    pub status: PerpetualPositionStatus,
    /// Position.
    pub side: PositionSide,
    /// Size.
    pub size: Quantity,
    /// Maximum size.
    pub max_size: Quantity,
    /// Entry price.
    pub entry_price: Price,
    /// Actual PnL.
    pub realized_pnl: BigDecimal,
    /// Time(UTC).
    pub created_at: DateTime<Utc>,
    /// Block height.
    pub created_at_height: Height,
    /// Sum at open.
    pub sum_open: BigDecimal,
    /// Sum at close.
    pub sum_close: BigDecimal,
    /// Net funding.
    pub net_funding: BigDecimal,
    /// Potential PnL.
    pub unrealized_pnl: BigDecimal,
    /// Time(UTC).
    pub closed_at: Option<DateTime<Utc>>,
    /// Exit price.
    pub exit_price: Option<Price>,
    /// Subaccount number.
    pub subaccount_number: SubaccountNumber,
}

/// Asset positions.
pub type AssetPositionsMap = HashMap<Ticker, AssetPositionResponseObject>;

/// Perpetual positions.
pub type PerpetualPositionsMap = HashMap<Ticker, PerpetualPositionResponseObject>;

/// Price.
#[derive(
    Add,
    Deserialize,
    Debug,
    Clone,
    Div,
    Display,
    Deref,
    DerefMut,
    PartialEq,
    Eq,
    Mul,
    PartialOrd,
    Ord,
    Hash,
    Sub,
)]
#[serde(transparent)]
pub struct Price(pub BigDecimal);

impl<T> From<T> for Price
where
    T: Into<BigDecimal>,
{
    fn from(value: T) -> Self {
        Self(value.into())
    }
}

impl FromStr for Price {
    type Err = bigdecimal::ParseBigDecimalError;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        s.parse().map(Self)
    }
}

/// Quantity.
#[derive(
    Add,
    Deserialize,
    Debug,
    Clone,
    Div,
    Display,
    Deref,
    DerefMut,
    PartialEq,
    Eq,
    Mul,
    PartialOrd,
    Ord,
    Hash,
    Sub,
)]
#[serde(transparent)]
pub struct Quantity(pub BigDecimal);

impl<T> From<T> for Quantity
where
    T: Into<BigDecimal>,
{
    fn from(value: T) -> Self {
        Self(value.into())
    }
}

impl FromStr for Quantity {
    type Err = bigdecimal::ParseBigDecimalError;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        s.parse().map(Self)
    }
}

/// Orderbook price level.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct OrderbookResponsePriceLevel {
    /// Price.
    pub price: Price,
    /// Size.
    pub size: Quantity,
}

/// Orderbook response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct OrderBookResponseObject {
    /// Bids.
    pub bids: Vec<OrderbookResponsePriceLevel>,
    /// Asks.
    pub asks: Vec<OrderbookResponsePriceLevel>,
}

/// Order response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct OrderResponseObject {
    /// Client id.
    pub client_id: ClientId,
    /// Client metadata.
    pub client_metadata: ClientMetadata,
    /// Clob pair id.
    pub clob_pair_id: ClobPairId,
    /// Block height.
    pub created_at_height: Option<Height>,
    /// Block height.
    pub good_til_block: Option<Height>,
    /// Time(UTC).
    pub good_til_block_time: Option<DateTime<Utc>>,
    /// Id.
    pub id: OrderId,
    /// Order flags.
    pub order_flags: OrderFlags,
    /// Post-only.
    pub post_only: bool,
    /// Price.
    pub price: Price,
    /// Reduce-only.
    pub reduce_only: bool,
    /// Side (buy/sell).
    pub side: OrderSide,
    /// Size.
    pub size: Quantity,
    /// Order status.
    pub status: ApiOrderStatus,
    /// Subaccount id.
    pub subaccount_id: SubaccountId,
    /// Subaccount number.
    pub subaccount_number: SubaccountNumber,
    /// Market ticker.
    pub ticker: Ticker,
    /// Time-in-force.
    pub time_in_force: ApiTimeInForce,
    /// Total filled.
    pub total_filled: BigDecimal,
    /// Order type.
    #[serde(rename = "type")]
    pub order_type: OrderType,
    /// Time(UTC).
    pub updated_at: Option<DateTime<Utc>>,
    /// Block height.
    pub updated_at_height: Option<Height>,
}

/// Trade response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TradeResponse {
    /// Trades.
    pub trades: Vec<TradeResponseObject>,
}

/// Trade.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TradeResponseObject {
    /// Trade id.
    pub id: TradeId,
    /// Block height.
    pub created_at_height: Height,
    /// Time(UTC).
    pub created_at: DateTime<Utc>,
    /// Side (buy/sell).
    pub side: OrderSide,
    /// Price.
    pub price: Price,
    /// Size.
    pub size: Quantity,
    /// Trade type.
    #[serde(rename = "type")]
    pub trade_type: TradeType,
}

/// Perpetual markets.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PerpetualMarketResponse {
    /// Perpetual markets.
    pub markets: HashMap<Ticker, PerpetualMarket>,
}

/// Perpetual market.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PerpetualMarket {
    /// Atomic resolution
    pub atomic_resolution: i32,
    /// Base open interest.
    pub base_open_interest: BigDecimal,
    /// Clob pair id.
    pub clob_pair_id: ClobPairId,
    /// Initial margin fraction.
    pub initial_margin_fraction: BigDecimal,
    /// Maintenance margin fraction.
    pub maintenance_margin_fraction: BigDecimal,
    /// Market type.
    pub market_type: PerpetualMarketType,
    /// Next funding rate.
    pub next_funding_rate: BigDecimal,
    /// Open interest.
    pub open_interest: BigDecimal,
    /// Open interest lower capitalization.
    pub open_interest_lower_cap: Option<BigDecimal>,
    /// Open interest upper capitalization.
    pub open_interest_upper_cap: Option<BigDecimal>,
    /// Oracle price.
    pub oracle_price: Option<Price>,
    /// 24-h price change.
    #[serde(rename = "priceChange24H")]
    pub price_change_24h: BigDecimal,
    /// Quantum conversion exponent.
    pub quantum_conversion_exponent: i32,
    /// Market status
    pub status: PerpetualMarketStatus,
    /// Step base quantums.
    pub step_base_quantums: u64,
    /// Step size.
    pub step_size: BigDecimal,
    /// Subticks per tick.
    pub subticks_per_tick: u32,
    /// Tick size.
    pub tick_size: BigDecimal,
    /// Market ticker.
    pub ticker: Ticker,
    /// 24-h number of trades.
    #[serde(rename = "trades24H")]
    pub trades_24h: u64,
    /// 24-h volume.
    #[serde(rename = "volume24H")]
    pub volume_24h: Quantity,
}

impl PerpetualMarket {
    /// Creates a [`OrderMarketParams`], capable of performing price and size quantizations and other
    /// operations based on market data.
    /// These quantizations are required for `Order` placement.
    pub fn order_params(&self) -> OrderMarketParams {
        OrderMarketParams {
            atomic_resolution: self.atomic_resolution,
            clob_pair_id: self.clob_pair_id.clone(),
            oracle_price: self.oracle_price.clone(),
            quantum_conversion_exponent: self.quantum_conversion_exponent,
            step_base_quantums: self.step_base_quantums,
            subticks_per_tick: self.subticks_per_tick,
        }
    }
}

/// Candle response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CandleResponse {
    /// List of candles.
    pub candles: Vec<CandleResponseObject>,
}

/// Candle response.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CandleResponseObject {
    /// Market ticker.
    pub ticker: Ticker,
    /// Number of trades.
    pub trades: u64,
    /// Time(UTC).
    pub started_at: DateTime<Utc>,
    /// Base token volume.
    pub base_token_volume: Quantity,
    /// Token price at open.
    pub open: Price,
    /// Low price volume.
    pub low: Price,
    /// High price volume.
    pub high: Price,
    /// Token price at close.
    pub close: Price,
    /// Candle resolution.
    pub resolution: CandleResolution,
    /// USD volume.
    pub usd_volume: Quantity,
    /// Starting open interest.
    pub starting_open_interest: BigDecimal,
}

/// Block height parsed by Indexer.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HeightResponse {
    /// Block height.
    pub height: Height,
    /// Time (UTC).
    pub time: DateTime<Utc>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn denom_parse() {
        // Test if hardcoded denom is parsed correctly
        let _usdc = Denom::Usdc.to_string().parse::<Denom>().unwrap();
        let _dydx = Denom::Dydx.to_string().parse::<Denom>().unwrap();
        let _dydx_tnt = Denom::DydxTnt.to_string().parse::<Denom>().unwrap();
        let _custom: Denom = "uusdc".parse().unwrap();
    }
}
