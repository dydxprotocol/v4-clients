import pytest
import time


from random import randint

from dydx_v4_client.indexer.rest.constants import OrderType
from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from dydx_v4_client.node.market import Market
from dydx_v4_client.node.subaccount import SubaccountInfo
from dydx_v4_client.wallet import Wallet

from v4_proto.dydxprotocol.clob.order_pb2 import Order
from v4_proto.dydxprotocol.subaccounts.subaccount_pb2 import SubaccountId
from v4_proto.dydxprotocol.clob.tx_pb2 import OrderBatch

from tests.conftest import DYDX_TEST_MNEMONIC, assert_successful_broadcast

MARKET_ID = "BTC-USD"
PERPETUAL_PAIR_BTC_USD = 0
REQUEST_PROCESSING_TIME = 5


@pytest.fixture(autouse=True)
def sleep_after_test(request):
    """
    Applies 5 seconds sleep to all tests in this file.
    It gives the testnet the time to process the request.
    Otherwise tests would throw incorrect sequence errors.
    """
    yield
    time.sleep(REQUEST_PROCESSING_TIME)


@pytest.mark.asyncio
async def test_batch_cancel(indexer_rest_client, node_client, test_address, wallet):
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(MARKET_ID))["markets"][
            MARKET_ID
        ]
    )
    height = await node_client.latest_block_height()
    assert height > 0

    orders = list()
    client_ids = list()
    for _ in range(3):
        client_ids.append(randint(0, MAX_CLIENT_ID))
        order_id = market.order_id(
            test_address, 0, client_ids[-1], OrderFlags.SHORT_TERM
        )
        order = market.order(
            order_id,
            side=Order.Side.SIDE_SELL,
            order_type=OrderType.LIMIT,
            size=0.01,
            price=40000 + randint(-100, 100),
            time_in_force=Order.TIME_IN_FORCE_IOC,
            reduce_only=False,
            good_til_block=height + 20,
        )
        orders.append(order)

    assert orders[0].quantums == orders[1].quantums
    assert orders[0].subticks != orders[1].subticks

    wallet = await Wallet.from_mnemonic(node_client, DYDX_TEST_MNEMONIC, test_address)
    subaccount_info = SubaccountInfo.for_wallet(wallet, 0)

    assert wallet.address == test_address

    # Place orders
    for order in orders:
        response = await node_client.place_order(subaccount_info, order)
        assert_successful_broadcast(response)

    # Prepare batch cancel
    subaccount_id = SubaccountId(owner=test_address, number=0)
    order_batch = OrderBatch(clob_pair_id=PERPETUAL_PAIR_BTC_USD, client_ids=client_ids)
    cancellation_current_block = await node_client.latest_block_height()

    # Execute batch cancel
    batch_cancel_response = await node_client.batch_cancel_orders(
        subaccount_info, subaccount_id, [order_batch], cancellation_current_block + 10
    )
    assert_successful_broadcast(batch_cancel_response)
