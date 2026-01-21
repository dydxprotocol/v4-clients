import asyncio
import random
import time

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from dydx_v4_client.indexer.rest.constants import OrderType
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.key_pair import KeyPair
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market
from dydx_v4_client.node.message import order_id
from dydx_v4_client.wallet import Wallet
from tests.conftest import TEST_ADDRESS_2, TEST_ADDRESS_3, DYDX_TEST_MNEMONIC_3
from v4_proto.dydxprotocol.clob.order_pb2 import Order


async def run_revenue_share_example():
    node = await NodeClient.connect(TESTNET.node)
    try:
        indexer = IndexerClient(TESTNET.rest_indexer)
        MARKET_ID = "ENA-USD"
        market = Market(
            (await indexer.markets.get_perpetual_markets(MARKET_ID))["markets"][
                MARKET_ID
            ]
        )
        wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3)

        order_id = market.order_id(
            TEST_ADDRESS_3, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
        )

        current_block = await node.latest_block_height()

        new_order = market.order(
            order_id=order_id,
            order_type=OrderType.MARKET,
            side=Order.Side.SIDE_SELL,
            size=0.0001,
            price=0,  # Recommend set to oracle price - 5% or lower for SELL, oracle price + 5% for BUY
            time_in_force=Order.TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
            reduce_only=False,
            good_til_block=current_block + 10,
            order_router_address=TEST_ADDRESS_2,
        )

        transaction = await node.place_order(
            wallet=wallet,
            order=new_order,
        )

        print(transaction)

        await asyncio.sleep(5)

        fills = await indexer.account.get_subaccount_fills(
            address=TEST_ADDRESS_3, subaccount_number=0, limit=1
        )

        print(f"Fills: {fills}")

    except Exception as e:
        print(f"Error during placing order with order_router_address: {e}")

    try:
        response = await node.get_market_mapper_revenue_share_param()
        print(response)
    except Exception as e:
        print(f"Error during fetching get_market_mapper_revenue_share_param: {e}")

    try:
        response = await node.get_order_router_revenue_share(TEST_ADDRESS_2)
        print(response)
    except Exception as e:
        print(f"Error during fetching get_order_router_revenue_share: {e}")


asyncio.run(run_revenue_share_example())
