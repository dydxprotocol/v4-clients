use super::*;
use dydx_proto::{
    cosmos_sdk_proto::cosmos::{
        distribution::v1beta1::MsgWithdrawDelegatorReward,
        staking::v1beta1::{MsgDelegate, MsgUndelegate},
    },
    dydxprotocol::affiliates::MsgRegisterAffiliate,
};
use ibc_proto::cosmos::base::query::v1beta1::PageRequest;
use ibc_proto::cosmos::gov::v1::ProposalStatus;
use ibc_proto::cosmos::{
    distribution::v1beta1::{
        QueryDelegationTotalRewardsRequest, QueryDelegationTotalRewardsResponse,
    },
    gov::v1::{Proposal, QueryProposalsRequest},
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
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/governance.rs).
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
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/governance.rs).
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
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/governance.rs).
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
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/governance.rs).
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

    /// Query for the governance proposals.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/governance.rs).
    pub async fn proposals(
        &mut self,
        status: ProposalStatus,
        voter: Address,
        depositor: Address,
        pagination: Option<PageRequest>,
    ) -> Result<Vec<Proposal>, Error> {
        let req = QueryProposalsRequest {
            proposal_status: status.into(),
            voter: voter.into(),
            depositor: depositor.into(),
            pagination,
        };

        let proposals = self
            .client
            .governance
            .proposals(req)
            .await?
            .into_inner()
            .proposals;

        Ok(proposals)
    }

    /// Query the rewards accrued by a delegator.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/governance.rs).
    pub async fn delegation_total_rewards(
        &mut self,
        delegator_address: Address,
    ) -> Result<QueryDelegationTotalRewardsResponse, Error> {
        let req = QueryDelegationTotalRewardsRequest {
            delegator_address: delegator_address.to_string(),
        };

        let rewards = self
            .client
            .distribution
            .delegation_total_rewards(req)
            .await?
            .into_inner();

        Ok(rewards)
    }
}
