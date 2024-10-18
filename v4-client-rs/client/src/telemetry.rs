use std::time::Instant;

// Metrics
/// Counter for orders opened with [`place_order`](crate::node::NodeClient::place_order).
pub const TELEMETRY_ORDERS_PLACED: &str = "orders.placed";
/// Counter for orders cancelled with [`cancel_order`](crate::node::NodeClient::cancel_order).
pub const TELEMETRY_ORDERS_CANCELLED: &str = "orders.cancelled";
/// Histogram for [`place_order`](crate::node::NodeClient::place_order) duration in milliseconds.
pub const TELEMETRY_PLACE_ORDER_DURATION: &str = "place_order.duration";
/// Histogram for [`cancel_order`](crate::node::NodeClient::cancel_order) duration in milliseconds.
pub const TELEMETRY_CANCEL_ORDER_DURATION: &str = "cancel_order.duration";
/// Histogram for [`batch_cancel_orders`](crate::node::NodeClient::batch_cancel_orders) duration in milliseconds.
pub const TELEMETRY_BATCH_CANCEL_ORDER_DURATION: &str = "batch_cancel_orders.duration";
/// Histogram for [`query_transaction`](crate::node::NodeClient::query_transaction) duration in milliseconds
pub const TELEMETRY_QUERY_TX_DURATION: &str = "query_transaction.duration";
/// Counter for reconnection attempts for Indexer Websocket feed
pub const TELEMETRY_WS_RECONNECTS: &str = "ws.reconnects";
/// Counter for messages received by Indexer Websocket feed.
pub const TELEMETRY_WS_RECEIVED: &str = "ws.received";
/// Counter for messages sent by Indexer Websocket feed.
pub const TELEMETRY_WS_SENT: &str = "ws.sent";
/// Histogram for sending duration in milliseconds, Indexer Websocket feed messages.
pub const TELEMETRY_WS_SENT_DURATION: &str = "ws.sent.duration";
// Descriptions
/// Description for [`TELEMETRY_ORDERS_PLACED`].
pub const TELEMETRY_DESC_ORDERS_PLACED: &str = "Orders opened with `place_order`";
/// Description for [`TELEMETRY_ORDERS_CANCELLED`].
pub const TELEMETRY_DESC_ORDERS_CANCELLED: &str = "Orders cancelled with `cancel_order`";
/// Description for [`TELEMETRY_PLACE_ORDER_DURATION`].
pub const TELEMETRY_DESC_PLACE_ORDER_DURATION: &str = "`place_order` duration in milliseconds";
/// Description for [`TELEMETRY_CANCEL_ORDER_DURATION`].
pub const TELEMETRY_DESC_CANCEL_ORDER_DURATION: &str = "`cancel_order` duration in milliseconds";
/// Description for [`TELEMETRY_BATCH_CANCEL_ORDER_DURATION`].
pub const TELEMETRY_DESC_BATCH_CANCEL_ORDER_DURATION: &str =
    "`batch_cancel_orders` duration in milliseconds";
/// Description for [`TELEMETRY_QUERY_TX_DURATION`].
pub const TELEMETRY_DESC_QUERY_TX_DURATION: &str = "`query_transaction` duration in milliseconds";
/// Description for [`TELEMETRY_WS_RECONNECTS`].
pub const TELEMETRY_DESC_WS_RECONNECTS: &str = "Reconnection attempts for Indexer Websocket feed";
/// Description for [`TELEMETRY_WS_RECEIVED`].
pub const TELEMETRY_DESC_WS_RECEIVED: &str = "Messages received by Indexer Websocket feed";
/// Description for [`TELEMETRY_WS_SENT`].
pub const TELEMETRY_DESC_WS_SENT: &str = "Messages sent by Indexer Websocket feed";
/// Description for [`TELEMETRY_WS_SENT_DURATION`].
pub const TELEMETRY_DESC_WS_SENT_DURATION: &str =
    "Indexer Websocket feed messages, sending duration in milliseconds";
// Labels
/// Label for address.
pub const TELEMETRY_LABEL_ADDRESS: &str = "address";

pub(crate) struct LatencyMetric {
    name: &'static str,
    start: Instant,
}

impl LatencyMetric {
    pub(crate) fn new(name: &'static str) -> Self {
        let start = Instant::now();
        Self { name, start }
    }
}

impl Drop for LatencyMetric {
    fn drop(&mut self) {
        // TODO replace with https://doc.rust-lang.org/stable/std/time/struct.Duration.html#method.as_millis_f64
        // when stable
        let duration = self.start.elapsed();
        let latency = (duration.as_secs() as f64) * (1_000_f64)
            + (duration.subsec_nanos() as f64) / (1_000_000_f64);
        metrics::histogram!(self.name).record(latency);
    }
}
