import asyncio
import json
import random
import time
from pathlib import Path

from dydx_v4_client import MAX_CLIENT_ID
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.message import order, order_id
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS
from google.protobuf.json_format import MessageToJson

PERPETUAL_PAIR_BTC_USD = 0

with open(Path(__file__).parent / "raw_orders.json", "r") as file:
    orders = json.load(file)


async def test():
    node = await NodeClient.connect(TESTNET.node)
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)

    for order_dict in orders:
        id = order_id(
            TEST_ADDRESS,
            0,
            random.randint(0, MAX_CLIENT_ID),
            PERPETUAL_PAIR_BTC_USD,
            order_dict["orderFlags"],
        )

        good_til_block = None
        good_til_block_time = round(time.time() + 60)
        if order_dict["orderFlags"] == 0:
            good_til_block_time = None
            current_block = await node.latest_block_height()
            good_til_block = current_block + 3

        place = await node.place_order(
            wallet,
            order(
                id,
                order_dict["side"],
                quantums=order_dict["quantums"],
                subticks=order_dict["subticks"],
                time_in_force=order_dict["timeInForce"],
                reduce_only=False,
                good_til_block=good_til_block,
                good_til_block_time=good_til_block_time,
            ),
        )
        print("**Order Tx**")
        print(MessageToJson(place, always_print_fields_with_no_presence=True))
        # FIXME: Remove
        wallet.sequence += 1
        time.sleep(5)


asyncio.run(test())
