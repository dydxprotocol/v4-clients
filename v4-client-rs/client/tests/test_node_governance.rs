mod env;
use env::TestEnv;

use anyhow::Error;
use dydx::{indexer::Token, node::*};
use ibc_proto::cosmos::gov::v1::ProposalStatus;
use serial_test::serial;
use std::{collections::HashMap, str::FromStr};

const TEST_MNEMONIC_AFFILIATE: &str = "nasty crew bike steel fresh skate image blame patch actress sudden sound slab resource fault album gravity awesome joy public dose impulse draft price";

#[tokio::test]
#[serial]
async fn test_node_governance_delegate_undelegate() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let mut account = env.account;
    let token_amount = Token::DydxTnt(10.into());

    let validators = node.get_all_validators(None).await?;

    assert!(!validators.is_empty());

    // Check for undelegation requests
    let undelegations = node
        .get_delegator_unbonding_delegations(env.address.clone(), None)
        .await?;

    // Find validator with least amount of undelegations, to avoid max undelegation requests
    let mut validator_to_num_of_undelegations: HashMap<String, u64> = HashMap::new();

    validators.iter().for_each(|v| {
        validator_to_num_of_undelegations.insert(v.operator_address.clone(), 0);
    });

    undelegations
        .iter()
        .fold(&mut validator_to_num_of_undelegations, |acc, u| {
            *acc.entry(u.validator_address.clone()).or_insert(0) += 1;
            acc
        });

    // Could fail if all validators exceed max undelegation requests
    let validator_with_least_undelegations = validator_to_num_of_undelegations
        .iter()
        .min_by_key(|(_, v)| *v)
        .unwrap()
        .0;
    let validator_address = Address::from_str(validator_with_least_undelegations).unwrap();

    // Delegation
    let tx_res = node
        .governance()
        .delegate(
            &mut account,
            env.address.clone(),
            validator_address.clone(),
            token_amount.clone(),
        )
        .await;

    node.query_transaction_result(tx_res).await?;

    // Undelegation
    let tx_res = node
        .governance()
        .undelegate(
            &mut account,
            env.address.clone(),
            validator_address.clone(),
            token_amount.clone(),
        )
        .await;

    node.query_transaction_result(tx_res).await?;

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_governance_withdraw_delegator_reward() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let mut account = env.account;

    let validators = node.get_all_validators(None).await?;

    assert!(!validators.is_empty());

    let validator: &ibc_proto::cosmos::staking::v1beta1::Validator = validators.first().unwrap();

    let validator_address = Address::from_str(&validator.operator_address).unwrap();

    let tx_res = node
        .governance()
        .withdraw_delegator_reward(&mut account, env.address.clone(), validator_address)
        .await;

    node.query_transaction_result(tx_res).await?;

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_governance_register_affiliate() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;
    let mut account = env.account;

    let wallet = Wallet::from_mnemonic(TEST_MNEMONIC_AFFILIATE)?;
    let affiliate_account = wallet.account_offline(0)?;
    let affiliate_address = affiliate_account.address();

    let tx_res = node
        .governance()
        .register_affiliate(&mut account, env.address.clone(), affiliate_address.clone())
        .await;

    // Using the same account should fail
    let err = node.query_transaction_result(tx_res).await.unwrap_err();
    assert_eq!(
        err.to_string(),
        format!(
            "Broadcast error: Broadcast error None with log: \
                failed to execute message; message index: 0: \
                referee: {}, \
                affiliate: {}: \
                Affiliate already exists for referee \
                [dydxprotocol/v4-chain/protocol/x/affiliates/keeper/keeper.go:77] \
                with gas used: '32783'",
            env.address, affiliate_address,
        )
    );

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_governance_get_all_gov_proposals() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;

    let _proposals = node
        .governance()
        .get_all_gov_proposals(
            ProposalStatus::Passed,
            env.address.clone(),
            env.address.clone(),
            None,
        )
        .await?;

    Ok(())
}

#[tokio::test]
#[serial]
async fn test_node_governance_get_delegation_total_rewards() -> Result<(), Error> {
    let env = TestEnv::testnet().await?;
    let mut node = env.node;

    let _rewards = node
        .governance()
        .get_delegation_total_rewards(env.address.clone())
        .await?;

    Ok(())
}
