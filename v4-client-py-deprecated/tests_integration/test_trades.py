import asyncio
import datetime
import logging
import random
from v4_client_py.chain.aerial.wallet import LocalWallet
from v4_client_py.clients.dydx_subaccount import Subaccount
from v4_proto.dydxprotocol.clob.order_pb2 import Order

from v4_client_py.clients.dydx_validator_client import ValidatorClient
from v4_client_py.clients.constants import BECH32_PREFIX, Network
from v4_client_py.clients.helpers.chain_helpers import ORDER_FLAGS_SHORT_TERM
from examples.utils import loadJson

from tests.constants import DYDX_TEST_MNEMONIC

PERPETUAL_PAIR_BTC_USD = 0

default_order = {
    "client_id": 0,
    "order_flags": ORDER_FLAGS_SHORT_TERM,
    "clob_pair_id": PERPETUAL_PAIR_BTC_USD,
    "side": Order.SIDE_BUY,
    "quantums": 1_000_000_000,
    "subticks": 1_000_000_000,
    "time_in_force": Order.TIME_IN_FORCE_UNSPECIFIED,
    "reduce_only": False,
    "client_metadata": 0,
}

def dummy_order(height):
    placeOrder = default_order.copy()
    placeOrder["client_id"] = random.randint(0, 1000000000)
    placeOrder["good_til_block"] = height + 3
    # placeOrder["goodTilBlockTime"] = height + 3
    random_num = random.randint(0, 1000)
    if random_num % 2 == 0:
        placeOrder["side"] = Order.SIDE_BUY
    else:
        placeOrder["side"] = Order.SIDE_SELL
    return placeOrder

async def main() -> None:
    network = Network.testnet()
    client = ValidatorClient(network.validator_config)
    wallet = LocalWallet.from_mnemonic(DYDX_TEST_MNEMONIC, BECH32_PREFIX);
    subaccount = Subaccount(wallet, 0)
    ordersParams = loadJson('raw_orders.json')
    for orderParams in ordersParams:
        last_block = client.get.latest_block()
        height = last_block.block.header.height

        place_order = dummy_order(height)

        place_order["time_in_force"] = orderParams["timeInForce"]
        place_order["reduce_only"] = False  # reduceOnly is currently disabled
        place_order["order_flags"] = orderParams["orderFlags"]
        place_order["side"] = orderParams["side"]
        place_order["quantums"] = orderParams["quantums"]
        place_order["subticks"] = orderParams["subticks"]
        try:
            if place_order["order_flags"] != 0:
                place_order["good_til_block"] = 0

                now = datetime.datetime.now()
                interval = datetime.timedelta(seconds=60)
                future = now + interval
                place_order["good_til_block_time"] = int(future.timestamp())
            else:
                place_order["good_til_block_time"] = 0

            tx = client.post.place_order_object(subaccount, place_order)
            print('**Order Tx**')
            print(tx)
        except Exception as error:
            print('**Order Failed**')
            print(str(error))
            if not error.args[0].startswith('FillOrKill order could not be fully filled'):
                assert False

        await asyncio.sleep(5)  # wait for placeOrder to complete

def test_trades():
    logging.basicConfig(level=logging.INFO)
    asyncio.get_event_loop().run_until_complete(main())
