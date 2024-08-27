import asyncio

from dydx_v4_client.indexer.rest.constants import TradingRewardAggregationPeriod
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from tests.conftest import TEST_ADDRESS


async def test_account():
    indexer = IndexerClient(TESTNET.rest_indexer)
    test_address = TEST_ADDRESS

    try:
        response = await indexer.account.get_subaccounts(test_address)
        subaccounts = response["subaccounts"]
        print(f"Subaccounts: {subaccounts}")
        if subaccounts is None:
            print("Subaccounts is None")
        else:
            print(f"Number of subaccounts: {len(subaccounts)}")
            if len(subaccounts) > 0:
                subaccount0 = subaccounts[0]
                subaccount_number = subaccount0["subaccountNumber"]
                print(f"Subaccount number: {subaccount_number}")
    except Exception as e:
        print(f"Error: {e}")

    try:
        response = await indexer.account.get_subaccount(test_address, 0)
        subaccount = response["subaccount"]
        print(f"Subaccount: {subaccount}")
        if subaccount is None:
            print("Subaccount is None")
        else:
            subaccount_number = subaccount["subaccountNumber"]
            print(f"Subaccount number: {subaccount_number}")
    except Exception as e:
        print(f"Error: {e}")

    try:
        response = await indexer.account.get_subaccount_asset_positions(test_address, 0)
        print(f"Response: {response}")
        if response is None:
            print("Response is None")
        else:
            positions = response["positions"]
            print(f"Positions: {positions}")
            if positions is None:
                print("Positions is None")
            elif len(positions) > 0:
                position = positions[0]
                print(f"Position: {position}")
    except Exception as e:
        print(f"Error: {e}")

    try:
        response = await indexer.account.get_subaccount_perpetual_positions(
            test_address, 0
        )
        print(f"Response: {response}")
        if response is None:
            print("Response is None")
        else:
            positions = response["positions"]
            print(f"Positions: {positions}")
            if positions is None:
                print("Positions is None")
            elif len(positions) > 0:
                position = positions[0]
                print(f"Position: {position}")
    except Exception as e:
        print(f"Error: {e}")

    try:
        response = await indexer.account.get_subaccount_transfers(test_address, 0)
        print(f"Response: {response}")
        if response is None:
            print("Response is None")
        else:
            transfers = response["transfers"]
            print(f"Transfers: {transfers}")
            if transfers is None:
                print("Transfers is None")
            elif len(transfers) > 0:
                transfer = transfers[0]
                print(f"Transfer: {transfer}")
    except Exception as e:
        print(f"Error: {e}")

    try:
        response = await indexer.account.get_subaccount_orders(test_address, 0)
        print(f"Response: {response}")
        if response is None:
            print("Response is None")
        else:
            orders = response
            print(f"Orders: {orders}")
            if orders is None:
                print("Orders is None")
            elif len(orders) > 0:
                order = orders[0]
                print(f"Order: {order}")
    except Exception as e:
        print(f"Error: {e}")

    try:
        response = await indexer.account.get_subaccount_fills(test_address, 0)
        print(f"Response: {response}")
        if response is None:
            print("Response is None")
        else:
            fills = response["fills"]
            print(f"Fills: {fills}")
            if fills is None:
                print("Fills is None")
            elif len(fills) > 0:
                fill = fills[0]
                print(f"Fill: {fill}")
    except Exception as e:
        print(f"Error: {e}")

    try:
        response = await indexer.account.get_subaccount_historical_pnls(test_address, 0)
        print(f"Response: {response}")
        if response is None:
            print("Response is None")
        else:
            historical_pnl = response["historicalPnl"]
            print(f"Historical PnL: {historical_pnl}")
            if historical_pnl is None:
                print("Historical PnL is None")
            elif len(historical_pnl) > 0:
                historical_pnl0 = historical_pnl[0]
                print(f"Historical PnL (first entry): {historical_pnl0}")
    except Exception as e:
        print(f"Error: {e}")

    try:
        limit = 10
        response = await indexer.account.get_historical_block_trading_rewards(
            test_address, limit
        )
        historical_rewards = response["rewards"]
        print(f"Historical rewards: {historical_rewards}")
        if historical_rewards is None:
            print("Historical rewards is None")
        else:
            print(f"Historical rewards type: {type(historical_rewards)}")
            print(f"Number of historical rewards: {len(historical_rewards)}")
            if len(historical_rewards) > 0:
                first_reward = historical_rewards[0]
                print(f"First historical reward: {first_reward}")
                print(f"createdAt: {first_reward.get('createdAt')}")
                print(f"createdAtHeight: {first_reward.get('createdAtHeight')}")
                print(f"tradingReward: {first_reward.get('tradingReward')}")
    except Exception as e:
        print(f"Error: {e}")

    try:
        period = TradingRewardAggregationPeriod.DAILY
        limit = 10
        response = await indexer.account.get_historical_trading_rewards_aggregated(
            test_address, period, limit
        )
        aggregations = response["rewards"]
        print(f"Aggregations: {aggregations}")
        if aggregations is None:
            print("Aggregations is None")
        else:
            print(f"Aggregations type: {type(aggregations)}")
            print(f"Number of aggregations: {len(aggregations)}")
            if len(aggregations) > 0:
                for aggregation in aggregations:
                    print(f"Aggregation: {aggregation}")
                    print(f"Period: {aggregation.get('period')}")
                    print(f"Trading reward: {aggregation.get('tradingReward')}")
                    print(f"Started at: {aggregation.get('startedAt')}")
                    print(f"Ended at: {aggregation.get('endedAt')}")
                    print(f"Started at height: {aggregation.get('startedAtHeight')}")
                    print(f"Ended at height: {aggregation.get('endedAtHeight')}")
    except Exception as e:
        print(f"Error: {e}")


asyncio.run(test_account())
