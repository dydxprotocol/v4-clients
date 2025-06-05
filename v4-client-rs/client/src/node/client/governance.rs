use super::*;
use dydx_proto::{
    cosmos_sdk_proto::cosmos::{
        distribution::v1beta1::MsgWithdrawDelegatorReward,
        staking::v1beta1::{MsgDelegate, MsgUndelegate},
    },
    dydxprotocol::affiliates::MsgRegisterAffiliate,
};

/// [`NodeClient`] Governance requests dispatcher.
pub struct Governance<'a> {
    client: &'a mut NodeClient,
}

impl<'a> Governance<'a> {
    pub(crate) fn new(client: &'a mut NodeClient) -> Self {
        Self { client }
    }

    /// Delegate coins from a delegator to a validator.
    pub async fn delegate(
        &mut self,
        account: &mut Account,
        delegator: Address,
        validator: Address,
        token: impl Tokenized,
    ) -> Result<TxHash, NodeError> {
        let msg = MsgDelegate {
            delegator_address: delegator.into(),
            validator_address: validator.into(),
            amount: Some(token.coin()?),
        };

        let tx_raw = self.client.create_transaction(account, msg, None).await?;

        self.client.broadcast_transaction(tx_raw).await
    }

    /// Undelegate coins from a delegator to a validator.
    pub async fn undelegate(
        &mut self,
        account: &mut Account,
        delegator: Address,
        validator: Address,
        token: impl Tokenized,
    ) -> Result<TxHash, NodeError> {
        let msg = MsgUndelegate {
            delegator_address: delegator.into(),
            validator_address: validator.into(),
            amount: Some(token.coin()?),
        };

        let tx_raw = self.client.create_transaction(account, msg, None).await?;

        self.client.broadcast_transaction(tx_raw).await
    }

    /// Delegation withdrawal to a delegator from a validator.
    pub async fn withdraw_delegate_reward(
        &mut self,
        account: &mut Account,
        delegator: Address,
        validator: Address,
    ) -> Result<TxHash, NodeError> {
        let msg = MsgWithdrawDelegatorReward {
            delegator_address: delegator.into(),
            validator_address: validator.into(),
        };

        let tx_raw = self.client.create_transaction(account, msg, None).await?;

        self.client.broadcast_transaction(tx_raw).await
    }

    /// Register a referee-affiliate relationship.
    pub async fn register_affiliate(
        &mut self,
        account: &mut Account,
        referee: Address,
        affiliate: Address,
    ) -> Result<TxHash, NodeError> {
        let msg = MsgRegisterAffiliate {
            referee: referee.into(),
            affiliate: affiliate.into(),
        };

        let tx_raw = self.client.create_transaction(account, msg, None).await?;

        self.client.broadcast_transaction(tx_raw).await
    }
}
