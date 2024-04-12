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
    ORDER_FLAGS_LONG_TERM,
    OrderType,
    OrderSide,
    OrderTimeInForce,
    OrderExecution,
)

from tests.constants import DYDX_TEST_MNEMONIC, MAX_CLIENT_ID


async def main() -> None:
    wallet = LocalWallet.from_mnemonic(DYDX_TEST_MNEMONIC, BECH32_PREFIX)
    network = Network.config_network()
    client = CompositeClient(
        network,
    )
    subaccount = Subaccount(wallet, 0)

    """
    Note this example places a stateful order.
    Programmatic traders should generally not use stateful orders for following reasons:
    - Stateful orders received out of order by validators will fail sequence number validation
        and be dropped.
    - Stateful orders have worse time priority since they are only matched after they are included
        on the block.
    - Stateful order rate limits are more restrictive than Short-Term orders, specifically max 2 per
        block / 20 per 100 blocks.
    - Stateful orders can only be canceled after they’ve been included in a block.
    """
    long_term_order_client_id = randrange(0, MAX_CLIENT_ID)
    try:
        tx = client.place_order(
            subaccount,
            market="ETH-USD",
            type=OrderType.LIMIT,
            side=OrderSide.SELL,
            price=40000,
            size=0.01,
            client_id=long_term_order_client_id,
            time_in_force=OrderTimeInForce.GTT,
            good_til_block=0,  # long term orders use GTBT
            good_til_time_in_seconds=60,
            execution=OrderExecution.DEFAULT,
            post_only=False,
            reduce_only=False,
        )
        print("** Long Term Order Tx**")
        print(tx.tx_hash)
    except Exception as error:
        print("**Long Term Order Failed**")
        print(str(error))

    # cancel a long term order.
    try:
        tx = client.cancel_order(
            subaccount,
            long_term_order_client_id,
            "ETH-USD",
            ORDER_FLAGS_LONG_TERM,
            good_til_time_in_seconds=120,
            good_til_block=0,  # long term orders use GTBT
        )
        print("**Cancel Long Term Order Tx**")
        print(tx.tx_hash)
    except Exception as error:
        print("**Cancel Long Term Order Failed**")
        print(str(error))


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.get_event_loop().run_until_complete(main())
