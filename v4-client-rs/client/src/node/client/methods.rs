use super::{Address, NodeClient};
use crate::indexer::{Denom, Height, Subaccount};
use anyhow::{anyhow as err, Error};
use v4_proto_rs::{
    cosmos::base::query::v1beta1::PageRequest as V4PageRequest,
    cosmos_sdk_proto::cosmos::{
        auth::v1beta1::{BaseAccount, QueryAccountRequest},
        bank::v1beta1::{QueryAllBalancesRequest, QueryBalanceRequest},
        base::{
            query::v1beta1::PageRequest as CosmosPageRequest,
            tendermint::v1beta1::{
                Block, GetLatestBlockRequest, GetNodeInfoRequest, GetNodeInfoResponse,
            },
            v1beta1::Coin,
        },
        staking::v1beta1::{
            DelegationResponse, QueryDelegatorDelegationsRequest,
            QueryDelegatorUnbondingDelegationsRequest, QueryValidatorsRequest, UnbondingDelegation,
            Validator,
        },
    },
    dydxprotocol::{
        bridge::{DelayedCompleteBridgeMessage, QueryDelayedCompleteBridgeMessagesRequest},
        clob::{
            ClobPair, EquityTierLimitConfiguration, QueryAllClobPairRequest,
            QueryEquityTierLimitConfigurationRequest, QueryGetClobPairRequest,
        },
        feetiers::{PerpetualFeeTier, QueryPerpetualFeeParamsRequest, QueryUserFeeTierRequest},
        perpetuals::{Perpetual, QueryAllPerpetualsRequest, QueryPerpetualRequest},
        prices::{MarketPrice, QueryAllMarketPricesRequest, QueryMarketPriceRequest},
        rewards,
        stats::{QueryUserStatsRequest, UserStats},
        subaccounts::{
            QueryAllSubaccountRequest, QueryGetSubaccountRequest, Subaccount as SubaccountInfo,
        },
    },
};

impl NodeClient {
    /// Query for [account balances](https://github.com/cosmos/cosmos-sdk/tree/main/x/bank#allbalances)
    /// by address for all denominations.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_account_balances(&mut self, address: &Address) -> Result<Vec<Coin>, Error> {
        let req = QueryAllBalancesRequest {
            address: address.to_string(),
            pagination: None,
        };
        let balances = self.bank.all_balances(req).await?.into_inner().balances;
        Ok(balances)
    }

    /// Query for account [balance](https://github.com/cosmos/cosmos-sdk/tree/main/x/bank#balance)
    /// by address for a given denomination.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_account_balance(
        &mut self,
        address: &Address,
        denom: &Denom,
    ) -> Result<Coin, Error> {
        let req = QueryBalanceRequest {
            address: address.to_string(),
            denom: denom.to_string(),
        };
        let balance = self
            .bank
            .balance(req)
            .await?
            .into_inner()
            .balance
            .ok_or_else(|| err!("Balance query response does not contain balance"))?;
        Ok(balance)
    }

    /// Query for [an account](https://github.com/cosmos/cosmos-sdk/tree/main/x/auth#account-1)
    /// by it's address.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_account(&mut self, address: &Address) -> Result<BaseAccount, Error> {
        let req = QueryAccountRequest {
            address: address.to_string(),
        };
        let resp = self
            .auth
            .account(req)
            .await?
            .into_inner()
            .account
            .ok_or_else(|| err!("Query account request failure, account should exist."))?
            .to_msg()?;
        Ok(resp)
    }

    /// Query for node info.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_node_info(&mut self) -> Result<GetNodeInfoResponse, Error> {
        let req = GetNodeInfoRequest {};
        let info = self.base.get_node_info(req).await?.into_inner();
        Ok(info)
    }

    /// Query for the latest block.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_latest_block(&mut self) -> Result<Block, Error> {
        let req = GetLatestBlockRequest::default();
        let latest_block = self
            .base
            .get_latest_block(req)
            .await?
            .into_inner()
            .sdk_block
            .ok_or_else(|| err!("The latest block is empty"))?;
        Ok(latest_block)
    }

    /// Query for the latest block height.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_latest_block_height(&mut self) -> Result<Height, Error> {
        let latest_block = self.get_latest_block().await?;
        let header = latest_block
            .header
            .ok_or_else(|| err!("The block doesn't contain a header"))?;
        let height = Height(header.height.try_into()?);
        Ok(height)
    }

    /// Query for user stats (Maker and Taker positions).
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_user_stats(&mut self, address: &Address) -> Result<UserStats, Error> {
        let req = QueryUserStatsRequest {
            user: address.to_string(),
        };
        let stats = self
            .stats
            .user_stats(req)
            .await?
            .into_inner()
            .stats
            .ok_or_else(|| err!("User stats query response does not contain stats"))?;
        Ok(stats)
    }

    /// Query for [all validators](https://github.com/cosmos/cosmos-sdk/tree/main/x/staking#validators-2)
    /// that match the given status.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_all_validators(
        &mut self,
        status: Option<String>,
    ) -> Result<Vec<Validator>, Error> {
        let req = QueryValidatorsRequest {
            status: status.unwrap_or_default(),
            pagination: None,
        };
        let validators = self.staking.validators(req).await?.into_inner().validators;
        Ok(validators)
    }

    /// Query for all subacccounts.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_subaccounts(&mut self) -> Result<Vec<SubaccountInfo>, Error> {
        let req = QueryAllSubaccountRequest { pagination: None };
        let subaccounts = self
            .subaccounts
            .subaccount_all(req)
            .await?
            .into_inner()
            .subaccount;
        Ok(subaccounts)
    }

    /// Query for the subacccount.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_subaccount(
        &mut self,
        subaccount: &Subaccount,
    ) -> Result<SubaccountInfo, Error> {
        let req = QueryGetSubaccountRequest {
            owner: subaccount.address.to_string(),
            number: subaccount.number.0,
        };
        let subaccount = self
            .subaccounts
            .subaccount(req)
            .await?
            .into_inner()
            .subaccount
            .ok_or_else(|| err!("Subaccount query response does not contain subaccount info"))?;
        Ok(subaccount)
    }

    /// Query for the orderbook pair by its id.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_clob_pair(&mut self, pair_id: u32) -> Result<ClobPair, Error> {
        let req = QueryGetClobPairRequest { id: pair_id };
        let clob_pair = self
            .clob
            .clob_pair(req)
            .await?
            .into_inner()
            .clob_pair
            .ok_or_else(|| err!("Clob pair {pair_id} query response does not contain clob pair"))?;
        Ok(clob_pair)
    }

    /// Query for all orderbook pairs.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_clob_pairs(
        &mut self,
        pagination: Option<V4PageRequest>,
    ) -> Result<Vec<ClobPair>, Error> {
        let req = QueryAllClobPairRequest { pagination };
        let clob_pairs = self.clob.clob_pair_all(req).await?.into_inner().clob_pair;
        Ok(clob_pairs)
    }

    /// Query for the market price.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_price(&mut self, market_id: u32) -> Result<MarketPrice, Error> {
        let req = QueryMarketPriceRequest { id: market_id };
        let price = self
            .prices
            .market_price(req)
            .await?
            .into_inner()
            .market_price
            .ok_or_else(|| {
                err!("Market {market_id} price query response does not contain price")
            })?;
        Ok(price)
    }

    /// Query for all markets prices.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_prices(
        &mut self,
        pagination: Option<V4PageRequest>,
    ) -> Result<Vec<MarketPrice>, Error> {
        let req = QueryAllMarketPricesRequest { pagination };
        let prices = self
            .prices
            .all_market_prices(req)
            .await?
            .into_inner()
            .market_prices;
        Ok(prices)
    }

    /// Query for the perpetual.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_perpetual(&mut self, perpetual_id: u32) -> Result<Perpetual, Error> {
        let req = QueryPerpetualRequest { id: perpetual_id };
        let perpetual = self
            .perpetuals
            .perpetual(req)
            .await?
            .into_inner()
            .perpetual
            .ok_or_else(|| {
                err!("Perpetual {perpetual_id} query response does not contain perpetual")
            })?;
        Ok(perpetual)
    }

    /// Query for all perpetuals.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_perpetuals(
        &mut self,
        pagination: Option<V4PageRequest>,
    ) -> Result<Vec<Perpetual>, Error> {
        let req = QueryAllPerpetualsRequest { pagination };
        let perpetuals = self
            .perpetuals
            .all_perpetuals(req)
            .await?
            .into_inner()
            .perpetual;
        Ok(perpetuals)
    }

    /// Query for [`EquityTierLimitConfiguration`].
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_equity_tier_limit_config(
        &mut self,
    ) -> Result<EquityTierLimitConfiguration, Error> {
        let req = QueryEquityTierLimitConfigurationRequest {};
        let etlc = self
            .clob
            .equity_tier_limit_configuration(req)
            .await?
            .into_inner()
            .equity_tier_limit_config
            .ok_or_else(|| {
                err!("Equity tier limit config query response does not contain config")
            })?;
        Ok(etlc)
    }

    /// Query for [all delegations](https://github.com/cosmos/cosmos-sdk/tree/main/x/staking#delegatordelegations)
    /// of a given delegator address.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_delegator_delegations(
        &mut self,
        delegator_address: Address,
        pagination: Option<CosmosPageRequest>,
    ) -> Result<Vec<DelegationResponse>, Error> {
        let req = QueryDelegatorDelegationsRequest {
            delegator_addr: delegator_address.to_string(),
            pagination,
        };
        let delegations = self
            .staking
            .delegator_delegations(req)
            .await?
            .into_inner()
            .delegation_responses;
        Ok(delegations)
    }

    /// Query for [all unbonding delegations](https://github.com/cosmos/cosmos-sdk/tree/main/x/staking#delegatorunbondingdelegations)
    /// of a given delegator address.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_delegator_unbonding_delegations(
        &mut self,
        delegator_address: Address,
        pagination: Option<CosmosPageRequest>,
    ) -> Result<Vec<UnbondingDelegation>, Error> {
        let req = QueryDelegatorUnbondingDelegationsRequest {
            delegator_addr: delegator_address.to_string(),
            pagination,
        };
        let responses = self
            .staking
            .delegator_unbonding_delegations(req)
            .await?
            .into_inner()
            .unbonding_responses;
        Ok(responses)
    }

    /// Query for delayed bridge messages for the address.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_delayed_complete_bridge_messages(
        &mut self,
        address: Address,
    ) -> Result<Vec<DelayedCompleteBridgeMessage>, Error> {
        let req = QueryDelayedCompleteBridgeMessagesRequest {
            address: address.to_string(),
        };
        let messages = self
            .bridge
            .delayed_complete_bridge_messages(req)
            .await?
            .into_inner()
            .messages;
        Ok(messages)
    }

    /// Query for fee tiers for perpetuals.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_fee_tiers(&mut self) -> Result<Vec<PerpetualFeeTier>, Error> {
        let req = QueryPerpetualFeeParamsRequest {};
        let tiers = self
            .feetiers
            .perpetual_fee_params(req)
            .await?
            .into_inner()
            .params
            .ok_or_else(|| err!("Fee tiers query response does not contain params"))?
            .tiers;
        Ok(tiers)
    }

    /// Query for perpetual fee tier for the address.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_user_fee_tier(&mut self, address: Address) -> Result<PerpetualFeeTier, Error> {
        let req = QueryUserFeeTierRequest {
            user: address.to_string(),
        };
        let tier = self
            .feetiers
            .user_fee_tier(req)
            .await?
            .into_inner()
            .tier
            .ok_or_else(|| err!("User fee tier query response does not contain tier"))?;
        Ok(tier)
    }

    /// Query for rewards params.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/validator_get.rs).
    pub async fn get_rewards_params(&mut self) -> Result<rewards::Params, Error> {
        let req = rewards::QueryParamsRequest {};
        let params = self
            .rewards
            .params(req)
            .await?
            .into_inner()
            .params
            .ok_or_else(|| err!("Rewards query response does not contain params"))?;
        Ok(params)
    }
}
