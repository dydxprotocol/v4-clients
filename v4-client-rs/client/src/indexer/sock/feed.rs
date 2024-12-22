use anyhow::anyhow as err;
use derive_more::Debug;
use std::ops::{Deref, DerefMut};
use thiserror::Error;
use tokio::sync::mpsc;

use super::connector::{ConnectorMessage, ConnectorStatusMessage};
use super::{ControlMsg, FeedMessage, Subscription};

/// Realtime feed.
///
/// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/websockets.rs).
pub struct Feed<T: TryFrom<FeedMessage>> {
    feed: mpsc::UnboundedReceiver<ConnectorMessage<T>>,
    sub: Subscription,
    ctrl: mpsc::UnboundedSender<ControlMsg>,
}

impl<T> Feed<T>
where
    T: TryFrom<FeedMessage> + Debug,
{
    pub(crate) async fn setup(
        mut feed: mpsc::UnboundedReceiver<ConnectorMessage<T>>,
        sub: Subscription,
        ctrl: mpsc::UnboundedSender<ControlMsg>,
    ) -> Result<Self, FeedError> {
        if let Some(msg) = feed.recv().await {
            match msg {
                ConnectorMessage::Status(ConnectorStatusMessage::Connected) => {
                    Ok(Self { feed, sub, ctrl })
                }
                ConnectorMessage::Status(status) => Err(status.into()),
                other => Err(err!("Connector sent {:?}. Expected Connected status.", other).into()),
            }
        } else {
            Err(FeedError::Disconnected)
        }
    }

    // Can be made return Result
    /// Receive feed update.
    pub async fn recv(&mut self) -> Option<T> {
        match self.feed.recv().await {
            Some(ConnectorMessage::Feed(feed)) => Some(feed),
            _ => None,
        }
    }
}

impl<T: TryFrom<FeedMessage>> Drop for Feed<T> {
    fn drop(&mut self) {
        if let Err(err) = self.ctrl.send(ControlMsg::Unsubscribe(self.sub.clone())) {
            log::error!("Sending of Unsubscribe control message to connector failed: {err}");
        }
    }
}

impl<T: TryFrom<FeedMessage>> Deref for Feed<T> {
    type Target = mpsc::UnboundedReceiver<ConnectorMessage<T>>;

    fn deref(&self) -> &Self::Target {
        &self.feed
    }
}

impl<T: TryFrom<FeedMessage>> DerefMut for Feed<T> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.feed
    }
}

/// Feed error.
#[derive(Debug, Error)]
pub enum FeedError {
    /// Channel is disconnected.
    #[error("Channel disconnected")]
    Disconnected,
    /// Resubscription is detected.
    #[error("Resubscription detected")]
    Resubscription,
    /// Other error.
    #[error("Other error: {0}")]
    Other(#[from] anyhow::Error),
}

impl From<ConnectorStatusMessage> for FeedError {
    fn from(status: ConnectorStatusMessage) -> Self {
        match status {
            ConnectorStatusMessage::Disconnected => FeedError::Disconnected,
            ConnectorStatusMessage::Resubscription => FeedError::Resubscription,
            _ => FeedError::Other(err!("Unexpected ConnectorStatusMessage {:?}", status)),
        }
    }
}

impl<T> From<mpsc::error::SendError<T>> for FeedError {
    fn from(_err: mpsc::error::SendError<T>) -> Self {
        FeedError::Disconnected
    }
}
