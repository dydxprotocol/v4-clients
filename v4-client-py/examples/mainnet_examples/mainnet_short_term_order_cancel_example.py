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
from tests.constants import MAX_CLIENT_ID, DYDX_TEST_MNEMONIC

MNEMONIC = DYDX_TEST_MNEMONIC

VALIDATOR_GRPC_ENDPOINT = "test-dydx-grpc.kingnodes.com:443"
AERIAL_CONFIG_URL = "https://test-dydx-grpc.kingnodes.com:443"
AERIAL_GRPC_OR_REST_PREFIX = "grpc"
INDEXER_REST_ENDPOINT = "https://dydx-testnet.imperator.co"
INDEXER_WS_ENDPOINT = "wss://indexer.v4testnet.dydx.exchange/v4/ws"
CHAIN_ID = "dydx-testnet-4"
ENV = "testnet"


# define objects to be used with the SDK
wallet = LocalWallet.from_mnemonic(MNEMONIC, BECH32_PREFIX)
network = Network.config_network(
    validator_grpc_endpoint=VALIDATOR_GRPC_ENDPOINT,
    rest_endpoint=INDEXER_REST_ENDPOINT,
    grpc_or_rest_prefix=AERIAL_GRPC_OR_REST_PREFIX,
    aerial_url=AERIAL_CONFIG_URL,
    websocket_endpoint=INDEXER_WS_ENDPOINT,
    chain_id=CHAIN_ID,
    env=ENV,
)
client = CompositeClient(
    network,
)
subaccount = Subaccount(wallet, 0)


def define_order() -> dict:
    return {
        "subaccount": subaccount,
        "market": "ETH-USD",
        "side": OrderSide.SELL,
        "price": 40000,
        "size": 0.01,
        "client_id": randrange(0, MAX_CLIENT_ID),
        "good_til_block": client.get_current_block() + 11,
        # Note, you can change this to any number between `current_block+1`
        # to `current_block+1 + SHORT_BLOCK_WINDOW`
        "time_in_force": Order_TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        "reduce_only": False,
    }


async def main() -> None:
    order = define_order()
    try:
        tx = client.place_short_term_order(
            subaccount=order["subaccount"],
            market=order["market"],
            side=order["side"],
            price=order["price"],
            size=order["size"],
            client_id=order["client_id"],
            good_til_block=order["good_til_block"],
            time_in_force=order["time_in_force"],
            reduce_only=order["reduce_only"],
        )
        print("**Short Term Order Tx**")
        print(tx.tx_hash)
    except Exception as error:
        print("**Short Term Order Failed**")
        print(error)

    # cancel a short term order.
    try:
        tx = client.cancel_order(
            subaccount=order["subaccount"],
            client_id=order["client_id"],
            market=order["market"],
            order_flags=ORDER_FLAGS_SHORT_TERM,
            good_til_time_in_seconds=0,  # short term orders use GTB.
            good_til_block=order["good_til_block"],  # GTB should be the same or greater than order to cancel
        )
        print("**Cancel Short Term Order Tx**")
        print(tx.tx_hash)
    except Exception as error:
        print("**Cancel Short Term Order Failed**")
        print(error)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.get_event_loop().run_until_complete(main())
