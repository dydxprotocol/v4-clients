import asyncio
import random

<<<<<<< HEAD
from v4_proto.dydxprotocol.clob.order_pb2 import Order

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from dydx_v4_client.indexer.rest.constants import OrderType
=======
>>>>>>> 87f770a (feat: Added example)
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS


<<<<<<< HEAD
async def close_position_example(size: float):
    node = await NodeClient.connect(TESTNET.node)
=======
async def close_position_example():
>>>>>>> 87f770a (feat: Added example)
    indexer = IndexerClient(TESTNET.rest_indexer)
    node_client = await NodeClient.connect(TESTNET.node)
    wallet = await Wallet.from_mnemonic(
        node_client,
        mnemonic=DYDX_TEST_MNEMONIC,
        address=TEST_ADDRESS,
    )
    MARKET_ID = "ETH-USD"
    market = Market(
        (await indexer.markets.get_perpetual_markets(MARKET_ID))["markets"][MARKET_ID]
    )
<<<<<<< HEAD

    order_id = market.order_id(
        TEST_ADDRESS, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )

    current_block = await node.latest_block_height()

    new_order = market.order(
        order_id=order_id,
        order_type=OrderType.MARKET,
        side=Order.Side.SIDE_SELL,
        size=size,
        price=0,
        # Recommend set to oracle price - 5% or lower for SELL, oracle price + 5% for BUY
        time_in_force=Order.TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        reduce_only=False,
        good_til_block=current_block + 20,
    )

    transaction = await node.place_order(
        wallet=wallet,
        order=new_order,
    )

    print(transaction)
    wallet.sequence += 1

    await asyncio.sleep(5)

    response = await node_client.close_position(
        wallet, TEST_ADDRESS, 0, market, None, random.randint(0, 1000000000)
=======
    response = await node_client.close_position(
<<<<<<< HEAD
        wallet,
        TEST_ADDRESS,
        0,
        market,
        None,
        random.randint(0, 1000000000)
>>>>>>> 87f770a (feat: Added example)
=======
        wallet, TEST_ADDRESS, 0, market, None, random.randint(0, 1000000000)
>>>>>>> 007cd8d (fix: Reformat)
    )
    print(response)


<<<<<<< HEAD
asyncio.run(close_position_example(0.001))
=======
asyncio.run(close_position_example())
>>>>>>> 87f770a (feat: Added example)
