"""Example for trading with human readable numbers

Usage: python -m examples.composite_example
"""
import asyncio
import logging
from random import randrange
from v4_client_py.chain.aerial.wallet import LocalWallet
from v4_client_py.clients import CompositeClient, Subaccount
from v4_client_py.clients.constants import BECH32_PREFIX, Network

from v4_client_py.clients.helpers.chain_helpers import (
    ORDER_FLAGS_SHORT_TERM,
    Order_TimeInForce,
    OrderSide,
)
from tests.constants import DYDX_TEST_MNEMONIC, MAX_CLIENT_ID


async def main() -> None:
    wallet = LocalWallet.from_mnemonic(DYDX_TEST_MNEMONIC, BECH32_PREFIX)
    network = Network.config_network()
    client = CompositeClient(
        network,
    )
    subaccount = Subaccount(wallet, 0)

    # place a short term order.
    short_term_client_id = randrange(0, MAX_CLIENT_ID)
    # Get the expiration block.
    current_block = client.get_current_block()
    next_valid_block_height = current_block + 1
    # Note, you can change this to any number between `next_valid_block_height` to `next_valid_block_height + SHORT_BLOCK_WINDOW`
    good_til_block = next_valid_block_height + 10

    try:
        tx = client.place_short_term_order(
            subaccount,
            market="ETH-USD",
            side=OrderSide.SELL,
            price=40000,
            size=0.01,
            client_id=short_term_client_id,
            good_til_block=good_til_block,
            time_in_force=Order_TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
            reduce_only=False,
        )
        print("**Short Term Order Tx**")
        print(tx.tx_hash)
    except Exception as error:
        print("**Short Term Order Failed**")
        print(str(error))

    # cancel a short term order.
    try:
        tx = client.cancel_order(
            subaccount,
            short_term_client_id,
            "ETH-USD",
            ORDER_FLAGS_SHORT_TERM,
            good_til_time_in_seconds=0,  # short term orders use GTB.
            good_til_block=good_til_block,  # GTB should be the same or greater than order to cancel
        )
        print("**Cancel Short Term Order Tx**")
        print(tx.tx_hash)
    except Exception as error:
        print("**Cancel Short Term Order Failed**")
        print(str(error))


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.get_event_loop().run_until_complete(main())
