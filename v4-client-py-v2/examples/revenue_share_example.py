import asyncio
import random
import time

from dydx_v4_client.indexer.rest.constants import OrderType
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.key_pair import KeyPair
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market
from dydx_v4_client.node.message import order_id
from dydx_v4_client.wallet import Wallet
from tests.conftest import TEST_ADDRESS_2, TEST_ADDRESS, DYDX_TEST_MNEMONIC


async def test():
    node_client = await NodeClient.connect(TESTNET.node)
    try:
        indexer_client = IndexerClient(TESTNET.rest_indexer)
        account = await node_client.get_account(TEST_ADDRESS)
        key_pair = KeyPair.from_mnemonic(DYDX_TEST_MNEMONIC)
        wallet = Wallet(key_pair, account.account_number, account.sequence)

        test_order_id = order_id(
            TEST_ADDRESS,
            subaccount_number=0,
            client_id=random.randint(0, 1000000000),
            clob_pair_id=0,
            order_flags=64,
        )

        MARKET_ID = "ETH-USD"
        market = Market(
            (await indexer_client.markets.get_perpetual_markets(MARKET_ID))["markets"][
                MARKET_ID
            ]
        )

        test_order = market.order(
            order_id=test_order_id,
            time_in_force=0,
            reduce_only=False,
            side=1,
            order_type=OrderType.MARKET,
            size=0.0001,
            price=0,
            good_til_block_time=int(time.time() + 60),
            order_router_address=TEST_ADDRESS_2,
        )

        _ = await node_client.place_order(
            wallet,
            test_order,
        )

        await asyncio.sleep(5)

        fills = await indexer_client.account.get_subaccount_fills(
            address=TEST_ADDRESS, subaccount_number=0, limit=1
        )

        print(f"Fills: {fills}")
    except Exception as e:
        print(f"Error during placing order with order_router_address: {e}")

    try:
        response = await node_client.get_market_mapper_revenue_share_param()
        print(response)
    except Exception as e:
        print(f"Error during fetching get_market_mapper_revenue_share_param: {e}")

    try:
        response = await node_client.get_order_router_revenue_share(TEST_ADDRESS_2)
        print(response)
    except Exception as e:
        print(f"Error during fetching get_order_router_revenue_share: {e}")


asyncio.run(test())
