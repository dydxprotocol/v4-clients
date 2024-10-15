mod support;
use anyhow::{Error, Result};
use dydx_v4_rust::config::ClientConfig;
use dydx_v4_rust::node::{NodeClient, Wallet};
use std::iter::once;
use support::constants::TEST_MNEMONIC;
use v4_proto_rs::{
    dydxprotocol::{sending::MsgWithdrawFromSubaccount, subaccounts::SubaccountId},
    ToAny,
};

pub struct Transferor {
    client: NodeClient,
    wallet: Wallet,
}

impl Transferor {
    pub async fn connect() -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let client = NodeClient::connect(config.node).await?;
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        Ok(Self { client, wallet })
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;
    let mut transferor = Transferor::connect().await?;
    let account = transferor.wallet.account(0, &mut transferor.client).await?;
    let mut client = transferor.client;

    let amount = 1_u64;

    let recipient = account.address().clone();
    let sender = SubaccountId {
        owner: recipient.to_string(),
        number: 0,
    };

    // Simulate transaction
    let msg = MsgWithdrawFromSubaccount {
        sender: Some(sender.clone()),
        recipient: recipient.to_string(),
        asset_id: 0,
        quantums: amount,
    }
    .to_any();
    let simulated_tx = client
        .builder
        .build_transaction(&account, once(msg), None)?;
    let simulation = client.simulate(&simulated_tx).await?;
    tracing::info!("Simulation: {:?}", simulation);

    let fee = client.builder.calculate_fee(Some(simulation.gas_used))?;
    tracing::info!("Total fee: {:?}", fee);

    let fee_amount: u64 = fee.amount[0].amount.try_into()?;

    // Issue transaction
    let final_msg = MsgWithdrawFromSubaccount {
        sender: Some(sender),
        recipient: recipient.into(),
        asset_id: 0,
        quantums: amount - fee_amount,
    }
    .to_any();
    let final_tx = client
        .builder
        .build_transaction(&account, once(final_msg), Some(fee))?;
    let tx_hash = client.broadcast_transaction(final_tx).await?;
    tracing::info!("Withdraw transaction hash: {:?}", tx_hash);

    Ok(())
}
