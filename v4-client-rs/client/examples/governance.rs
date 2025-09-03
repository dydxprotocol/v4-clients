mod support;
use anyhow::{Error, Result};
use dydx::config::ClientConfig;
use dydx::indexer::Token;
use dydx::node::{Address, NodeClient, Wallet};
use ibc_proto::cosmos::gov::v1::ProposalStatus;
use std::{collections::HashMap, str::FromStr};
use support::constants::TEST_MNEMONIC;

const TEST_MNEMONIC_AFFILIATE: &str = "nasty crew bike steel fresh skate image blame patch actress sudden sound slab resource fault album gravity awesome joy public dose impulse draft price";

pub struct GovernanceExample {
    node: NodeClient,
    wallet: Wallet,
}

impl GovernanceExample {
    pub async fn connect() -> Result<Self> {
        let config = ClientConfig::from_file("client/tests/testnet.toml").await?;
        let node = NodeClient::connect(config.node).await?;
        let wallet = Wallet::from_mnemonic(TEST_MNEMONIC)?;
        Ok(Self { node, wallet })
    }

    pub async fn run_governance_examples(&mut self) -> Result<()> {
        let mut account = self.wallet.account(0, &mut self.node).await?;
        let address = account.address().clone();

        // Example 1: Get governance proposals
        tracing::info!("=== Getting governance proposals ===");
        let proposals = self
            .node
            .governance()
            .get_all_gov_proposals(
                ProposalStatus::Passed,
                address.clone(),
                address.clone(),
                None,
            )
            .await?;
        tracing::info!("Found {} governance proposals", proposals.len());

        // Example 2: Get validators and delegation info
        tracing::info!("=== Getting validators and delegation info ===");
        let validators = self.node.get_all_validators(None).await?;
        tracing::info!("Found {} validators", validators.len());

        if !validators.is_empty() {
            let validator = validators.first().unwrap();
            tracing::info!(
                "First validator: {} ({})",
                validator
                    .description
                    .as_ref()
                    .map(|d| &d.moniker)
                    .unwrap_or(&"Unknown".to_string()),
                validator.operator_address
            );

            // Get current delegations
            let delegations = self
                .node
                .get_delegator_delegations(address.clone(), None)
                .await?;
            tracing::info!("Current delegations: {}", delegations.len());

            // Get unbonding delegations
            let unbonding_delegations = self
                .node
                .get_delegator_unbonding_delegations(address.clone(), None)
                .await?;
            tracing::info!(
                "Current unbonding delegations: {}",
                unbonding_delegations.len()
            );
        }

        // Example 3: Delegate and undelegate (small amount for demo)
        if !validators.is_empty() {
            let validator_with_least_undelegations = self
                .find_validator_with_least_undelegations(&validators, &address)
                .await?;

            if let Some(validator_address) = validator_with_least_undelegations {
                tracing::info!("=== Delegation example ===");
                let token_amount = Token::DydxTnt(1.into()); // Small amount for demo

                tracing::info!("Delegating 1 DYDX to validator: {}", validator_address);

                // Delegate
                let tx_res = self
                    .node
                    .governance()
                    .delegate(
                        &mut account,
                        address.clone(),
                        validator_address.clone(),
                        token_amount.clone(),
                    )
                    .await;

                match &tx_res {
                    Ok(tx_hash) => {
                        tracing::info!("Delegation submitted - tx hash: {}", tx_hash);
                        match self.node.query_transaction_result(tx_res).await {
                            Ok(_) => tracing::info!("Delegation confirmed"),
                            Err(e) => {
                                tracing::warn!("Delegation failed during confirmation: {}", e)
                            }
                        }
                    }
                    Err(e) => tracing::warn!("Delegation failed: {}", e),
                }

                // Undelegate
                tracing::info!("Undelegating 1 DYDX from validator: {}", validator_address);
                let tx_res = self
                    .node
                    .governance()
                    .undelegate(
                        &mut account,
                        address.clone(),
                        validator_address.clone(),
                        token_amount.clone(),
                    )
                    .await;

                match &tx_res {
                    Ok(tx_hash) => {
                        tracing::info!("Undelegation submitted - tx hash: {}", tx_hash);
                        match self.node.query_transaction_result(tx_res).await {
                            Ok(_) => tracing::info!("Undelegation confirmed"),
                            Err(e) => {
                                tracing::warn!("Undelegation failed during confirmation: {}", e)
                            }
                        }
                    }
                    Err(e) => tracing::warn!("Undelegation failed: {}", e),
                }
            }
        }

        // Example 4: Withdraw delegation rewards
        if !validators.is_empty() {
            tracing::info!("=== Withdraw delegation rewards example ===");
            let validator = validators.first().unwrap();
            let validator_address = Address::from_str(&validator.operator_address)?;

            let tx_res = self
                .node
                .governance()
                .withdraw_delegator_reward(&mut account, address.clone(), validator_address)
                .await;

            match &tx_res {
                Ok(tx_hash) => {
                    tracing::info!("Reward withdrawal submitted - tx hash: {}", tx_hash);
                    match self.node.query_transaction_result(tx_res).await {
                        Ok(_) => tracing::info!("Reward withdrawal confirmed"),
                        Err(e) => {
                            tracing::warn!("Reward withdrawal failed during confirmation: {}", e)
                        }
                    }
                }
                Err(e) => tracing::warn!("Reward withdrawal failed: {}", e),
            }
        }

        // Example 5: Register affiliate (will likely fail if already registered)
        tracing::info!("=== Register affiliate example ===");
        let affiliate_wallet = Wallet::from_mnemonic(TEST_MNEMONIC_AFFILIATE)?;
        let affiliate_account = affiliate_wallet.account_offline(0)?;
        let affiliate_address = affiliate_account.address();

        let tx_res = self
            .node
            .governance()
            .register_affiliate(&mut account, address.clone(), affiliate_address.clone())
            .await;

        match &tx_res {
            Ok(tx_hash) => {
                tracing::info!("Affiliate registration submitted - tx hash: {}", tx_hash);
                match self.node.query_transaction_result(tx_res).await {
                    Ok(_) => tracing::info!("Affiliate registration confirmed"),
                    Err(e) => {
                        tracing::warn!("Affiliate registration failed during confirmation: {}", e)
                    }
                }
            }
            Err(e) => {
                if e.to_string().contains("Affiliate already exists") {
                    tracing::info!("Affiliate already registered (expected)");
                } else {
                    tracing::warn!("Affiliate registration failed: {}", e);
                }
            }
        }

        tracing::info!("=== Governance examples completed ===");
        Ok(())
    }

    async fn find_validator_with_least_undelegations(
        &mut self,
        validators: &[ibc_proto::cosmos::staking::v1beta1::Validator],
        address: &Address,
    ) -> Result<Option<Address>> {
        // Get undelegation requests
        let undelegations = self
            .node
            .get_delegator_unbonding_delegations(address.clone(), None)
            .await?;

        // Count undelegations per validator
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

        // Find validator with least undelegations
        if let Some((validator_addr_str, _)) = validator_to_num_of_undelegations
            .iter()
            .min_by_key(|(_, v)| *v)
        {
            Ok(Some(Address::from_str(validator_addr_str)?))
        } else {
            Ok(None)
        }
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().try_init().map_err(Error::msg)?;

    let mut governance_example = GovernanceExample::connect().await?;
    governance_example.run_governance_examples().await?;

    Ok(())
}
