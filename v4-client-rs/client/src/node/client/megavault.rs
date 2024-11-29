use super::*;
use crate::node::utils::BigIntExt;

use anyhow::{anyhow as err, Error};
use dydx_proto::dydxprotocol::{
    subaccounts::SubaccountId,
    vault::{
        MsgDepositToMegavault, MsgWithdrawFromMegavault, NumShares,
        QueryMegavaultOwnerSharesRequest, QueryMegavaultOwnerSharesResponse,
        QueryMegavaultWithdrawalInfoRequest, QueryMegavaultWithdrawalInfoResponse,
    },
};

use bigdecimal::num_bigint::ToBigInt;

/// [`NodeClient`] MegaVault requests dispatcher
pub struct MegaVault<'a> {
    client: &'a mut NodeClient,
}

impl<'a> MegaVault<'a> {
    /// Create a new MegaVault requests dispatcher
    pub(crate) fn new(client: &'a mut NodeClient) -> Self {
        Self { client }
    }

    /// Deposit USDC into the MegaVault.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_megavault.rs).
    pub async fn deposit(
        &mut self,
        account: &mut Account,
        subaccount: Subaccount,
        amount: impl Into<Usdc>,
    ) -> Result<TxHash, NodeError> {
        let client = &mut self.client;

        let subaccount_id = SubaccountId {
            owner: subaccount.address.to_string(),
            number: subaccount.number.0,
        };
        let quantums = amount
            .into()
            .quantize()
            .to_bigint()
            .ok_or_else(|| err!("Failed converting USDC quantums to BigInt"))?
            .to_serializable_vec()?;

        let msg = MsgDepositToMegavault {
            subaccount_id: Some(subaccount_id),
            quote_quantums: quantums,
        };

        let tx_raw = client.create_transaction(account, msg).await?;

        client.broadcast_transaction(tx_raw).await
    }

    /// Withdraw shares from the MegaVault.
    /// The number of shares must be equal or greater to some specified minimum amount (in
    /// USDC-equivalent value).
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_megavault.rs).
    pub async fn withdraw(
        &mut self,
        account: &mut Account,
        subaccount: Subaccount,
        min_amount: impl Into<Usdc>,
        shares: Option<&BigInt>,
    ) -> Result<TxHash, NodeError> {
        let client = &mut self.client;

        let subaccount_id = SubaccountId {
            owner: subaccount.address.to_string(),
            number: subaccount.number.0,
        };
        let quantums = min_amount
            .into()
            .quantize()
            .to_bigint()
            .ok_or_else(|| err!("Failed converting USDC quantums to BigInt"))?
            .to_serializable_vec()?;
        let num_shares = shares
            .map(|x| x.to_serializable_vec())
            .transpose()?
            .map(|vec| NumShares { num_shares: vec });

        let msg = MsgWithdrawFromMegavault {
            subaccount_id: Some(subaccount_id),
            min_quote_quantums: quantums,
            shares: num_shares,
        };

        let tx_raw = client.create_transaction(account, msg).await?;

        client.broadcast_transaction(tx_raw).await
    }

    /// Query the shares associated with an [`Address`].
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_megavault.rs).
    pub async fn get_owner_shares(
        &mut self,
        address: &Address,
    ) -> Result<QueryMegavaultOwnerSharesResponse, Error> {
        let client = &mut self.client;
        let req = QueryMegavaultOwnerSharesRequest {
            address: address.to_string(),
        };

        let response = client.vault.megavault_owner_shares(req).await?.into_inner();

        Ok(response)
    }

    /// Query the withdrawal information for a specified number of shares.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_megavault.rs).
    pub async fn get_withdrawal_info(
        &mut self,
        shares: &BigInt,
    ) -> Result<QueryMegavaultWithdrawalInfoResponse, Error> {
        let client = &mut self.client;
        let num_shares = NumShares {
            num_shares: shares.to_serializable_vec()?,
        };
        let req = QueryMegavaultWithdrawalInfoRequest {
            shares_to_withdraw: Some(num_shares),
        };

        let response = client
            .vault
            .megavault_withdrawal_info(req)
            .await?
            .into_inner();

        Ok(response)
    }
}
