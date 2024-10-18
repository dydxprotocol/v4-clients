use crate::indexer::types::{
    CandleResponse as CandlesInitialMessageContents, CandleResponseObject as Candle,
    HeightResponse as BlockHeightInitialMessageContents,
    OrderBookResponseObject as OrdersInitialMessageContents,
    OrderResponseObject as OrderMessageObject,
    ParentSubaccountResponseObject as ParentSubaccountMessageObject,
    PerpetualMarketResponse as MarketsInitialMessageContents,
    SubaccountResponseObject as SubaccountMessageObject,
    TradeResponse as TradesInitialMessageContents, *,
};
use bigdecimal::BigDecimal;
use chrono::{DateTime, Utc};
use serde::Deserialize;
use serde_json::{json, Value};
use std::collections::HashMap;
use tokio_tungstenite::tungstenite::protocol::Message;

/// Feed subscription options
/// Respective ticker is required for `Orders`, `Trades`, `Candles`
#[derive(Debug, Clone, Hash, Eq, PartialEq)]
pub enum Subscription {
    /// Subaccounts.
    Subaccounts(Subaccount),
    /// Orders.
    Orders(Ticker),
    /// Trades.
    Trades(Ticker),
    /// Markets.
    Markets,
    /// Candles.
    Candles(Ticker, CandleResolution),
    /// Parent subaccounts.
    ParentSubaccounts(ParentSubaccount),
    /// Block height.
    BlockHeight,
}

impl Subscription {
    pub(crate) fn sub_message(&self, batched: bool) -> Message {
        match self {
            Self::Subaccounts(ref subacc) => subaccounts::sub_message(subacc, batched),
            Self::Markets => markets::sub_message(batched),
            Self::Orders(ref ticker) => orders::sub_message(ticker, batched),
            Self::Trades(ref ticker) => trades::sub_message(ticker, batched),
            Self::Candles(ref ticker, ref res) => candles::sub_message(ticker, res, batched),
            Self::ParentSubaccounts(ref subacc) => parent_subaccounts::sub_message(subacc, batched),
            Self::BlockHeight => block_height::sub_message(batched),
        }
    }

    pub(crate) fn unsub_message(&self) -> Message {
        match self {
            Self::Subaccounts(ref subacc) => subaccounts::unsub_message(subacc),
            Self::Markets => markets::unsub_message(),
            Self::Orders(ref ticker) => orders::unsub_message(ticker),
            Self::Trades(ref ticker) => trades::unsub_message(ticker),
            Self::Candles(ref ticker, ref res) => candles::unsub_message(ticker, res),
            Self::ParentSubaccounts(ref subacc) => parent_subaccounts::unsub_message(subacc),
            Self::BlockHeight => block_height::unsub_message(),
        }
    }
}

struct MessageFormatter {}

impl MessageFormatter {
    pub(crate) fn sub_message(channel: &str, fields: Value) -> Message {
        let message = json!({
            "type": "subscribe",
            "channel": channel,
        });
        Self::message(fields, message)
    }

    pub(crate) fn unsub_message(channel: &str, fields: Value) -> Message {
        let message = json!({
            "type": "unsubscribe",
            "channel": channel,
        });
        Self::message(fields, message)
    }

    fn message(mut message: Value, fields: Value) -> Message {
        if let Value::Object(ref mut map) = message {
            if let Value::Object(fields) = fields {
                map.extend(fields);
            }
        }
        Message::Text(message.to_string())
    }
}

pub(crate) mod subaccounts {
    use super::{json, Message, MessageFormatter, Subaccount};
    pub(crate) const CHANNEL: &str = "v4_subaccounts";

    pub(crate) fn sub_message(subacc: &Subaccount, batched: bool) -> Message {
        let address = &subacc.address;
        let number = &subacc.number;
        MessageFormatter::sub_message(
            CHANNEL,
            json!({"id": format!("{address}/{number}"), "batched": batched}),
        )
    }

    pub(crate) fn unsub_message(subacc: &Subaccount) -> Message {
        let address = &subacc.address;
        let number = &subacc.number;
        MessageFormatter::unsub_message(CHANNEL, json!({"id": format!("{address}/{number}")}))
    }
}

pub(crate) mod parent_subaccounts {
    use super::{json, Message, MessageFormatter, ParentSubaccount};
    pub(crate) const CHANNEL: &str = "v4_parent_subaccounts";

    pub(crate) fn sub_message(subacc: &ParentSubaccount, batched: bool) -> Message {
        let address = &subacc.address;
        let number = &subacc.number;
        MessageFormatter::sub_message(
            CHANNEL,
            json!({"id": format!("{address}/{number}"), "batched": batched}),
        )
    }

    pub(crate) fn unsub_message(subacc: &ParentSubaccount) -> Message {
        let address = &subacc.address;
        let number = &subacc.number;
        MessageFormatter::unsub_message(CHANNEL, json!({"id": format!("{address}/{number}")}))
    }
}

pub(crate) mod orders {
    use super::{json, Message, MessageFormatter, Ticker};
    pub(crate) const CHANNEL: &str = "v4_orderbook";

    pub(crate) fn sub_message(id: &Ticker, batched: bool) -> Message {
        MessageFormatter::sub_message(CHANNEL, json!({"id": id, "batched": batched}))
    }

    pub(crate) fn unsub_message(id: &Ticker) -> Message {
        MessageFormatter::unsub_message(CHANNEL, json!({"id": id}))
    }
}

pub(crate) mod trades {
    use super::{json, Message, MessageFormatter, Ticker};
    pub(crate) const CHANNEL: &str = "v4_trades";

    pub(crate) fn sub_message(id: &Ticker, batched: bool) -> Message {
        MessageFormatter::sub_message(CHANNEL, json!({"id": id, "batched": batched}))
    }

    pub(crate) fn unsub_message(id: &Ticker) -> Message {
        MessageFormatter::unsub_message(CHANNEL, json!({"id": id}))
    }
}

pub(crate) mod markets {
    use super::{json, Message, MessageFormatter};
    pub const CHANNEL: &str = "v4_markets";

    pub(crate) fn sub_message(batched: bool) -> Message {
        MessageFormatter::sub_message(CHANNEL, json!({"batched": batched}))
    }

    pub(crate) fn unsub_message() -> Message {
        MessageFormatter::unsub_message(CHANNEL, json!({}))
    }
}

pub(crate) mod candles {
    use super::{json, CandleResolution, Message, MessageFormatter, Ticker};
    pub(crate) const CHANNEL: &str = "v4_candles";

    pub(crate) fn sub_message(
        id: &Ticker,
        resolution: &CandleResolution,
        batched: bool,
    ) -> Message {
        let resolution_str = serde_json::to_string(resolution).unwrap_or_default();
        let resolution_str = resolution_str.trim_matches('"');
        MessageFormatter::sub_message(
            CHANNEL,
            json!({"id": format!("{id}/{resolution_str}"), "batched": batched}),
        )
    }

    pub(crate) fn unsub_message(id: &Ticker, resolution: &CandleResolution) -> Message {
        let resolution_str = serde_json::to_string(resolution).unwrap_or_default();
        let resolution_str = resolution_str.trim_matches('"');
        MessageFormatter::unsub_message(CHANNEL, json!({"id": format!("{id}/{resolution_str}")}))
    }
}

pub(crate) mod block_height {
    use super::{json, Message, MessageFormatter};
    pub const CHANNEL: &str = "v4_block_height";

    pub(crate) fn sub_message(batched: bool) -> Message {
        MessageFormatter::sub_message(CHANNEL, json!({"batched": batched}))
    }

    pub(crate) fn unsub_message() -> Message {
        MessageFormatter::unsub_message(CHANNEL, json!({}))
    }
}

/* Main WS type */
#[allow(clippy::large_enum_variant)]
#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
pub(crate) enum WsMessage {
    #[serde(rename = "connected")]
    Setup(StatusConnectedMessage),
    #[serde(rename = "error")]
    Error(StatusErrorMessage),
    #[serde(rename = "unsubscribed")]
    Unsub(StatusUnsubMessage),
    #[serde(untagged)]
    Data(FeedMessage),
}

#[derive(Debug, Deserialize)]
pub(crate) struct StatusConnectedMessage {
    pub(crate) connection_id: String,
    #[allow(dead_code)] // TODO remove after completion.
    pub(crate) message_id: u64,
}

#[derive(Debug, Deserialize)]
pub(crate) struct StatusErrorMessage {
    pub(crate) message: String,
    #[allow(dead_code)] // TODO remove after completion.
    pub(crate) connection_id: String,
    #[allow(dead_code)] // TODO remove after completion.
    pub(crate) message_id: u64,
}

#[derive(Debug, Deserialize)]
pub(crate) struct StatusUnsubMessage {
    #[allow(dead_code)] // TODO remove after completion.
    pub(crate) connection_id: String,
    #[allow(dead_code)] // TODO remove after completion.
    pub(crate) message_id: u64,
    pub(crate) channel: String,
    pub(crate) id: Option<String>,
}

/// Feed Types
#[derive(Debug, Deserialize)]
#[serde(tag = "channel")]
pub enum FeedMessage {
    /// Subaccounts.
    #[serde(rename = "v4_subaccounts")]
    Subaccounts(SubaccountsMessage),
    /// Orders.
    #[serde(rename = "v4_orderbook")]
    Orders(OrdersMessage),
    /// Trades.
    #[serde(rename = "v4_trades")]
    Trades(TradesMessage),
    /// Markets.
    #[serde(rename = "v4_markets")]
    Markets(MarketsMessage),
    /// Candles.
    #[serde(rename = "v4_candles")]
    Candles(CandlesMessage),
    /// Parent subaccounts.
    #[serde(rename = "v4_parent_subaccounts")]
    ParentSubaccounts(ParentSubaccountsMessage),
    /// Block height.
    #[serde(rename = "v4_block_height")]
    BlockHeight(BlockHeightMessage),
}

macro_rules! impl_feed_message_try_from {
    ($target_type:ty, $variant:ident) => {
        impl TryFrom<FeedMessage> for $target_type {
            type Error = ();
            fn try_from(value: FeedMessage) -> Result<Self, Self::Error> {
                match value {
                    FeedMessage::$variant(a) => Ok(a),
                    _ => Err(()),
                }
            }
        }
    };
}

/// Subaccounts message.
#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
pub enum SubaccountsMessage {
    /// Initial.
    #[serde(rename = "subscribed")]
    Initial(SubaccountsInitialMessage),
    /// Update.
    #[serde(untagged)]
    Update(SubaccountsUpdateMessage),
}
impl_feed_message_try_from!(SubaccountsMessage, Subaccounts);

/// Subaccounts message.
#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
pub enum ParentSubaccountsMessage {
    /// Initial.
    #[serde(rename = "subscribed")]
    Initial(ParentSubaccountsInitialMessage),
    /// Update.
    #[serde(untagged)]
    Update(ParentSubaccountsUpdateMessage),
}
impl_feed_message_try_from!(ParentSubaccountsMessage, ParentSubaccounts);

/// Trades message.
#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
pub enum TradesMessage {
    /// Initial.
    #[serde(rename = "subscribed")]
    Initial(TradesInitialMessage),
    /// Update.
    #[serde(untagged)]
    Update(TradesUpdateMessage),
}
impl_feed_message_try_from!(TradesMessage, Trades);

/// Orders message.
#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
pub enum OrdersMessage {
    /// Initial.
    #[serde(rename = "subscribed")]
    Initial(OrdersInitialMessage),
    /// Update.
    #[serde(untagged)]
    Update(OrdersUpdateMessage),
}
impl_feed_message_try_from!(OrdersMessage, Orders);

/// Markets message.
#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
pub enum MarketsMessage {
    /// Initial.
    #[serde(rename = "subscribed")]
    Initial(MarketsInitialMessage),
    /// Update.
    #[serde(untagged)]
    Update(MarketsUpdateMessage),
}
impl_feed_message_try_from!(MarketsMessage, Markets);

/// Candles message.
#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
pub enum CandlesMessage {
    /// Initial.
    #[serde(rename = "subscribed")]
    Initial(CandlesInitialMessage),
    /// Update.
    #[serde(untagged)]
    Update(CandlesUpdateMessage),
}
impl_feed_message_try_from!(CandlesMessage, Candles);

/// Block height message.
#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
pub enum BlockHeightMessage {
    /// Initial.
    #[serde(rename = "subscribed")]
    Initial(BlockHeightInitialMessage),
    /// Update.
    #[serde(untagged)]
    Update(BlockHeightUpdateMessage),
}
impl_feed_message_try_from!(BlockHeightMessage, BlockHeight);

impl FeedMessage {
    pub(crate) fn subscription(&self) -> Option<Subscription> {
        let parse_subacc_id = |id: &str| -> Option<Subaccount> {
            // Parse "id": "Address/Number"
            let mut id_split = id.split('/');
            let address = id_split.next()?.parse().ok()?;
            let number_str = id_split.next()?;
            let number = serde_json::from_str::<SubaccountNumber>(number_str).ok()?;
            Some(Subaccount::new(address, number))
        };
        let parse_psubacc_id = |id: &str| -> Option<ParentSubaccount> {
            // Parse "id": "Address/Number"
            let mut id_split = id.split('/');
            let address = id_split.next()?.parse().ok()?;
            let number_str = id_split.next()?;
            let number = serde_json::from_str::<ParentSubaccountNumber>(number_str).ok()?;
            Some(ParentSubaccount::new(address, number))
        };
        let parse_candles_id = |id: &str| -> Option<(Ticker, CandleResolution)> {
            // Parse "id": "TICKER/RESOLUTION"
            let mut id_split = id.split('/');
            let ticker = Ticker(id_split.next()?.into());
            let resolution_str = format!("\"{}\"", id_split.next()?);
            let resolution = serde_json::from_str(&resolution_str).ok()?;
            Some((ticker, resolution))
        };

        match self {
            Self::Subaccounts(SubaccountsMessage::Initial(msg)) => {
                let subacc = parse_subacc_id(&msg.id)?;
                Some(Subscription::Subaccounts(subacc))
            }
            Self::Subaccounts(SubaccountsMessage::Update(msg)) => {
                let subacc = parse_subacc_id(&msg.id)?;
                Some(Subscription::Subaccounts(subacc))
            }

            Self::ParentSubaccounts(ParentSubaccountsMessage::Initial(msg)) => {
                let subacc = parse_psubacc_id(&msg.id)?;
                Some(Subscription::ParentSubaccounts(subacc))
            }
            Self::ParentSubaccounts(ParentSubaccountsMessage::Update(msg)) => {
                let subacc = parse_psubacc_id(&msg.id)?;
                Some(Subscription::ParentSubaccounts(subacc))
            }

            Self::Orders(OrdersMessage::Initial(msg)) => {
                Some(Subscription::Orders(Ticker(msg.id.clone())))
            }
            Self::Orders(OrdersMessage::Update(msg)) => {
                Some(Subscription::Orders(Ticker(msg.id.clone())))
            }

            Self::Trades(TradesMessage::Initial(msg)) => {
                Some(Subscription::Trades(Ticker(msg.id.clone())))
            }
            Self::Trades(TradesMessage::Update(msg)) => {
                Some(Subscription::Trades(Ticker(msg.id.clone())))
            }

            Self::Markets(MarketsMessage::Update(_)) => Some(Subscription::Markets),
            Self::Markets(MarketsMessage::Initial(_)) => Some(Subscription::Markets),

            Self::Candles(CandlesMessage::Initial(msg)) => {
                let (ticker, resolution) = parse_candles_id(&msg.id)?;
                Some(Subscription::Candles(ticker, resolution))
            }
            Self::Candles(CandlesMessage::Update(msg)) => {
                let (ticker, resolution) = parse_candles_id(&msg.id)?;
                Some(Subscription::Candles(ticker, resolution))
            }

            Self::BlockHeight(BlockHeightMessage::Initial(_)) => Some(Subscription::BlockHeight),
            Self::BlockHeight(BlockHeightMessage::Update(_)) => Some(Subscription::BlockHeight),
        }
    }
}

/// Subaccount initial.
#[derive(Debug, Deserialize)]
pub struct SubaccountsInitialMessage {
    /// Connection id.
    pub connection_id: String,
    /// Subaccount.
    pub contents: SubaccountsInitialMessageContents,
    /// Id.
    pub id: String,
    /// Message id.
    pub message_id: u64,
}

/// Subaccount.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubaccountsInitialMessageContents {
    /// Subaccount.
    pub subaccount: SubaccountMessageObject,
    /// Orders.
    pub orders: Vec<OrderMessageObject>,
    /// Block height.
    pub block_height: Height,
}

/// Parent subaccount initial.
#[derive(Debug, Deserialize)]
pub struct ParentSubaccountsInitialMessage {
    /// Connection id.
    pub connection_id: String,
    /// Subaccount.
    pub contents: ParentSubaccountsInitialMessageContents,
    /// Id.
    pub id: String,
    /// Message id.
    pub message_id: u64,
}

/// Parent subaccount.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParentSubaccountsInitialMessageContents {
    /// Subaccount.
    pub subaccount: ParentSubaccountMessageObject,
    /// Orders.
    pub orders: Vec<OrderMessageObject>,
    /// Block height.
    pub block_height: Height,
}

/// Orders initial message.
#[derive(Debug, Deserialize)]
pub struct OrdersInitialMessage {
    /// Connection id.
    pub connection_id: String,
    /// Orders.
    pub contents: OrdersInitialMessageContents,
    /// Id.
    pub id: String,
    /// Message id.
    pub message_id: u64,
}

/// Trades initial message.
#[derive(Debug, Deserialize)]
pub struct TradesInitialMessage {
    /// Connection id.
    pub connection_id: String,
    /// Trades.
    pub contents: TradesInitialMessageContents,
    /// Id.
    pub id: String,
    /// Message id.
    pub message_id: u64,
}

/// Markets initial message.
#[derive(Debug, Deserialize)]
pub struct MarketsInitialMessage {
    /// Connection id.
    pub connection_id: String,
    /// Market.
    pub contents: MarketsInitialMessageContents,
    /// Message id.
    pub message_id: u64,
}

/// Candles initial message.
#[derive(Debug, Deserialize)]
pub struct CandlesInitialMessage {
    /// Connection id.
    pub connection_id: String,
    /// Candles.
    pub contents: CandlesInitialMessageContents,
    /// Id.
    pub id: String,
    /// Message id.
    pub message_id: u64,
}

/// Block height initial message.
#[derive(Debug, Deserialize)]
pub struct BlockHeightInitialMessage {
    /// Connection id.
    pub connection_id: String,
    /// Block height contents.
    pub contents: BlockHeightInitialMessageContents,
    /// Message id.
    pub message_id: u64,
}

// Updates
macro_rules! generate_contents_deserialize_function {
    ($fn_name:ident, $result_type:ty) => {
        fn $fn_name<'de, D>(deserializer: D) -> Result<Vec<$result_type>, D::Error>
        where
            D: serde::Deserializer<'de>,
        {
            let value = Value::deserialize(deserializer)?;

            match value {
                // Batched
                Value::Array(arr) => arr
                    .into_iter()
                    .map(|v| serde_json::from_value(v))
                    .collect::<Result<Vec<$result_type>, _>>()
                    .map_err(serde::de::Error::custom),
                // Streamed
                Value::Object(obj) => {
                    let item = serde_json::from_value::<$result_type>(Value::Object(obj.clone()))
                        .map_err(serde::de::Error::custom)?;
                    Ok(vec![item])
                }
                _ => Err(serde::de::Error::custom("Expected array or object")),
            }
        }
    };
}

/// Subaccount update.
#[derive(Debug, Deserialize)]
pub struct SubaccountsUpdateMessage {
    /// Connection id.
    pub connection_id: String,
    /// Update.
    #[serde(deserialize_with = "deserialize_subaccounts_contents")]
    pub contents: Vec<SubaccountUpdateMessageContents>,
    /// Id.
    pub id: String,
    /// Message id.
    pub message_id: u64,
    /// Version.
    pub version: String,
}
generate_contents_deserialize_function!(
    deserialize_subaccounts_contents,
    SubaccountUpdateMessageContents
);

/// Subaccount update contents.
#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubaccountUpdateMessageContents {
    /// Perpetual position updates on the subaccount.
    pub perpetual_positions: Option<Vec<PerpetualPositionSubaccountMessageContents>>,
    /// Asset position updates on the subaccount.
    pub asset_positions: Option<Vec<AssetPositionSubaccountMessageContents>>,
    /// Order updates on the subaccount.
    pub orders: Option<Vec<OrderSubaccountMessageContents>>,
    /// Fills that occur on the subaccount.
    pub fills: Option<Vec<FillSubaccountMessageContents>>,
    /// Transfers that occur on the subaccount.
    pub transfers: Option<TransferSubaccountMessageContents>,
    /// Rewards that occur on the subaccount.
    pub trading_reward: Option<TradingRewardSubaccountMessageContents>,
    /// Block height.
    pub block_height: Option<Height>,
}

/// Perpetual position on subaccount.
#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PerpetualPositionSubaccountMessageContents {
    /// Address.
    pub address: Address,
    /// Subaccount number.
    pub subaccount_number: SubaccountNumber,
    /// Position id.
    pub position_id: String,
    /// Market ticker.
    pub market: Ticker,
    /// Side (buy/sell).
    pub side: PositionSide,
    /// Position status.
    pub status: PerpetualPositionStatus,
    /// Size.
    pub size: Quantity,
    /// Maximum size.
    pub max_size: Quantity,
    /// Net funding.
    pub net_funding: BigDecimal,
    /// Entry price.
    pub entry_price: Price,
    /// Exit price.
    pub exit_price: Option<Price>,
    /// Sum at open.
    pub sum_open: BigDecimal,
    /// Sum at close.
    pub sum_close: BigDecimal,
    /// Actual PnL.
    pub realized_pnl: Option<BigDecimal>,
    /// Potential PnL.
    pub unrealized_pnl: Option<BigDecimal>,
}

/// Asset position per subaccount.
#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssetPositionSubaccountMessageContents {
    /// Address.
    pub address: Address,
    /// Subaccount number.
    pub subaccount_number: SubaccountNumber,
    /// Position id.
    pub position_id: String,
    /// Asset id.
    pub asset_id: AssetId,
    /// Token symbol.
    pub symbol: Symbol,
    /// Side (buy/sell).
    pub side: PositionSide,
    /// Size.
    pub size: Quantity,
}

/// Order per subaccount.
#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OrderSubaccountMessageContents {
    /// Id.
    pub id: String,
    /// Subaccount id.
    pub subaccount_id: SubaccountId,
    /// Client id.
    pub client_id: ClientId,
    /// Clob pair id.
    pub clob_pair_id: Option<ClobPairId>,
    /// Side (buy/sell).
    pub side: Option<OrderSide>,
    /// Size.
    pub size: Option<Quantity>,
    /// Market ticker.
    pub ticker: Option<Ticker>,
    /// Price.
    pub price: Option<Price>,
    #[serde(rename = "type")]
    /// Order type.
    pub order_type: Option<OrderType>,
    /// Time-in-force.
    pub time_in_force: Option<ApiTimeInForce>,
    /// Post-only.
    pub post_only: Option<bool>,
    /// Reduce-only.
    pub reduce_only: Option<bool>,
    /// Order status.
    pub status: ApiOrderStatus,
    /// Order flags.
    pub order_flags: OrderFlags,
    /// Total filled.
    pub total_filled: Option<BigDecimal>,
    /// Total optimistic filled.
    pub total_optimistic_filled: Option<BigDecimal>,
    /// Block height.
    pub good_til_block: Option<Height>,
    /// Time(UTC).
    pub good_til_block_time: Option<DateTime<Utc>>,
    /// Trigger price.
    pub trigger_price: Option<Price>,
    /// Time(UTC).
    pub updated_at: Option<DateTime<Utc>>,
    /// Block height.
    pub updated_at_height: Option<Height>,
    /// Removal reason.
    pub removal_reason: Option<String>,
    /// Block height.
    pub created_at_height: Option<Height>,
    /// Client metadata.
    pub client_metadata: Option<ClientMetadata>,
}

/// Fill per subaccount.
#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FillSubaccountMessageContents {
    /// Fill id.
    pub id: FillId,
    /// Subaccount id.
    pub subaccount_id: SubaccountId,
    /// Order side.
    pub side: OrderSide,
    /// Liquidity.
    pub liquidity: Liquidity,
    /// Fill type.
    #[serde(rename = "type")]
    pub fill_type: FillType,
    /// Clob pair id.
    pub clob_pair_id: ClobPairId,
    /// Size.
    pub size: Quantity,
    /// Price.
    pub price: Price,
    /// Quote amount.
    pub quote_amount: String,
    /// Event id.
    pub event_id: String,
    /// Transaction hash.
    pub transaction_hash: String,
    /// Time(UTC).
    pub created_at: DateTime<Utc>,
    /// Block height.
    pub created_at_height: Height,
    /// Market ticker.
    pub ticker: Ticker,
    /// Order id.
    pub order_id: Option<OrderId>,
    /// Client metadata.
    pub client_metadata: Option<ClientMetadata>,
}

/// Transfer per subaccount.
#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TransferSubaccountMessageContents {
    /// Sender.
    pub sender: Account,
    /// Recipient.
    pub recipient: Account,
    /// Token symbol.
    pub symbol: Symbol,
    /// Size.
    pub size: Quantity,
    /// Transfer type.
    #[serde(rename = "type")]
    pub transfer_type: TransferType,
    /// Transaction hash.
    pub transaction_hash: String,
    /// Time(UTC).
    pub created_at: DateTime<Utc>,
    /// Block height.
    pub created_at_height: Height,
}

/// Trading reward.
#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TradingRewardSubaccountMessageContents {
    /// Trading reward.
    pub trading_reward: BigDecimal,
    /// Time(UTC).
    pub created_at: DateTime<Utc>,
    /// Block height.
    pub created_at_height: Height,
}

/// Subaccount update.
#[derive(Debug, Deserialize)]
pub struct ParentSubaccountsUpdateMessage {
    /// Connection id.
    pub connection_id: String,
    /// Update.
    #[serde(deserialize_with = "deserialize_subaccounts_contents")]
    pub contents: Vec<SubaccountUpdateMessageContents>,
    /// Id.
    pub id: String,
    /// Message id.
    pub message_id: u64,
    /// Version.
    pub version: String,
}

/// Subaccount update contents.
#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParentSubaccountUpdateMessageContents {
    /// Perpetual position updates on the subaccount.
    pub perpetual_positions: Option<Vec<PerpetualPositionSubaccountMessageContents>>,
    /// Asset position updates on the subaccount.
    pub asset_positions: Option<Vec<AssetPositionSubaccountMessageContents>>,
    /// Order updates on the subaccount.
    pub orders: Option<Vec<OrderSubaccountMessageContents>>,
    /// Fills that occur on the subaccount.
    pub fills: Option<Vec<FillSubaccountMessageContents>>,
    /// Transfers that occur on the subaccount.
    pub transfers: Option<TransferSubaccountMessageContents>,
    /// Rewards that occur on the subaccount.
    pub trading_reward: Option<TradingRewardSubaccountMessageContents>,
    /// Block height.
    pub block_height: Option<Height>,
}

/// Order update message.
#[derive(Debug, Deserialize)]
pub struct OrdersUpdateMessage {
    /// Connection id.
    pub connection_id: String,
    /// Update.
    #[serde(deserialize_with = "deserialize_orders_contents")]
    pub contents: OrdersUpdateMessageContents,
    /// Id.
    pub id: String,
    /// Message id.
    pub message_id: u64,
    /// Version.
    pub version: String,
}

fn deserialize_orders_contents<'de, D>(
    deserializer: D,
) -> Result<OrdersUpdateMessageContents, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let value = Value::deserialize(deserializer)?;

    match value {
        // Batched
        Value::Array(arr) => {
            let mut bids = Vec::new();
            let mut asks = Vec::new();

            for v in arr {
                let item: OrdersUpdateMessageContents =
                    serde_json::from_value(v).map_err(serde::de::Error::custom)?;

                if let Some(item_bids) = item.bids {
                    bids.extend(item_bids);
                }
                if let Some(item_asks) = item.asks {
                    asks.extend(item_asks);
                }
            }

            Ok(OrdersUpdateMessageContents {
                bids: if bids.is_empty() { None } else { Some(bids) },
                asks: if asks.is_empty() { None } else { Some(asks) },
            })
        }
        // Streamed
        Value::Object(obj) => {
            let item =
                serde_json::from_value::<OrdersUpdateMessageContents>(Value::Object(obj.clone()))
                    .map_err(serde::de::Error::custom)?;
            Ok(item)
        }
        _ => Err(serde::de::Error::custom("Expected array or object")),
    }
}

/// Orderbook update.
#[derive(Deserialize, Debug, Clone)]
pub struct OrdersUpdateMessageContents {
    /// Bids.
    pub bids: Option<Vec<OrderbookResponsePriceLevel>>,
    /// Asks.
    pub asks: Option<Vec<OrderbookResponsePriceLevel>>,
}

/// Trades update.
#[derive(Deserialize, Debug, Clone)]
pub struct TradesUpdateMessage {
    /// Connection id.
    pub connection_id: String,
    /// Update.
    #[serde(deserialize_with = "deserialize_trades_contents")]
    pub contents: Vec<TradesUpdateMessageContents>,
    /// Id.
    pub id: String,
    /// Message id.
    pub message_id: u64,
    /// Version.
    pub version: String,
}
generate_contents_deserialize_function!(deserialize_trades_contents, TradesUpdateMessageContents);

/// Trades updates.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TradesUpdateMessageContents {
    /// Updates.
    pub trades: Vec<TradeUpdate>,
}

/// Trade update.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TradeUpdate {
    /// Unique id of the trade, which is the taker fill id.
    pub id: TradeId,
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

/// Markets update message.
#[derive(Debug, Deserialize)]
pub struct MarketsUpdateMessage {
    /// Connection id.
    pub connection_id: String,
    /// Updates.
    #[serde(deserialize_with = "deserialize_markets_contents")]
    pub contents: Vec<MarketsUpdateMessageContents>,
    /// Message id.
    pub message_id: u64,
    /// Version.
    pub version: String,
}
generate_contents_deserialize_function!(deserialize_markets_contents, MarketsUpdateMessageContents);

/// Markets update.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MarketsUpdateMessageContents {
    /// Trading.
    pub trading: Option<HashMap<Ticker, TradingPerpetualMarket>>,
    /// Oracle prices.
    pub oracle_prices: Option<HashMap<Ticker, OraclePriceMarket>>,
}

/// Perpetual market info.
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TradingPerpetualMarket {
    /// Atomic resolution
    pub atomic_resolution: Option<i32>,
    /// Base asset.
    pub base_asset: Option<String>,
    /// Base open interest.
    pub base_open_interest: Option<BigDecimal>,
    /// Base position size.
    pub base_position_size: Option<Quantity>,
    /// Clob pair id.
    pub clob_pair_id: Option<ClobPairId>,
    /// Id.
    pub id: Option<String>,
    /// Market id.
    pub market_id: Option<u64>,
    /// Incremental position size.
    pub incremental_position_size: Option<Quantity>,
    /// Initial margin fraction.
    pub initial_margin_fraction: Option<BigDecimal>,
    /// Maintenance margin fraction.
    pub maintenance_margin_fraction: Option<BigDecimal>,
    /// Max position size.
    pub max_position_size: Option<Quantity>,
    /// Open interest.
    pub open_interest: Option<BigDecimal>,
    /// Quantum conversion exponent.
    pub quantum_conversion_exponent: Option<i32>,
    /// Quote asset.
    pub quote_asset: Option<String>,
    /// Market status
    pub status: Option<PerpetualMarketStatus>,
    /// Step base quantums.
    pub step_base_quantums: Option<i32>,
    /// Subticks per tick.
    pub subticks_per_tick: Option<i32>,
    /// Market ticker.
    pub ticker: Option<Ticker>,
    /// 24-h price change.
    #[serde(rename = "priceChange24H")]
    pub price_change_24h: Option<BigDecimal>,
    /// 24-h number of trades.
    #[serde(rename = "trades24H")]
    pub trades_24h: Option<u64>,
    /// 24-h volume.
    #[serde(rename = "volume24H")]
    pub volume_24h: Option<Quantity>,
    /// Next funding rate.
    pub next_funding_rate: Option<BigDecimal>,
}

/// Oracle price for market.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OraclePriceMarket {
    /// Oracle price.
    pub oracle_price: Price,
    /// Time(UTC).
    pub effective_at: DateTime<Utc>,
    /// Block height.
    pub effective_at_height: Height,
    /// Market id.
    pub market_id: u64,
}

/// Candles update.
#[derive(Debug, Deserialize)]
pub struct CandlesUpdateMessage {
    /// Connection id.
    pub connection_id: String,
    /// Candle.
    #[serde(deserialize_with = "deserialize_candles_contents")]
    pub contents: Vec<Candle>,
    /// Id.
    pub id: String,
    /// Message id.
    pub message_id: u64,
    /// Version.
    pub version: String,
}
generate_contents_deserialize_function!(deserialize_candles_contents, Candle);

/// Block height update message.
#[derive(Debug, Deserialize)]
pub struct BlockHeightUpdateMessage {
    /// Connection id.
    pub connection_id: String,
    /// Updates.
    #[serde(deserialize_with = "deserialize_block_height_contents")]
    pub contents: Vec<BlockHeightUpdateMessageContents>,
    /// Message id.
    pub message_id: u64,
    /// Version.
    pub version: String,
}
generate_contents_deserialize_function!(
    deserialize_block_height_contents,
    BlockHeightUpdateMessageContents
);

/// Block height update message contents.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BlockHeightUpdateMessageContents {
    /// Block height.
    pub block_height: Height,
    /// Time of block.
    pub time: DateTime<Utc>,
}
