import random
import asyncio

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from v4_proto.dydxprotocol.clob.order_pb2 import Order

from dydx_v4_client.indexer.rest.constants import OrderType, OrderExecution
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market, since_now
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS

MARKET_ID = "ETH-USD"


async def test_place_stop_limit_order():
    size, trigger_price, price = 0.001, 1800, 1799
    node = await NodeClient.connect(TESTNET.node)
    indexer = IndexerClient(TESTNET.rest_indexer)

    market = Market(
        (await indexer.markets.get_perpetual_markets(MARKET_ID))["markets"][MARKET_ID]
    )
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)

    order_id = market.order_id(
        TEST_ADDRESS, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.CONDITIONAL
    )

    current_block = await node.latest_block_height()
    print(current_block)
    new_order = market.order(
        order_id=order_id,
        order_type=OrderType.STOP_LIMIT,
        side=Order.Side.SIDE_SELL,
        size=size,
        price=price,
        time_in_force=Order.TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        reduce_only=False,
        execution=OrderExecution.DEFAULT,
        good_til_block_time=since_now(seconds=3600),
        condition_type=Order.ConditionType.CONDITION_TYPE_STOP_LOSS,
        conditional_order_trigger_subticks=market.calculate_subticks(trigger_price),
    )
    print(new_order)
    transaction = await node.place_order(
        wallet=wallet,
        order=new_order,
    )

    print(transaction)
    wallet.sequence += 1


asyncio.run(test_place_stop_limit_order())
