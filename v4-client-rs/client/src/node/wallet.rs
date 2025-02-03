use super::client::NodeClient;
use super::sequencer::Nonce;
use crate::indexer::{Address, Subaccount};
use anyhow::{anyhow as err, Error};
use bip32::{DerivationPath, Language, Mnemonic, Seed};
use cosmrs::{
    crypto::{secp256k1::SigningKey, PublicKey},
    tx, AccountId,
};
use delegate::delegate;
use std::{
    collections::HashMap,
    hash::{Hash, Hasher},
    str::FromStr,
};

/// account prefix https://docs.cosmos.network/main/learn/beginner/accounts
const BECH32_PREFIX_DYDX: &str = "dydx";

/// Hierarchical Deterministic (HD) [wallet](https://dydx.exchange/crypto-learning/glossary?#wallet)
/// which allows to have multiple addresses and signing keys from one master seed.
///
/// [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) introduced a wallet standard to derive multiple accounts
/// for different chains from a single seed (which allows to recover the whole tree of keys).
/// This `Wallet` hardcodes Cosmos ATOM token so it can derive multiple addresses from their corresponding indices.
///
/// See also [Mastering Bitcoin](https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch05_wallets.adoc).
pub struct Wallet {
    seed: Seed,
}

impl Wallet {
    /// Derive a seed from a 24-words English mnemonic phrase.
    pub fn from_mnemonic(mnemonic: &str) -> Result<Self, Error> {
        let seed = Mnemonic::new(mnemonic, Language::English)?.to_seed("");
        Ok(Self { seed })
    }

    /// Derive a dYdX account with updated account and sequence numbers.
    pub async fn account(&self, index: u32, client: &mut NodeClient) -> Result<Account, Error> {
        let mut account = self.account_offline(index)?;
        (
            account.public.account_number,
            account.public.sequence_number,
        ) = client.query_address(account.address()).await?;
        Ok(account)
    }

    /// Derive a dYdX account with zero'ed account and sequence numbers.
    pub fn account_offline(&self, index: u32) -> Result<Account, Error> {
        self.derive_account(index, BECH32_PREFIX_DYDX)
    }

    #[cfg(feature = "noble")]
    /// Noble-specific `Wallet` operations.
    pub fn noble(&self) -> noble::WalletOps<'_> {
        noble::WalletOps::new(self)
    }

    fn derive_account(&self, index: u32, prefix: &str) -> Result<Account, Error> {
        // https://github.com/satoshilabs/slips/blob/master/slip-0044.md
        let derivation_str = format!("m/44'/118'/0'/0/{index}");
        let derivation_path = DerivationPath::from_str(&derivation_str)?;
        let private_key = SigningKey::derive_from_path(&self.seed, &derivation_path)?;
        let public_key = private_key.public_key();
        let account_id = public_key.account_id(prefix).map_err(Error::msg)?;
        let address = account_id.to_string().parse()?;
        Ok(Account {
            public: PublicAccount {
                address,
                account_number: 0,
                sequence_number: 0,
                next_nonce: None,
            },
            account_id,
            index,
            key: private_key,
            auth: AuthManager::default(),
        })
    }
}

/// Represents a derived account.
///
/// See also [`Wallet`].
pub struct Account {
    index: u32,
    // The `String` representation of the `AccountId`
    key: SigningKey,
    // The `String` representation of the `AccountId`
    #[allow(dead_code)]
    account_id: AccountId,
    /// List of accounts/IDs which authorize this account.
    auth: AuthManager,
    // Self public data
    public: PublicAccount,
}

/// Represents an account with only publicly-available data.
/// Also provides methods to be used as an authenticator account.
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PublicAccount {
    address: Address,
    // Online attributes
    account_number: u64,
    sequence_number: u64,
    next_nonce: Option<Nonce>,
}

/// Manages authentication relationships for an account.
#[derive(Clone, Debug, Default)]
pub struct AuthManager {
    // Optimally the key would be a PublicAccount, however it may need to be mutable
    auths: HashMap<Address, (PublicAccount, Vec<u64>)>,
}

impl Account {
    /// An index of the derived account.
    pub fn index(&self) -> &u32 {
        &self.index
    }

    /// A public key associated with the account.
    pub fn public_key(&self) -> PublicKey {
        self.key.public_key()
    }

    /// Sign [`SignDoc`](tx::SignDoc) with a corresponding private key.
    pub fn sign(&self, doc: tx::SignDoc) -> Result<tx::Raw, Error> {
        doc.sign(&self.key)
            .map_err(|e| err!("Failure to sign doc: {e}"))
    }

    /// Access the authenticators manager
    pub fn auth(&self) -> &AuthManager {
        &self.auth
    }

    /// Access the authenticators manager as mut
    pub fn auth_mut(&mut self) -> &mut AuthManager {
        &mut self.auth
    }

    /// Non-mutable access to public parameters
    pub fn public(&self) -> &PublicAccount {
        self.public.sequence_number;
        &self.public
    }

    delegate! {
        to self.public {
            /// An address of the account.
            pub fn address(&self) -> &Address;
            /// A subaccount from a corresponding index.
            pub fn subaccount(&self, number: u32) -> Result<Subaccount, Error>;
            /// The account number.
            pub fn account_number(&self) -> u64;
            /// The account sequence number.
            pub fn sequence_number(&self) -> u64;
            /// Set a new sequence number.
            pub fn set_sequence_number(&mut self, sequence_number: u64);
            /// Gets the [`Nonce`] to be used in the next transaction.
            pub fn next_nonce(&self) -> Option<&Nonce>;
            /// Set the [`Nonce`] to be used in the next transaction.
            pub fn set_next_nonce(&mut self, nonce: Nonce);
        }
    }
}

impl PublicAccount {
    /// Creates an updated public account using its address.
    pub async fn updated(address: Address, client: &mut NodeClient) -> Result<Self, Error> {
        let mut account = PublicAccount::new(address);
        account.update(client).await?;
        Ok(account)
    }

    /// Creates a public account from its address.
    /// Online attributes are zero'ed.
    pub fn new(address: Address) -> Self {
        Self {
            address,
            account_number: 0,
            sequence_number: 0,
            next_nonce: None,
        }
    }

    /// Sets the account and sequencer numbers using online data.
    pub async fn update(&mut self, client: &mut NodeClient) -> Result<(), Error> {
        (self.account_number, self.sequence_number) = client.query_address(self.address()).await?;
        Ok(())
    }

    ///// Creates a public account using its address
    //pub async fn from_address(address: Address, client: &mut NodeClient) -> Result<Self, Error> {
    //    let prefix = BECH32_PREFIX_DYDX;
    //    let account_id = key.account_id(prefix).map_err(Error::msg)?;
    //    let address: Address = account_id.to_string().parse()?;
    //    let (account_number, sequence_number) =
    //        client.query_address(&address).await?;
    //    Ok(
    //        Self {
    //            key,
    //            account_id,
    //            address,
    //            account_number,
    //            sequence_number,
    //            next_nonce: None,
    //        }
    //    )
    //}

    /// An address of the account.
    pub fn address(&self) -> &Address {
        &self.address
    }

    /// A subaccount from a corresponding index.
    pub fn subaccount(&self, number: u32) -> Result<Subaccount, Error> {
        Ok(Subaccount::new(self.address.clone(), number.try_into()?))
    }

    /// The account number.
    pub fn account_number(&self) -> u64 {
        self.account_number
    }

    /// The account sequence number.
    pub fn sequence_number(&self) -> u64 {
        self.sequence_number
    }

    /// Set a new sequence number.
    pub fn set_sequence_number(&mut self, sequence_number: u64) {
        self.sequence_number = sequence_number;
    }

    /// Gets the [`Nonce`] to be used in the next transaction.
    pub fn next_nonce(&self) -> Option<&Nonce> {
        self.next_nonce.as_ref()
    }

    /// Set the [`Nonce`] to be used in the next transaction.
    pub fn set_next_nonce(&mut self, nonce: Nonce) {
        if let Nonce::Sequence(number) = nonce {
            self.sequence_number = number
        }
        self.next_nonce = Some(nonce);
    }
}

impl AuthManager {
    /// Get the list of IDs associated with an authorizing account.
    pub fn get(&self, authing: &Address) -> Option<&(PublicAccount, Vec<u64>)> {
        self.auths.get(authing)
    }

    /// Get the mutable list of IDs associated with an authorizing account.
    pub fn get_mut(&mut self, authing: &Address) -> Option<&mut (PublicAccount, Vec<u64>)> {
        self.auths.get_mut(authing)
    }

    /// Add an ID for a specific authenticator.
    pub fn add(&mut self, auth: PublicAccount, id: u64) {
        if let Some(ids) = self.auths.get_mut(auth.address()) {
            ids.1.push(id);
        } else {
            self.auths.insert(auth.address(), (auth, vec![id]));
        }
    }

    /// Remove an authenticator and all its IDs.
    pub fn remove(&mut self, authing: &Address) -> Option<(PublicAccount, Vec<u64>)> {
        self.auths.remove(authing)
    }
}

impl Hash for PublicAccount {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.address.hash(state);
    }
}

impl From<Address> for PublicAccount {
    fn from(address: Address) -> Self {
        PublicAccount::new(address)
    }
}

#[cfg(feature = "noble")]
mod noble {
    use super::*;
    use crate::noble::NobleClient;

    const BECH32_PREFIX_NOBLE: &str = "noble";

    /// Noble-specific wallet operations
    pub struct WalletOps<'w> {
        wallet: &'w Wallet,
    }

    impl<'w> WalletOps<'w> {
        /// Create a new Noble-specific wallet operations dispatcher.
        pub fn new(wallet: &'w Wallet) -> Self {
            Self { wallet }
        }

        /// Derive a Noble account with updated account and sequence numbers.
        pub async fn account(
            &self,
            index: u32,
            client: &mut NobleClient,
        ) -> Result<Account, Error> {
            let mut account = self.account_offline(index)?;
            (
                account.public.account_number,
                account.public.sequence_number,
            ) = client.query_address(account.address()).await?;
            Ok(account)
        }

        /// Derive a Noble account with zero'ed account and sequence numbers.
        pub fn account_offline(&self, index: u32) -> Result<Account, Error> {
            self.wallet.derive_account(index, BECH32_PREFIX_NOBLE)
        }
    }
}
