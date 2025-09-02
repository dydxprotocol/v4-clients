import asyncio
import random

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from v4_proto.dydxprotocol.clob.order_pb2 import Order

from dydx_v4_client.indexer.rest.constants import OrderType
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS

MARKET_ID = "ETH-USD"


async def place_market_order_with_builder_code(size: float):
    node = await NodeClient.connect(TESTNET.node)
    indexer = IndexerClient(TESTNET.rest_indexer)

    market = Market(
        (await indexer.markets.get_perpetual_markets(MARKET_ID))["markets"][MARKET_ID]
    )
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)

    order_id = market.order_id(
        TEST_ADDRESS, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )

    current_block = await node.latest_block_height()

    new_order = market.order(
        order_id=order_id,
        order_type=OrderType.MARKET,
        side=Order.Side.SIDE_SELL,
        size=size,
        price=0,  # Recommend set to oracle price - 5% or lower for SELL, oracle price + 5% for BUY
        time_in_force=Order.TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        reduce_only=False,
        good_til_block=current_block + 10,
        builder_address=TEST_ADDRESS,
        fee_ppm=500,
    )

    transaction = await node.place_order(
        wallet=wallet,
        order=new_order,
    )

    print(transaction)
    wallet.sequence += 1

    await asyncio.sleep(5)

    fills = await indexer.account.get_subaccount_fills(
        address=TEST_ADDRESS, subaccount_number=0, ticker=MARKET_ID, limit=1
    )
    print(f"Fills: {fills}")


asyncio.run(place_market_order_with_builder_code(0.00001))
