use super::{fee, sequencer::Nonce, Account};
use crate::indexer::{Address, Denom};
use anyhow::{anyhow as err, Error, Result};
pub use cosmrs::tendermint::chain::Id;
use cosmrs::{
    tx::{self, Fee, SignDoc, SignerInfo},
    Any,
};
use dydx_proto::{dydxprotocol::accountplus::TxExtension, ToAny};

/// Transaction builder.
pub struct TxBuilder {
    chain_id: Id,
    fee_denom: Denom,
}

impl TxBuilder {
    /// Create a new transaction builder.
    pub fn new(chain_id: Id, fee_denom: Denom) -> Self {
        Self {
            chain_id,
            fee_denom,
        }
    }

    /// Estimate a transaction fee.
    ///
    /// See also [What Are Crypto Gas Fees?](https://dydx.exchange/crypto-learning/what-are-crypto-gas-fees).
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/withdraw_other.rs).
    pub fn calculate_fee(&self, gas_used: Option<u64>) -> Result<Fee, Error> {
        if let Some(gas) = gas_used {
            fee::calculate(gas, &self.fee_denom)
        } else {
            Ok(fee::default())
        }
    }

    /// Build a transaction for given messages.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/withdraw_other.rs).
    pub fn build_transaction(
        &self,
        account: &Account,
        msgs: impl IntoIterator<Item = Any>,
        fee: Option<Fee>,
        auth: Option<&Address>,
    ) -> Result<tx::Raw, Error> {
        let mut builder = tx::BodyBuilder::new();
        builder.msgs(msgs).memo("");
        // Add authenticators, if present, as a Tx extension
        let mut authing = None;
        if let Some(address) = auth {
            if let Some((acc, ids)) = account.authenticators().get(address) {
                let ext = TxExtension {
                    selected_authenticators: ids.clone(),
                };
                builder.non_critical_extension_option(ext.to_any());
                authing = Some(acc);
            }
        }
        let tx_body = builder.finish();

        let fee = fee.unwrap_or(self.calculate_fee(None)?);

        // If an authenticator is used, use its parameters instead
        let (next_nonce, account_number) = if let Some(authing) = authing {
            (authing.next_nonce(), authing.account_number())
        } else {
            (account.next_nonce(), account.account_number())
        };

        let nonce = match next_nonce {
            Some(Nonce::Sequence(number) | Nonce::Timestamp(number)) => *number,
            None => return Err(err!("Account's next nonce not set")),
        };
        let auth_info = SignerInfo::single_direct(Some(account.public_key()), nonce).auth_info(fee);

        let sign_doc = SignDoc::new(&tx_body, &auth_info, &self.chain_id, account_number)
            .map_err(|e| err!("cannot create sign doc: {e}"))?;

        account.sign(sign_doc)
    }
}
