import asyncio
import random

from v4_proto.dydxprotocol.clob.order_pb2 import Order

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from dydx_v4_client.indexer.rest.constants import OrderType
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS
from v4_proto.dydxprotocol.clob.tx_pb2 import OrderBatch
from v4_proto.dydxprotocol.subaccounts.subaccount_pb2 import SubaccountId


MARKET_ID = "BTC-USD"
PERPETUAL_PAIR_BTC_USD = 0


async def test_batch_cancel():
    node = await NodeClient.connect(TESTNET.node)
    indexer = IndexerClient(TESTNET.rest_indexer)

    market = Market(
        (await indexer.markets.get_perpetual_markets(MARKET_ID))["markets"][MARKET_ID]
    )
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)

    # Place multiple orders
    orders = []
    client_ids = []
    for _ in range(3):
        client_id = random.randint(0, MAX_CLIENT_ID)
        order_id = market.order_id(TEST_ADDRESS, 0, client_id, OrderFlags.SHORT_TERM)
        client_ids.append(client_id)
        current_block = await node.latest_block_height()
        order = market.order(
            order_id,
            side=Order.Side.SIDE_SELL,
            order_type=OrderType.LIMIT,
            size=0.01,
            price=40000 + random.randint(-100, 100),
            time_in_force=Order.TIME_IN_FORCE_IOC,
            reduce_only=False,
            good_til_block=current_block + 20,
        )
        orders.append(order)

    # Place orders
    for order in orders:
        place = await node.place_order(wallet, order)
        print(f"Placed order: {place}")
        wallet.sequence += 1

    # Prepare batch cancel
    subaccount_id = SubaccountId(owner=TEST_ADDRESS, number=0)
    order_batch = OrderBatch(clob_pair_id=PERPETUAL_PAIR_BTC_USD, client_ids=client_ids)
    cancellation_current_block = await node.latest_block_height()

    # Execute batch cancel
    batch_cancel_response = await node.batch_cancel_orders(
        wallet, subaccount_id, [order_batch], cancellation_current_block + 10
    )
    print(f"Batch cancel response: {batch_cancel_response}")


asyncio.run(test_batch_cancel())
