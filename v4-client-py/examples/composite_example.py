'''Example for trading with human readable numbers

Usage: python -m examples.composite_example
'''
import asyncio
import logging
from random import randrange
from v4_client_py.chain.aerial.wallet import LocalWallet
from v4_client_py.clients import CompositeClient, Subaccount
from v4_client_py.clients.constants import BECH32_PREFIX, Network

from v4_client_py.clients.helpers.chain_helpers import (
    OrderType, 
    OrderSide, 
    OrderTimeInForce, 
    OrderExecution,
)
from examples.utils import loadJson

from tests.constants import DYDX_TEST_MNEMONIC


async def main() -> None:
    wallet = LocalWallet.from_mnemonic(DYDX_TEST_MNEMONIC, BECH32_PREFIX)
    network = Network.staging()
    client = CompositeClient(
        network,
    )
    subaccount = Subaccount(wallet, 0)
    ordersParams = loadJson('human_readable_orders.json')
    for orderParams in ordersParams:
        side = OrderSide[orderParams["side"]]

        # Get the expiration block.
        current_block = client.get_current_block()
        next_valid_block_height = current_block + 1
        # Note, you can change this to any number between `next_valid_block_height` to `next_valid_block_height + SHORT_BLOCK_WINDOW`
        good_til_block = next_valid_block_height + 3

        price = orderParams.get("price", 1350)
        try:
            tx = client.place_short_term_order(
                subaccount,
                market='ETH-USD',
                side=side,
                price=price,
                size=0.01,
                client_id=randrange(0, 100000000),
                good_til_block=good_til_block,
                time_in_force=OrderExecution.DEFAULT,
                reduce_only=False
            )
            print('**Order Tx**')
            print(tx)
        except Exception as error:
            print('**Order Failed**')
            print(str(error))

        await asyncio.sleep(5)  # wait for placeOrder to complete


    try:
        tx = client.place_order(
            subaccount,
            market='ETH-USD',
            type=OrderType.STOP_MARKET,
            side=OrderSide.SELL,
            price=900.0,
            size=0.01,
            client_id=randrange(0, 100000000),
            time_in_force=OrderTimeInForce.GTT,
            good_til_time_in_seconds=1000,
            execution=OrderExecution.IOC,
            post_only=False,
            reduce_only=False,
            trigger_price=1000,
        )
        print('**Order Tx**')
        print(tx)
    except Exception as error:
        print('**Order Failed**')
        print(str(error))
if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    asyncio.get_event_loop().run_until_complete(main())
