use thiserror::Error;
use tonic::Status;

/// Node error.
#[derive(Error, Debug)]
pub enum NodeError {
    /// General error.
    #[error("General error: {0}")]
    General(#[from] anyhow::Error),
    /// Broadcast error.
    #[error("Broadcast error: {0}")]
    Broadcast(#[from] BroadcastError),
}

/// Broadcast error.
#[derive(Error, Debug)]
#[error("Broadcast error {code:?} with log: {message}")]
pub struct BroadcastError {
    /// Code.
    ///
    /// [Codes](https://github.com/dydxprotocol/v4-chain/blob/main/protocol/x/clob/types/errors.go).
    pub code: Option<u32>,
    /// Message.
    pub message: String,
}

impl From<Status> for BroadcastError {
    fn from(error: Status) -> Self {
        BroadcastError {
            code: None,
            message: error.message().to_string(),
        }
    }
}

impl BroadcastError {
    pub(crate) fn get_collateral_reason(&self) -> Option<&str> {
        match self {
            // A code is sent in BroadcastTxResponse
            BroadcastError {
                code: Some(3007), ..
            } => {
                Some("Broadcast error 3007 received (under collaterization), ignoring")
            }
            // Tonic::Status is unknown with a message string with the error
            BroadcastError {
                code: None,
                message,
            } if message.contains("StillUndercollateralized")
                || message.contains("NewlyUndercollateralized") =>
            {
                Some("Broadcast error 'StillUndercollateralized' / 'NewlyUndercollateralized', ignoring")
            }
            _ => None,
        }
    }
}
