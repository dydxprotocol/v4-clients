import asyncio

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from tests.conftest import TEST_ADDRESS


async def test():
    node_client = await NodeClient.connect(TESTNET.node)

    try:
        account = await node_client.get_account(TEST_ADDRESS)
        print("Get Account:")
        print(account)
    except Exception as e:
        print("Error in get_account:")
        print(f"Error: {e}")

    try:
        response = await node_client.get_account_balances(TEST_ADDRESS)
        print("Get Account Balances:")
        print(response)
    except Exception as e:
        print("Error in get_account_balances:")
        print(f"Error: {e}")

    try:
        response = await node_client.get_account_balance(TEST_ADDRESS, "adv4tnt")
        print("Get Account Balance:")
        print(response)
    except Exception as e:
        print("Error in get_account_balance:")
        print(f"Error: {e}")

    try:
        block = await node_client.latest_block()
        print("Get Latest Block:")
        print(block)
    except Exception as e:
        print("Error in latest_block:")
        print(f"Error: {e}")

    try:
        height = await node_client.latest_block_height()
        print("Get Latest Block Height:")
        print(height)
    except Exception as e:
        print("Error in latest_block_height:")
        print(f"Error: {e}")

    try:
        stats = await node_client.get_user_stats(TEST_ADDRESS)
        print("Get User Stats:")
        print(stats)
    except Exception as e:
        print("Error in get_user_stats:")
        print(f"Error: {e}")

    try:
        validators = await node_client.get_all_validators()
        print("Get All Validators:")
        print(validators)
    except Exception as e:
        print("Error in get_all_validators:")
        print(f"Error: {e}")

    try:
        subaccount = await node_client.get_subaccount(TEST_ADDRESS, 0)
        decoded = node_client.transcode_response(subaccount)
        print("Get Subaccount:")
        print(decoded)
    except Exception as e:
        print("Error in get_subaccount:")
        print(f"Error: {e}")

    try:
        subaccounts = await node_client.get_subaccounts()
        decoded = node_client.transcode_response(subaccounts)
        print("Get Subaccounts:")
        print(decoded)
    except Exception as e:
        print("Error in get_subaccounts:")
        print(f"Error: {e}")

    try:
        clob_pair = await node_client.get_clob_pair(1)
        print("Get CLOB Pair:")
        print(clob_pair)
    except Exception as e:
        print("Error in get_clob_pair:")
        print(f"Error: {e}")

    try:
        clob_pairs = await node_client.get_clob_pairs()
        print("Get CLOB Pairs:")
        print(clob_pairs)
    except Exception as e:
        print("Error in get_clob_pairs:")
        print(f"Error: {e}")

    try:
        price = await node_client.get_price(1)
        print("Get Price:")
        print(price)
    except Exception as e:
        print("Error in get_price:")
        print(f"Error: {e}")

    try:
        prices = await node_client.get_prices()
        print("Get Prices:")
        print(prices)
    except Exception as e:
        print("Error in get_prices:")
        print(f"Error: {e}")

    try:
        perpetual = await node_client.get_perpetual(1)
        print("Get Perpetual:")
        print(perpetual)
    except Exception as e:
        print("Error in get_perpetual:")
        print(f"Error: {e}")

    try:
        perpetuals = await node_client.get_perpetuals()
        print("Get Perpetuals:")
        print(perpetuals)
    except Exception as e:
        print("Error in get_perpetuals:")
        print(f"Error: {e}")

    try:
        config = await node_client.get_equity_tier_limit_config()
        print("Get Equity Tier Limit Config:")
        print(config)
    except Exception as e:
        print("Error in get_equity_tier_limit_config:")
        print(f"Error: {e}")

    try:
        delegations = await node_client.get_delegator_delegations(TEST_ADDRESS)
        print("Get Delegator Delegations:")
        print(delegations)
    except Exception as e:
        print("Error in get_delegator_delegations:")
        print(f"Error: {e}")

    try:
        unbonding_delegations = await node_client.get_delegator_unbonding_delegations(
            TEST_ADDRESS
        )
        print("Get Delegator Unbonding Delegations:")
        print(unbonding_delegations)
    except Exception as e:
        print("Error in get_delegator_unbonding_delegations:")
        print(f"Error: {e}")

    try:
        bridge_messages = await node_client.get_delayed_complete_bridge_messages()
        print("Get Delayed Complete Bridge Messages:")
        print(bridge_messages)
    except Exception as e:
        print("Error in get_delayed_complete_bridge_messages:")
        print(f"Error: {e}")

    try:
        fee_tiers = await node_client.get_fee_tiers()
        print("Get Fee Tiers:")
        print(fee_tiers)
    except Exception as e:
        print("Error in get_fee_tiers:")
        print(f"Error: {e}")

    try:
        user_fee_tier = await node_client.get_user_fee_tier(TEST_ADDRESS)
        print("Get User Fee Tier:")
        print(user_fee_tier)
    except Exception as e:
        print("Error in get_user_fee_tier:")
        print(f"Error: {e}")

    try:
        rewards_params = await node_client.get_rewards_params()
        print("Get Rewards Params:")
        print(rewards_params)
    except Exception as e:
        print("Error in get_rewards_params:")
        print(f"Error: {e}")


asyncio.run(test())
