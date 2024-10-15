use super::{config::SockConfig, messages::*};
use anyhow::{anyhow as err, Error};
use futures_util::{SinkExt, StreamExt};
use governor::{DefaultDirectRateLimiter, Quota, RateLimiter};
use std::collections::{hash_map::Entry, HashMap};
use tokio::{
    net::TcpStream,
    sync::mpsc,
    time::{sleep, Duration},
};
use tokio_tungstenite::{
    connect_async,
    tungstenite::{self, protocol::Message},
    MaybeTlsStream, WebSocketStream,
};

#[cfg(feature = "telemetry")]
use crate::telemetry::{
    LatencyMetric, TELEMETRY_DESC_WS_RECEIVED, TELEMETRY_DESC_WS_RECONNECTS,
    TELEMETRY_DESC_WS_SENT, TELEMETRY_DESC_WS_SENT_DURATION, TELEMETRY_WS_RECEIVED,
    TELEMETRY_WS_RECONNECTS, TELEMETRY_WS_SENT, TELEMETRY_WS_SENT_DURATION,
};

#[derive(Debug)]
pub enum ControlMsg {
    Subscribe(Subscription, bool, ChannelSender),
    Unsubscribe(Subscription),
    #[allow(dead_code)] // TODO remove after completion.
    Terminate,
}

type WsStream = WebSocketStream<MaybeTlsStream<TcpStream>>;

#[derive(Debug)]
pub enum ChannelSender {
    Subaccounts(mpsc::UnboundedSender<ConnectorMessage<SubaccountsMessage>>),
    ParentSubaccounts(mpsc::UnboundedSender<ConnectorMessage<ParentSubaccountsMessage>>),
    Trades(mpsc::UnboundedSender<ConnectorMessage<TradesMessage>>),
    Orders(mpsc::UnboundedSender<ConnectorMessage<OrdersMessage>>),
    Markets(mpsc::UnboundedSender<ConnectorMessage<MarketsMessage>>),
    Candles(mpsc::UnboundedSender<ConnectorMessage<CandlesMessage>>),
    BlockHeight(mpsc::UnboundedSender<ConnectorMessage<BlockHeightMessage>>),
}

impl ChannelSender {
    pub(crate) fn status(&self, msg: ConnectorStatusMessage) -> Result<(), Error> {
        match self {
            Self::Subaccounts(tx) => tx.send(ConnectorMessage::Status(msg))?,
            Self::ParentSubaccounts(tx) => tx.send(ConnectorMessage::Status(msg))?,
            Self::Trades(tx) => tx.send(ConnectorMessage::Status(msg))?,
            Self::Orders(tx) => tx.send(ConnectorMessage::Status(msg))?,
            Self::Markets(tx) => tx.send(ConnectorMessage::Status(msg))?,
            Self::Candles(tx) => tx.send(ConnectorMessage::Status(msg))?,
            Self::BlockHeight(tx) => tx.send(ConnectorMessage::Status(msg))?,
        }
        Ok(())
    }

    pub(crate) fn send(&self, msg: FeedMessage) -> Result<(), Error> {
        match (self, msg) {
            (Self::Subaccounts(tx), FeedMessage::Subaccounts(m)) => {
                tx.send(ConnectorMessage::Feed(m))?
            }
            (Self::ParentSubaccounts(tx), FeedMessage::ParentSubaccounts(m)) => {
                tx.send(ConnectorMessage::Feed(m))?
            }
            (Self::Trades(tx), FeedMessage::Trades(m)) => tx.send(ConnectorMessage::Feed(m))?,
            (Self::Orders(tx), FeedMessage::Orders(m)) => tx.send(ConnectorMessage::Feed(m))?,
            (Self::Markets(tx), FeedMessage::Markets(m)) => tx.send(ConnectorMessage::Feed(m))?,
            (Self::Candles(tx), FeedMessage::Candles(m)) => tx.send(ConnectorMessage::Feed(m))?,
            (Self::BlockHeight(tx), FeedMessage::BlockHeight(m)) => {
                tx.send(ConnectorMessage::Feed(m))?
            }
            _ => return Err(err!("Mismatched ChannelSender and FeedMessage types")),
        }
        Ok(())
    }
}

/// Connector to Client message
#[derive(Debug)]
pub enum ConnectorMessage<T: TryFrom<FeedMessage>> {
    Status(ConnectorStatusMessage),
    Feed(T),
}

#[derive(Debug)]
pub enum ConnectorStatusMessage {
    Connected,
    Disconnected,
    Resubscription,
}

/// WebSockets connection manager, message router
pub(crate) struct Connector {
    client_handle: bool,
    timeout: Duration,
    url: String,
    rx: mpsc::UnboundedReceiver<ControlMsg>,
    subscriptions: HashMap<Subscription, ChannelSender>,
    rate_limiter: DefaultDirectRateLimiter,
}

impl Connector {
    pub(crate) fn new(config: SockConfig, rx: mpsc::UnboundedReceiver<ControlMsg>) -> Self {
        #[cfg(feature = "telemetry")]
        {
            metrics::describe_counter!(
                TELEMETRY_WS_RECONNECTS,
                metrics::Unit::Count,
                TELEMETRY_DESC_WS_RECONNECTS
            );
            metrics::describe_counter!(
                TELEMETRY_WS_RECEIVED,
                metrics::Unit::Count,
                TELEMETRY_DESC_WS_RECEIVED
            );
            metrics::describe_counter!(
                TELEMETRY_WS_SENT,
                metrics::Unit::Count,
                TELEMETRY_DESC_WS_SENT
            );

            metrics::describe_histogram!(
                TELEMETRY_WS_SENT_DURATION,
                metrics::Unit::Milliseconds,
                TELEMETRY_DESC_WS_SENT_DURATION
            );
        }
        Connector {
            client_handle: true,
            url: config.endpoint,
            timeout: Duration::from_millis(config.timeout),
            rx,
            subscriptions: Default::default(),
            rate_limiter: RateLimiter::direct(Quota::per_second(config.rate_limit)),
        }
    }

    pub(crate) async fn entrypoint(mut self) {
        if let Err(err) = self.connection_loop().await {
            log::error!("Connection failed: {err}");
        }
    }

    async fn connection_loop(&mut self) -> Result<(), Error> {
        let (mut wss, _) = connect_async(&self.url).await?;
        while self.is_active() {
            if let Err(err) = self.step(&mut wss).await {
                match err {
                    SockError::Tungstenite(e) => {
                        log::error!(
                            "WebSocket interaction failed: {e}. Attempting reconnection..."
                        );
                        sleep(self.timeout).await;

                        #[cfg(feature = "telemetry")]
                        metrics::counter!(TELEMETRY_WS_RECONNECTS).increment(1);

                        wss = self.reconnect().await?;
                    }
                    SockError::Protocol(e) => log::error!("WebSocket protocol failure: {e}"),
                }
            }
        }
        log::debug!("Stopping connector.");
        self.unsubscribe_all(&mut wss).await?;
        Ok(())
    }

    async fn step(&mut self, wss: &mut WsStream) -> Result<(), SockError> {
        tokio::select! {
            // Client -> Indexer
            Some(msg) = self.rx.recv() => {

                if let Some(msg) = self.process_ctrl_msg(msg).await {
                    #[cfg(feature = "telemetry")]
                    LatencyMetric::new(TELEMETRY_WS_SENT_DURATION);

                    self.send(wss, msg).await?;

                    #[cfg(feature = "telemetry")]
                    metrics::counter!(TELEMETRY_WS_SENT).increment(1);
                }
            }
            // Indexer -> Client
            Some(msg) = wss.next() => {
                self.process_wss_msg(msg?).await?;

                #[cfg(feature = "telemetry")]
                metrics::counter!(TELEMETRY_WS_RECEIVED).increment(1);
            }
        }
        Ok(())
    }

    async fn process_ctrl_msg(&mut self, ctrl_msg: ControlMsg) -> Option<RatedMessage> {
        match ctrl_msg {
            ControlMsg::Subscribe(sub, batched, tx) => {
                let msg = sub.sub_message(batched);
                match self.subscriptions.entry(sub) {
                    Entry::Vacant(entry) => {
                        tx.status(ConnectorStatusMessage::Connected).ok()?;
                        entry.insert(tx);
                        Some(RatedMessage::RateLimited(msg))
                    }
                    Entry::Occupied(_) => {
                        tx.status(ConnectorStatusMessage::Resubscription).ok()?;
                        None
                    }
                }
            }
            ControlMsg::Unsubscribe(sub) => {
                let msg = sub.unsub_message();
                self.subscriptions.remove(&sub);
                Some(RatedMessage::Free(msg))
            }
            ControlMsg::Terminate => {
                self.client_handle = false;
                None
            }
        }
    }

    async fn process_wss_msg(&mut self, wss_msg: Message) -> Result<(), Error> {
        match wss_msg {
            Message::Text(text) => {
                let json: WsMessage =
                    serde_json::from_str(&text).map_err(|e| err!("{e} for message: {text}"))?;
                match json {
                    WsMessage::Setup(setup) => {
                        log::debug!(
                            "Connected to WebSocket stream with ID: {}",
                            setup.connection_id
                        );
                        Ok(())
                    }
                    WsMessage::Error(error) => {
                        Err(err!("Server sent error message: {}", error.message))
                    }
                    WsMessage::Data(data) => {
                        let sub = data.subscription().ok_or_else(|| {
                            err!("Could not match received FeedMessage with a subscription!")
                        })?;
                        let tx = self
                            .subscriptions
                            .get(&sub)
                            .ok_or_else(|| err!("Subscription {sub:?} is not found!"))?;
                        tx.send(data)?;
                        Ok(())
                    }
                    WsMessage::Unsub(unsub) => {
                        log::debug!(
                            "Received unsubscribed message for: {} {}",
                            unsub.channel,
                            unsub.id.unwrap_or("".into())
                        );
                        Ok(())
                    }
                }
            }
            Message::Ping(_) | Message::Pong(_) => Ok(()),
            evt => Err(err!("Unsupported WebSocket event: {evt:?}")),
        }
    }

    async fn reconnect(&mut self) -> Result<WsStream, Error> {
        let (mut wss, _) = connect_async(&self.url).await?;
        // Resubscribe to all
        for sub in &self.subscriptions {
            let msg = sub.0.sub_message(false);
            self.send(&mut wss, RatedMessage::RateLimited(msg)).await?;
        }
        Ok(wss)
    }

    async fn unsubscribe_all(&mut self, wss: &mut WsStream) -> Result<(), Error> {
        for sub in &self.subscriptions {
            let msg = sub.0.unsub_message();
            self.send(wss, RatedMessage::Free(msg)).await?;
        }
        Ok(())
    }

    /// Run while `SockClient` wasn't dropped or there are any live subscriptions
    fn is_active(&self) -> bool {
        self.client_handle || !self.subscriptions.is_empty()
    }

    /// Rate-limiting socket send
    async fn send(&self, wss: &mut WsStream, msg: RatedMessage) -> Result<(), Error> {
        let wmsg = match msg {
            RatedMessage::RateLimited(wmsg) => {
                self.rate_limiter.until_ready().await;
                wmsg
            }
            RatedMessage::Free(wmsg) => wmsg,
        };
        wss.send(wmsg).await?;
        Ok(())
    }
}

#[derive(Debug)]
enum RatedMessage {
    RateLimited(Message),
    Free(Message),
}

#[derive(Debug, thiserror::Error)]
enum SockError {
    #[error("Stream error: {0}")]
    Tungstenite(#[from] tungstenite::Error),
    #[error("Protocol error: {0}")]
    Protocol(#[from] anyhow::Error),
}
