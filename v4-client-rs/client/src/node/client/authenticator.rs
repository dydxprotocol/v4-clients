use super::*;

use anyhow::{anyhow as err, bail, ensure, Error};
use core::fmt;
use dydx_proto::dydxprotocol::{
    accountplus::{
        AccountAuthenticator, GetAuthenticatorsRequest, GetAuthenticatorsResponse,
        MsgAddAuthenticator, MsgRemoveAuthenticator,
    },
    subaccounts::SubaccountId,
};
use serde::{Deserialize, Serialize};

/// [`NodeClient`] Authenticator requests dispatcher
pub struct Authenticators<'a> {
    client: &'a mut NodeClient,
}

///
#[derive(Debug, Clone, Copy, Eq, Hash, PartialEq, Serialize, Deserialize)]
pub enum AuthenticatorType {
    ///
    SignatureVerification,
    ///
    MessageFilter,
    ///
    ClobPairIdFilter,
    ///
    SubaccountFilter,
}

impl fmt::Display for AuthenticatorType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl<'a> Authenticators<'a> {
    /// Create a new Authenticator requests dispatcher
    pub(crate) fn new(client: &'a mut NodeClient) -> Self {
        Self { client }
    }

    /// Add an authenticator.
    ///
    /// Check [the example]().
    pub async fn add(
        &mut self,
        account: &mut Account,
        address: Address,
        authenticator: Authenticator,
    ) -> Result<TxHash, NodeError> {
        let client = &mut self.client;

        authenticator.check()?;

        let msg = MsgAddAuthenticator {
            sender: address.into(),
            authenticator_type: authenticator.type_to_string()?,
            data: authenticator.config_to_bytes()?,
        };

        let tx_raw = client.create_transaction(account, msg, None).await?;

        client.broadcast_transaction(tx_raw).await
    }

    /// Remove an authenticator.
    ///
    /// Check [the example]().
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
    /// Check [the example]().
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

///
#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct AuthenticatorEntry {
    #[serde(rename = "type")]
    ty: AuthenticatorType,
    config: Vec<u8>,
}

///
#[derive(Debug, Clone)]
pub(crate) enum AuthenticatorComposableType {
    AnyOf,
    AllOf,
    Single,
}

impl fmt::Display for AuthenticatorComposableType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

///
#[derive(Debug, Clone)]
pub struct Authenticator {
    pub(crate) composable: AuthenticatorComposableType,
    pub(crate) config: Vec<AuthenticatorEntry>,
}

impl Authenticator {
    /// Self integrity check
    pub(super) fn check(&self) -> Result<()> {
        if self.config.is_empty() {
            return Err(err!("Authenticator methods are empty").into());
        }
        match self.composable {
            AuthenticatorComposableType::AllOf | AuthenticatorComposableType::AnyOf => {
                if self.config.len() < 2 {
                    return Err(err!(
                        "{:?} authenticator must have at least 2 sub-authenticators",
                        self.composable
                    )
                    .into());
                }
            }
            _ => (),
        }
        Ok(())
    }

    ///
    pub(super) fn type_to_string(&self) -> Result<String> {
        match self.composable {
            AuthenticatorComposableType::AllOf | AuthenticatorComposableType::AnyOf => {
                Ok(self.composable.to_string())
            }
            AuthenticatorComposableType::Single => {
                // Use the first entry
                self.config.iter().next().map(|entry| entry.ty.to_string()).ok_or_else(|| err!("Authenticator must contain at least one authenticator method if not composable"))
            }
        }
    }

    ///
    pub(super) fn config_to_bytes(&self) -> Result<Vec<u8>> {
        match self.composable {
            AuthenticatorComposableType::AllOf | AuthenticatorComposableType::AnyOf => {
                Ok(serde_json::to_string(&self.config)?.into_bytes())
            }
            AuthenticatorComposableType::Single => {
                // Use the first entry
                self.config.iter().next().map(|entry| entry.config.clone()).ok_or_else(|| err!("Authenticator must contain at least one authenticator method if not composable"))
            }
        }
    }
}

/// Authenticator builder
#[derive(Debug, Clone)]
pub struct AuthenticatorBuilder {
    auth: Authenticator,
}

impl AuthenticatorBuilder {
    ///
    pub fn empty() -> Self {
        Self {
            auth: Authenticator {
                composable: AuthenticatorComposableType::Single,
                config: Vec::new(),
            },
        }
    }

    /// Sets the authenticator as "any of"
    pub fn any_of(&mut self) -> &mut Self {
        self.auth.composable = AuthenticatorComposableType::AnyOf;
        self
    }

    /// Sets the authenticator as "all of"
    pub fn all_of(&mut self) -> &mut Self {
        self.auth.composable = AuthenticatorComposableType::AllOf;
        self
    }

    /// Add an authentication method
    pub fn add(
        &mut self,
        authenticator_type: AuthenticatorType,
        data: impl Into<Vec<u8>>,
    ) -> &mut Self {
        self.auth.config.push(AuthenticatorEntry {
            ty: authenticator_type,
            config: data.into(),
        });
        self
    }

    /// Finalizes the builder, constructing an [`Authenticator`]
    pub fn build(&self) -> Result<Authenticator> {
        self.try_into()
    }
}

impl TryFrom<AuthenticatorBuilder> for Authenticator {
    type Error = Error;
    fn try_from(builder: AuthenticatorBuilder) -> Result<Self> {
        builder.auth.check()?;
        Ok(builder.auth)
    }
}

impl TryFrom<&AuthenticatorBuilder> for Authenticator {
    type Error = Error;
    fn try_from(builder: &AuthenticatorBuilder) -> Result<Self> {
        builder.auth.check()?;
        Ok(builder.auth.clone())
    }
}
