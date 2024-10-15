mod support;
use anyhow::{Error, Result};
use dydx_v4_rust::config::ClientConfig;
#[cfg(feature = "noble")]
use dydx_v4_rust::noble::NobleClient;
use dydx_v4_rust::node::{NodeClient, Wallet};
use support::constants::TEST_MNEMONIC;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;

    // Create a `Wallet` from a mnemonic
    let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;

    // A `Wallet` is used to derive an `Account` used to sign transactions
    let account0 = wallet.account_offline(0)?;

    // Multiple accounts can be derived from your mnemonic/master private key
    let account1 = wallet.account_offline(1)?;

    // Some online attributes like an up-to-date sequence number are required for some
    // order/transfer methods in `NodeClient`'s operations.
    // This is usually not required if `NodeClient` is allowed to `manage_sequencing = true`.
    let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
    let mut client = NodeClient::connect(config.node).await?;
    let account_upd = wallet.account(0, &mut client).await?;

    // An `Account` is mostly identified by its `Address`
    let address = account0.address();
    tracing::info!(
        "Account '0' address: {address} | sequence-number: {} | account-number (online ID): {}",
        account0.sequence_number(),
        account0.account_number()
    );
    tracing::info!(
        "Account '0' (synced-values) address: {} | sequence-number: {} | account-number (online ID): {}",
        account_upd.address(), account_upd.sequence_number(), account_upd.account_number()
    );
    tracing::info!("Account '1' address: {}", account1.address());

    // dYdX uses the concept of "subaccounts" to help isolate funds and manage risk
    let subaccount00 = account0.subaccount(0)?;
    let subaccount01 = account0.subaccount(1)?;

    // Different subaccounts under the same account have the same address, being differentiated by
    // their subaccount number
    tracing::info!(
        "Account '0' subaccount '0': address {} | number {}",
        subaccount00.address,
        subaccount00.number
    );
    tracing::info!(
        "Account '0' subaccount '1': address {} | number {}",
        subaccount01.address,
        subaccount01.number
    );

    // Subaccounts 0..=127 are parent subaccounts. These subaccounts can have multiple positions
    // opened and all positions are cross-margined.
    // Subaccounts 128..=128000 are child subaccounts. These subaccounts can only have one position
    // open.
    tracing::info!(
        "Is subaccount '0' a parent subaccount? {:?}",
        subaccount00.is_parent()
    );
    tracing::info!(
        "The parent subaccount of the subaccount '256' is: {:?}",
        account0.subaccount(256)?.parent()
    );
    tracing::info!(
        "Is the parent of subaccount '256' equal to subaccount '0'? {:?}",
        account0.subaccount(256)?.parent() == subaccount00
    );

    #[cfg(feature = "noble")]
    {
        // To derive a Noble account (used to transfer USDC in and out of dYdX through Cosmos IBC)
        // the same wallet instance as before can be used
        let noble_account0 = wallet.noble().account_offline(0)?;
        tracing::info!(
            "Account '0' (Noble) address: {} | sequence-number: {}",
            noble_account0.address(),
            noble_account0.sequence_number()
        );

        // Noble accounts also use sequence numbers
        if let Some(noble_config) = config.noble {
            let mut noble = NobleClient::connect(noble_config).await?;
            let noble_account_upd = wallet.noble().account(0, &mut noble).await?;
            tracing::info!(
                "Account '0' (Noble, synced-values) address: {} | sequence-number: {}",
                noble_account_upd.address(),
                noble_account_upd.sequence_number()
            );
        } else {
            tracing::warn!("A [noble] configuration is required for some parts of this example.");
        }
    }

    Ok(())
}
