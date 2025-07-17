use super::*;

use anyhow::{anyhow as err, ensure, Error};
use base64::prelude::*;
use dydx_proto::dydxprotocol::accountplus::{
    AccountAuthenticator, GetAuthenticatorsRequest, MsgAddAuthenticator, MsgRemoveAuthenticator,
};
use serde::ser;

/// [`NodeClient`] Authenticator requests dispatcher.
pub struct Authenticators<'a> {
    client: &'a mut NodeClient,
}

/// [`Authenticator`] type.
/// An authenticator can be composed by a single or multiple types.
#[derive(Debug, Clone, Eq, Hash, PartialEq)]
pub enum Authenticator {
    /// Enables authentication via a specific key.
    SignatureVerification(Vec<u8>),
    /// Restricts authentication to certain message types. Configured using string bytes, with
    /// different message types separated by commas.
    MessageFilter(String),
    /// Restricts authentication to certain subaccount constraints. Configured using string bytes,
    /// with different IDs separated by commas.
    SubaccountFilter(String),
    /// Restricts transactions to specific CLOB pair IDs. Configured using string bytes, with
    /// different subaccount numbers separated by commas.
    ClobPairIdFilter(String),
    /// Composable type, restricts authentication if any sub-authenticator is valid.
    AnyOf(Vec<Authenticator>),
    /// Composable type, restricts authentication if all sub-authenticators are valid.
    AllOf(Vec<Authenticator>),
}

impl<'a> Authenticators<'a> {
    /// Create a new Authenticator requests dispatcher
    pub(crate) fn new(client: &'a mut NodeClient) -> Self {
        Self { client }
    }

    /// Add an [`Authenticator`].
    /// Authenticators can be built using the [`AuthenticatorBuilder`] mechanism.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/authenticator.rs).
    pub async fn add(
        &mut self,
        account: &mut Account,
        address: Address,
        authenticator: Authenticator,
    ) -> Result<TxHash, NodeError> {
        let client = &mut self.client;

        authenticator
            .validate()
            .map_err(|e| err!("Authenticator structure validation failed: {e}"))?;

        let msg = MsgAddAuthenticator {
            sender: address.into(),
            authenticator_type: authenticator.type_to_str().to_owned(),
            data: authenticator.config_to_bytes()?,
        };

        let tx_raw = client.create_transaction(account, msg, None).await?;

        client.broadcast_transaction(tx_raw).await
    }

    /// Remove an authenticator.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/authenticator.rs).
    pub async fn remove(
        &mut self,
        account: &mut Account,
        address: Address,
        id: u64,
    ) -> Result<TxHash, NodeError> {
        let client = &mut self.client;

        let msg = MsgRemoveAuthenticator {
            sender: address.into(),
            id,
        };

        let tx_raw = client.create_transaction(account, msg, None).await?;

        client.broadcast_transaction(tx_raw).await
    }

    /// List authenticators.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/authenticator.rs).
    pub async fn list(&mut self, address: Address) -> Result<Vec<AccountAuthenticator>, Error> {
        let client = &mut self.client;

        let req = GetAuthenticatorsRequest {
            account: address.into(),
        };

        let response = client
            .accountplus
            .get_authenticators(req)
            .await?
            .into_inner();

        Ok(response.account_authenticators)
    }
}

impl Authenticator {
    /// Get the authenticator's type' string representation.
    pub(super) fn type_to_str(&self) -> &str {
        match self {
            Authenticator::SignatureVerification(_) => "SignatureVerification",
            Authenticator::MessageFilter(_) => "MessageFilter",
            Authenticator::ClobPairIdFilter(_) => "ClobPairIdFilter",
            Authenticator::SubaccountFilter(_) => "SubaccountFilter",
            Authenticator::AnyOf(_) => "AnyOf",
            Authenticator::AllOf(_) => "AllOf",
        }
    }

    pub(super) fn config_to_bytes(&self) -> Result<Vec<u8>> {
        match self {
            Authenticator::AllOf(types) | Authenticator::AnyOf(types) => {
                Ok(serde_json::to_string(&types)?.into_bytes())
            }
            Authenticator::SignatureVerification(v) => Ok(v.clone()),
            Authenticator::MessageFilter(v)
            | Authenticator::ClobPairIdFilter(v)
            | Authenticator::SubaccountFilter(v) => Ok(v.clone().into_bytes()),
        }
    }

    /// Self integrity validation, checking if the Authenticator tree-like structure is valid.
    pub fn validate(&self) -> Result<()> {
        match self {
            // SignatureVerification must cover all authenticator paths
            Authenticator::SignatureVerification(_) => Ok(()),
            Authenticator::MessageFilter(_)
            | Authenticator::ClobPairIdFilter(_)
            | Authenticator::SubaccountFilter(_) => Err(err!(
                "{} not covered by a SignatureVerification",
                self.type_to_str()
            )),
            Authenticator::AnyOf(types) => {
                ensure!(
                    types.len() >= 2,
                    "AnyOf authenticator must have at least 2 sub-authenticators"
                );
                // AnyOf is valid only if all sub-authenticators returns Ok()
                types
                    .iter()
                    .try_for_each(|ty| ty.validate())
                    .map_err(|e| err!("AnyOf sub-authenticator failed: {e}"))?;
                Ok(())
            }
            Authenticator::AllOf(types) => {
                ensure!(
                    types.len() >= 2,
                    "AllOf authenticator must have at least 2 sub-authenticators"
                );
                // AllOf is valid only if any sub-authenticator returns Ok()
                if !types.iter().any(|ty| ty.validate().is_ok()) {
                    return Err(err!(
                        "AllOf sub-authenticators do not contain a SignatureVerification"
                    ));
                };
                Ok(())
            }
        }
    }
}

impl serde::Serialize for Authenticator {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut json_obj = serde_json::Map::new();

        // type (tag)
        json_obj.insert(
            "type".to_string(),
            serde_json::Value::String(self.type_to_str().to_string()),
        );

        // config (content)
        let config_bytes = match self {
            Authenticator::SignatureVerification(bytes) => bytes.to_owned(),
            Authenticator::MessageFilter(string)
            | Authenticator::SubaccountFilter(string)
            | Authenticator::ClobPairIdFilter(string) => string.clone().into_bytes(),
            Authenticator::AnyOf(auths) | Authenticator::AllOf(auths) => {
                serde_json::to_string(auths)
                    .map_err(|e| ser::Error::custom(format!("JSON serialization error: {e}")))?
                    .into_bytes()
            }
        };
        let base64 = BASE64_STANDARD.encode(config_bytes);
        json_obj.insert("config".to_string(), serde_json::Value::String(base64));

        serde_json::Value::Object(json_obj).serialize(serializer)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_authenticator_check_anyof_sigs() -> Result<()> {
        let auth = Authenticator::AnyOf(vec![
            Authenticator::SignatureVerification(vec![]),
            Authenticator::SignatureVerification(vec![]),
        ]);
        auth.validate()?;
        Ok(())
    }

    #[test]
    fn test_authenticator_check_anyof_sig_nosig() -> Result<()> {
        let auth = Authenticator::AnyOf(vec![
            Authenticator::SignatureVerification(vec![]),
            Authenticator::MessageFilter("".into()),
        ]);
        // Sig must not be ignored
        assert!(auth.validate().is_err());
        Ok(())
    }

    #[test]
    fn test_authenticator_check_allof_sig_nosig() -> Result<()> {
        let auth = Authenticator::AllOf(vec![
            Authenticator::SignatureVerification(vec![]),
            Authenticator::MessageFilter("".into()),
        ]);
        auth.validate()?;
        Ok(())
    }

    #[test]
    fn test_authenticator_check_allof_nosig() -> Result<()> {
        let auth = Authenticator::AllOf(vec![
            Authenticator::MessageFilter("".into()),
            Authenticator::MessageFilter("".into()),
        ]);
        // There should be a sig
        assert!(auth.validate().is_err());
        Ok(())
    }

    #[test]
    fn test_authenticator_check_allof_anyof() -> Result<()> {
        let auth = Authenticator::AllOf(vec![
            Authenticator::SignatureVerification(vec![]),
            Authenticator::AnyOf(vec![
                Authenticator::MessageFilter("".into()),
                Authenticator::MessageFilter("".into()),
            ]),
        ]);
        auth.validate()?;
        Ok(())
    }

    #[test]
    fn test_authenticator_check_allof_allof() -> Result<()> {
        let auth = Authenticator::AllOf(vec![
            Authenticator::MessageFilter("".into()),
            Authenticator::AllOf(vec![
                Authenticator::SignatureVerification(vec![]),
                Authenticator::SignatureVerification(vec![]),
            ]),
        ]);
        auth.validate()?;
        Ok(())
    }

    #[test]
    fn test_authenticator_check_allof_anyof_sig_nosig() -> Result<()> {
        let auth = Authenticator::AllOf(vec![
            Authenticator::MessageFilter("".into()),
            Authenticator::AnyOf(vec![
                Authenticator::MessageFilter("".into()),
                Authenticator::SignatureVerification(vec![]),
            ]),
        ]);
        // Sig does not cover Msg->Msg
        assert!(auth.validate().is_err());
        Ok(())
    }

    #[test]
    fn test_authenticator_check_anyof_anyof_sig_nosig() -> Result<()> {
        let auth = Authenticator::AnyOf(vec![
            Authenticator::MessageFilter("".into()),
            Authenticator::AnyOf(vec![
                Authenticator::MessageFilter("".into()),
                Authenticator::SignatureVerification(vec![]),
            ]),
        ]);
        // Sig does not cover Msg, Msg->Msg
        assert!(auth.validate().is_err());
        Ok(())
    }
}
