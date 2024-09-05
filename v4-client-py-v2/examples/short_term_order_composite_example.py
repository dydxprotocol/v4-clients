import asyncio
import json
import random
import time
from pathlib import Path

from v4_proto.dydxprotocol.clob.order_pb2 import Order

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from dydx_v4_client.indexer.rest.constants import OrderType
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS

MARKET_ID = "ETH-USD"

order_execution_to_time_in_force = {
    "DEFAULT": Order.TIME_IN_FORCE_UNSPECIFIED,
    "FOK": Order.TIME_IN_FORCE_FILL_OR_KILL,
    "IOC": Order.TIME_IN_FORCE_IOC,
    "POST_ONLY": Order.TIME_IN_FORCE_POST_ONLY,
}

to_order_side = {"BUY": Order.Side.SIDE_BUY, "SELL": Order.Side.SIDE_SELL}


with open(Path(__file__).parent / "human_readable_short_term_orders.json", "r") as file:
    orders = json.load(file)


async def test():

    node = await NodeClient.connect(TESTNET.node)
    indexer = IndexerClient(TESTNET.rest_indexer)

    market = Market(
        (await indexer.markets.get_perpetual_markets(MARKET_ID))["markets"][MARKET_ID]
    )
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)

    for order in orders:
        current_block = await node.latest_block_height()
        good_til_block = current_block + 1 + 10

        order_id = market.order_id(
            TEST_ADDRESS, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
        )

        place = await node.place_order(
            wallet,
            market.order(
                order_id,
                OrderType.LIMIT,
                to_order_side[order["side"]],
                size=0.01,
                price=order.get("price", 1350),
                time_in_force=order_execution_to_time_in_force[order["timeInForce"]],
                reduce_only=False,
                good_til_block=good_til_block,
            ),
        )
        print(place)
        # FIXME(piwonskp): Remove
        wallet.sequence += 1
        time.sleep(5)


asyncio.run(test())
