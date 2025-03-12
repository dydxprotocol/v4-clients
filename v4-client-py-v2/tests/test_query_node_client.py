import asyncio
import time

import grpc
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

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient, QueryNodeClient


@pytest.mark.asyncio
async def test_get_account_balances(node_client, test_address):
    result = await node_client.get_account_balances(test_address)
    assert type(result) == bank_query.QueryAllBalancesResponse


# @pytest.mark.asyncio
# async def test_get_account(node_client, test_address):
#    account = await node_client.get_account(test_address)
#    assert isinstance(account, BaseAccount)
#
#
# @pytest.mark.asyncio
# async def test_get_account_balances(node_client, test_address):
#    response = await node_client.get_account_balances(test_address)
#    assert isinstance(response, bank_query.QueryAllBalancesResponse)
#    assert all(isinstance(balance, Coin) for balance in response.balances)
#
#
# @pytest.mark.asyncio
# async def test_get_account_balance(node_client, test_address):
#    response = await node_client.get_account_balance(test_address, "usdc")
#    assert isinstance(response, bank_query.QueryBalanceResponse)
#    assert response.balance.denom == "usdc"
#    assert isinstance(response.balance.amount, str)
#
#
# @pytest.mark.asyncio
# async def test_latest_block(node_client):
#    block = await node_client.latest_block()
#    assert isinstance(block, GetLatestBlockResponse)
#
#
# @pytest.mark.asyncio
# async def test_latest_block_height(node_client):
#    height = await node_client.latest_block_height()
#    assert isinstance(height, int)
#    assert height > 0
#
#
# @pytest.mark.asyncio
# async def test_get_user_stats(node_client, test_address):
#    stats = await node_client.get_user_stats(test_address)
#    assert isinstance(stats, QueryUserStatsResponse)
#
#
# @pytest.mark.asyncio
# async def test_get_all_validators(node_client):
#    validators = await node_client.get_all_validators()
#    assert isinstance(validators, QueryValidatorsResponse)
#
#
# @pytest.mark.asyncio
# async def test_get_subaccount(node_client, test_address):
#    subaccount = await node_client.get_subaccount(test_address, 0)
#    assert isinstance(subaccount, Subaccount)
#
#
# @pytest.mark.asyncio
# async def test_get_subaccounts(node_client):
#    subaccounts = await node_client.get_subaccounts()
#    assert isinstance(subaccounts, QuerySubaccountAllResponse)
#
#
# @pytest.mark.asyncio
# async def test_get_clob_pair(node_client):
#    clob_pair = await node_client.get_clob_pair(1)
#    assert isinstance(clob_pair, ClobPair)
#
#
# @pytest.mark.asyncio
# async def test_get_clob_pairs(node_client):
#    clob_pairs = await node_client.get_clob_pairs()
#    assert isinstance(clob_pairs, QueryClobPairAllResponse)
#
#
# @pytest.mark.asyncio
# async def test_get_price(node_client):
#    price = await node_client.get_price(1)
#    assert isinstance(price, MarketPrice)
#
#
# @pytest.mark.asyncio
# async def test_get_prices(node_client):
#    prices = await node_client.get_prices()
#    assert isinstance(prices, QueryAllMarketPricesResponse)
#
#
# @pytest.mark.asyncio
# async def test_get_perpetual(node_client):
#    perpetual = await node_client.get_perpetual(1)
#    assert isinstance(perpetual, QueryPerpetualResponse)
#
#
# @pytest.mark.asyncio
# async def test_get_perpetuals(node_client):
#    perpetuals = await node_client.get_perpetuals()
#    assert isinstance(perpetuals, QueryAllPerpetualsResponse)
#
#
# @pytest.mark.asyncio
# async def test_get_equity_tier_limit_config(node_client):
#    config = await node_client.get_equity_tier_limit_config()
#    assert isinstance(config, EquityTierLimitConfiguration)
#
#
# @pytest.mark.asyncio
# async def test_get_delegator_delegations(node_client, test_address):
#    delegations = await node_client.get_delegator_delegations(test_address)
#    assert isinstance(delegations, QueryDelegatorDelegationsResponse)
#
#
# @pytest.mark.asyncio
# async def test_get_delegator_unbonding_delegations(node_client, test_address):
#    unbonding_delegations = await node_client.get_delegator_unbonding_delegations(
#        test_address
#    )
#    assert isinstance(unbonding_delegations, QueryDelegatorUnbondingDelegationsResponse)
#
#
# @pytest.mark.asyncio
# async def test_get_delayed_complete_bridge_messages(node_client):
#    bridge_messages = await node_client.get_delayed_complete_bridge_messages()
#    assert isinstance(bridge_messages, QueryDelayedCompleteBridgeMessagesResponse)
#
#
# @pytest.mark.asyncio
# async def test_get_fee_tiers(node_client):
#    fee_tiers = await node_client.get_fee_tiers()
#    assert isinstance(fee_tiers, QueryPerpetualFeeParamsResponse)
#
#
# @pytest.mark.asyncio
# async def test_get_user_fee_tier(node_client, test_address):
#    user_fee_tier = await node_client.get_user_fee_tier(test_address)
#    assert isinstance(user_fee_tier, QueryUserFeeTierResponse)
#
#
# @pytest.mark.asyncio
# async def test_get_rewards_params(node_client):
#    rewards_params = await node_client.get_rewards_params()
#    assert isinstance(rewards_params, QueryParamsResponse)


@pytest.mark.asyncio
async def test_intercalated_concurrent_requests(node_client, test_address):
    """Test alternating sequential and concurrent requests and average the results."""
    import asyncio
    import statistics
    import time

    import grpc

    # Number of test iterations
    num_iterations = 5

    # Lists to store timing results
    sequential_times = []
    concurrent_times = []

    print(
        f"\nRunning {num_iterations} alternating sequential and concurrent test iterations..."
    )

    for i in range(num_iterations * 2):  # Double iterations to alternate
        # Clear any potential caches between runs
        await asyncio.sleep(0.1)

        # Alternate between sequential and concurrent
        if i % 2 == 0:
            # Sequential run
            print(f"\nIteration {i//2 + 1} - Sequential:")
            start_time = time.time()

            # Make multiple different API calls sequentially
            seq_balance = await node_client.get_account_balances(test_address)
            seq_block = await node_client.latest_block()
            seq_validators = await node_client.get_all_validators()
            seq_prices = await node_client.get_prices()

            elapsed = time.time() - start_time
            sequential_times.append(elapsed)
            print(f"  Time: {elapsed:.4f}s")

            # Verify result types
            assert isinstance(seq_balance, bank_query.QueryAllBalancesResponse)
            assert isinstance(seq_block, GetLatestBlockResponse)
            assert isinstance(seq_validators, QueryValidatorsResponse)
            assert isinstance(seq_prices, QueryAllMarketPricesResponse)

        else:
            # Concurrent run
            print(f"Iteration {i//2 + 1} - Concurrent:")
            start_time = time.time()

            # Create multiple tasks for different API calls
            tasks = [
                node_client.get_account_balances(test_address),
                node_client.latest_block(),
                node_client.get_all_validators(),
                node_client.get_prices(),
            ]

            # Wait for all tasks to complete
            results = await asyncio.gather(*tasks)

            elapsed = time.time() - start_time
            concurrent_times.append(elapsed)
            print(f"  Time: {elapsed:.4f}s")

            # Verify result types for the concurrent run
            assert isinstance(results[0], bank_query.QueryAllBalancesResponse)
            assert isinstance(results[1], GetLatestBlockResponse)
            assert isinstance(results[2], QueryValidatorsResponse)
            assert isinstance(results[3], QueryAllMarketPricesResponse)

    # Calculate statistics
    avg_sequential = statistics.mean(sequential_times)
    avg_concurrent = statistics.mean(concurrent_times)

    # Calculate median to reduce impact of outliers
    median_sequential = statistics.median(sequential_times)
    median_concurrent = statistics.median(concurrent_times)

    # Calculate standard deviation to see consistency
    stdev_sequential = (
        statistics.stdev(sequential_times) if len(sequential_times) > 1 else 0
    )
    stdev_concurrent = (
        statistics.stdev(concurrent_times) if len(concurrent_times) > 1 else 0
    )

    # Calculate improvement ratios
    avg_improvement = avg_sequential / avg_concurrent if avg_concurrent > 0 else 1
    median_improvement = (
        median_sequential / median_concurrent if median_concurrent > 0 else 1
    )

    # Print detailed results
    print("\nDetailed Results:")
    print(f"Sequential runs: {sequential_times}")
    print(f"Concurrent runs: {concurrent_times}")

    print("\nStatistical Analysis:")
    print(f"Average Sequential Time: {avg_sequential:.4f}s (±{stdev_sequential:.4f}s)")
    print(f"Average Concurrent Time: {avg_concurrent:.4f}s (±{stdev_concurrent:.4f}s)")
    print(f"Median Sequential Time: {median_sequential:.4f}s")
    print(f"Median Concurrent Time: {median_concurrent:.4f}s")
    print(f"Average Speed Improvement: {avg_improvement:.2f}x")
    print(f"Median Speed Improvement: {median_improvement:.2f}x")

    # Analyze the consistency of the results
    print("\nConsistency Analysis:")
    sequential_cv = (
        (stdev_sequential / avg_sequential) * 100 if avg_sequential > 0 else 0
    )
    concurrent_cv = (
        (stdev_concurrent / avg_concurrent) * 100 if avg_concurrent > 0 else 0
    )
    print(f"Sequential Coefficient of Variation: {sequential_cv:.2f}%")
    print(f"Concurrent Coefficient of Variation: {concurrent_cv:.2f}%")

    # Determine if the client is likely blocking
    print("\nConclusion:")
    if avg_improvement > 1.5 and median_improvement > 1.5:
        print(
            "The client appears to be non-blocking with significant concurrent performance gains."
        )
        print(
            f"Concurrent execution is approximately {avg_improvement:.2f}x faster than sequential execution."
        )
    elif avg_improvement > 1.1 and median_improvement > 1.1:
        print(
            "The client shows some concurrent performance gains, but they are modest."
        )
        print(
            f"Concurrent execution is approximately {avg_improvement:.2f}x faster than sequential execution."
        )
    else:
        print(
            "The client appears to be blocking or has minimal concurrent performance gains."
        )
        print(
            f"Concurrent execution is only {avg_improvement:.2f}x faster than sequential execution."
        )
