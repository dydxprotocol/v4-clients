import asyncio
import random
import time

from v4_proto.dydxprotocol.clob.order_pb2 import Order

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from dydx_v4_client.indexer.rest.constants import OrderType
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market, since_now
from dydx_v4_client.wallet import Wallet
from dydx_v4_client.indexer.rest.constants import OrderType
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS

MARKET_ID = "ETH-USD"


async def test():

    node = await NodeClient.connect(TESTNET.node)
    indexer = IndexerClient(TESTNET.rest_indexer)

    market = Market(
        (await indexer.markets.get_perpetual_markets(MARKET_ID))["markets"][MARKET_ID]
    )
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)

    order_id = market.order_id(
        TEST_ADDRESS, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.LONG_TERM
    )

    place = await node.place_order(
        wallet,
        market.order(
            order_id,
            OrderType.LIMIT,
            Order.Side.SIDE_SELL,
            size=0.01,
            price=40000,
            time_in_force=Order.TIME_IN_FORCE_UNSPECIFIED,
            reduce_only=False,
            good_til_block_time=since_now(seconds=60),
        ),
    )
    print(place)

    wallet.sequence += 1
    time.sleep(5)

    time.sleep(5)

    cancel = await node.cancel_order(
        wallet,
        order_id,
        good_til_block_time=since_now(seconds=120),
    )
    print(cancel)


asyncio.run(test())
