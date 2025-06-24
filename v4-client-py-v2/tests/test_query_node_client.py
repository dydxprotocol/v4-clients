import pytest
from v4_proto.cosmos.auth.v1beta1.auth_pb2 import BaseAccount
from v4_proto.cosmos.bank.v1beta1 import query_pb2 as bank_query
from v4_proto.cosmos.base.tendermint.v1beta1.query_pb2 import GetLatestBlockResponse
from v4_proto.cosmos.base.v1beta1.coin_pb2 import Coin
from v4_proto.cosmos.staking.v1beta1.query_pb2 import (
    QueryDelegatorDelegationsResponse,
    QueryDelegatorUnbondingDelegationsResponse,
    QueryValidatorsResponse,
)
from v4_proto.dydxprotocol.bridge.query_pb2 import (
    QueryDelayedCompleteBridgeMessagesResponse,
)
from v4_proto.dydxprotocol.clob.clob_pair_pb2 import ClobPair
from v4_proto.dydxprotocol.clob.equity_tier_limit_config_pb2 import (
    EquityTierLimitConfiguration,
)
from v4_proto.dydxprotocol.clob.query_pb2 import QueryClobPairAllResponse
from v4_proto.dydxprotocol.feetiers.query_pb2 import (
    QueryPerpetualFeeParamsResponse,
    QueryUserFeeTierResponse,
)
from v4_proto.dydxprotocol.perpetuals.query_pb2 import (
    QueryAllPerpetualsResponse,
    QueryPerpetualResponse,
)
from v4_proto.dydxprotocol.prices.market_price_pb2 import MarketPrice
from v4_proto.dydxprotocol.prices.query_pb2 import QueryAllMarketPricesResponse
from v4_proto.dydxprotocol.rewards.query_pb2 import QueryParamsResponse
from v4_proto.dydxprotocol.stats.query_pb2 import QueryUserStatsResponse
from v4_proto.dydxprotocol.subaccounts.query_pb2 import QuerySubaccountAllResponse
from v4_proto.dydxprotocol.subaccounts.subaccount_pb2 import Subaccount
from v4_proto.cosmos.base.tendermint.v1beta1 import query_pb2 as tendermint_query
from v4_proto.cosmos.distribution.v1beta1 import query_pb2 as distribution_query
from v4_proto.cosmos.gov.v1 import query_pb2 as gov_query
from v4_proto.dydxprotocol.subaccounts import query_pb2 as subaccount_query
from v4_proto.dydxprotocol.ratelimit import query_pb2 as rate_query
from v4_proto.dydxprotocol.affiliates import query_pb2 as affiliate_query
from tests.conftest import TEST_ADDRESS


@pytest.mark.asyncio
async def test_get_account_balances(node_client, test_address):
    result = await node_client.get_account_balances(test_address)
    assert type(result) == bank_query.QueryAllBalancesResponse


@pytest.mark.asyncio
async def test_get_account(node_client, test_address):
    account = await node_client.get_account(test_address)
    assert isinstance(account, BaseAccount)


@pytest.mark.asyncio
async def test_get_account_balances(node_client, test_address):
    response = await node_client.get_account_balances(test_address)
    assert isinstance(response, bank_query.QueryAllBalancesResponse)
    assert all(isinstance(balance, Coin) for balance in response.balances)


@pytest.mark.asyncio
async def test_get_account_balance(node_client, test_address):
    response = await node_client.get_account_balance(test_address, "usdc")
    assert isinstance(response, bank_query.QueryBalanceResponse)
    assert response.balance.denom == "usdc"
    assert isinstance(response.balance.amount, str)


@pytest.mark.asyncio
async def test_latest_block(node_client):
    block = await node_client.latest_block()
    assert isinstance(block, GetLatestBlockResponse)


@pytest.mark.asyncio
async def test_latest_block_height(node_client):
    height = await node_client.latest_block_height()
    assert isinstance(height, int)
    assert height > 0


@pytest.mark.asyncio
async def test_get_user_stats(node_client, test_address):
    stats = await node_client.get_user_stats(test_address)
    assert isinstance(stats, QueryUserStatsResponse)


@pytest.mark.asyncio
async def test_get_all_validators(node_client):
    validators = await node_client.get_all_validators()
    assert isinstance(validators, QueryValidatorsResponse)


@pytest.mark.asyncio
async def test_get_subaccount(node_client, test_address):
    subaccount = await node_client.get_subaccount(test_address, 0)
    assert isinstance(subaccount, Subaccount)


@pytest.mark.asyncio
async def test_get_subaccounts(node_client):
    subaccounts = await node_client.get_subaccounts()
    assert isinstance(subaccounts, QuerySubaccountAllResponse)


@pytest.mark.asyncio
async def test_get_clob_pair(node_client):
    clob_pair = await node_client.get_clob_pair(1)
    assert isinstance(clob_pair, ClobPair)


@pytest.mark.asyncio
async def test_get_clob_pairs(node_client):
    clob_pairs = await node_client.get_clob_pairs()
    assert isinstance(clob_pairs, QueryClobPairAllResponse)


@pytest.mark.asyncio
async def test_get_price(node_client):
    price = await node_client.get_price(1)
    assert isinstance(price, MarketPrice)


@pytest.mark.asyncio
async def test_get_prices(node_client):
    prices = await node_client.get_prices()
    assert isinstance(prices, QueryAllMarketPricesResponse)


@pytest.mark.asyncio
async def test_get_perpetual(node_client):
    perpetual = await node_client.get_perpetual(1)
    assert isinstance(perpetual, QueryPerpetualResponse)


@pytest.mark.asyncio
async def test_get_perpetuals(node_client):
    perpetuals = await node_client.get_perpetuals()
    assert isinstance(perpetuals, QueryAllPerpetualsResponse)


@pytest.mark.asyncio
async def test_get_equity_tier_limit_config(node_client):
    config = await node_client.get_equity_tier_limit_config()
    assert isinstance(config, EquityTierLimitConfiguration)


@pytest.mark.asyncio
async def test_get_delegator_delegations(node_client, test_address):
    delegations = await node_client.get_delegator_delegations(test_address)
    assert isinstance(delegations, QueryDelegatorDelegationsResponse)


@pytest.mark.asyncio
async def test_get_delegator_unbonding_delegations(node_client, test_address):
    unbonding_delegations = await node_client.get_delegator_unbonding_delegations(
        test_address
    )
    assert isinstance(unbonding_delegations, QueryDelegatorUnbondingDelegationsResponse)


@pytest.mark.asyncio
async def test_get_delayed_complete_bridge_messages(node_client):
    bridge_messages = await node_client.get_delayed_complete_bridge_messages()
    assert isinstance(bridge_messages, QueryDelayedCompleteBridgeMessagesResponse)


@pytest.mark.asyncio
async def test_get_fee_tiers(node_client):
    fee_tiers = await node_client.get_fee_tiers()
    assert isinstance(fee_tiers, QueryPerpetualFeeParamsResponse)


@pytest.mark.asyncio
async def test_get_user_fee_tier(node_client, test_address):
    user_fee_tier = await node_client.get_user_fee_tier(test_address)
    assert isinstance(user_fee_tier, QueryUserFeeTierResponse)


@pytest.mark.asyncio
async def test_get_rewards_params(node_client):
    rewards_params = await node_client.get_rewards_params()
    assert isinstance(rewards_params, QueryParamsResponse)

@pytest.mark.asyncio
async def test_get_node_info(node_client):
    node_info = await node_client.get_node_info()
    assert node_info is not None
    assert isinstance(node_info, tendermint_query.GetNodeInfoResponse)

@pytest.mark.asyncio
async def test_get_delegation_total_rewards(node_client):
    total_rewards = await node_client.get_delegation_total_rewards(TEST_ADDRESS)
    assert total_rewards is not None
    assert isinstance(total_rewards, distribution_query.QueryDelegationTotalRewardsResponse)

@pytest.mark.asyncio
async def test_get_all_gov_proposals(node_client):
    gov_proposals = await node_client.get_all_gov_proposals()
    assert gov_proposals is not None
    assert isinstance(gov_proposals, gov_query.QueryProposalsResponse)

@pytest.mark.asyncio
async def test_get_withdrawal_and_transfer_gating_status(node_client):
    gating_status = await node_client.get_withdrawal_and_transfer_gating_status(0)
    assert gating_status is not None
    assert isinstance(gating_status, subaccount_query.QueryGetWithdrawalAndTransfersBlockedInfoResponse)

@pytest.mark.asyncio
async def test_get_withdrawal_capacity_by_denom(node_client):
    withdrawal_capacity = await node_client.get_withdrawal_capacity_by_denom("usdc")
    assert withdrawal_capacity is not None
    assert isinstance(withdrawal_capacity, rate_query.QueryCapacityByDenomResponse)

@pytest.mark.asyncio
async def test_get_affiliate_info(node_client):
    affiliate_info = await node_client.get_affiliate_info(TEST_ADDRESS)
    assert affiliate_info is not None
    assert isinstance(affiliate_info, affiliate_query.AffiliateInfoResponse)

@pytest.mark.asyncio
async def test_get_referred_by(node_client):
    referred_by = await node_client.get_referred_by(TEST_ADDRESS)
    assert referred_by is not None
    assert isinstance(referred_by, affiliate_query.ReferredByResponse)

@pytest.mark.asyncio
async def test_get_all_affiliate_tiers(node_client):
    all_affiliate_tiers = await node_client.get_all_affiliate_tiers()
    assert all_affiliate_tiers is not None
    assert isinstance(all_affiliate_tiers, affiliate_query.AllAffiliateTiersResponse)

@pytest.mark.asyncio
async def test_get_affiliate_whitelist(node_client):
    affiliate_whitelist = await node_client.get_affiliate_whitelist()
    assert affiliate_whitelist is not None
    assert isinstance(affiliate_whitelist, affiliate_query.AffiliateWhitelistResponse)
