import asyncio
import random

from v4_proto.dydxprotocol.clob.order_pb2 import Order

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from dydx_v4_client.indexer.rest.constants import OrderType
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.authenticators import Authenticator, AuthenticatorType
from dydx_v4_client.node.builder import TxOptions
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market
from dydx_v4_client.wallet import Wallet
from tests.conftest import (
    DYDX_TEST_MNEMONIC,
    DYDX_TEST_MNEMONIC_2,
    TEST_ADDRESS,
    TEST_ADDRESS_2,
)

MARKET_ID = "ETH-USD"


async def authenticator_example():
    node = await NodeClient.connect(TESTNET.node)
    indexer = IndexerClient(TESTNET.rest_indexer)

    # Set up the primary wallet for which we want to add authenticator
    wallet = await Wallet.from_mnemonic(
        node,
        mnemonic=DYDX_TEST_MNEMONIC,
        address=TEST_ADDRESS,
    )

    # Set up the "trader" wallet
    trader_wallet = await Wallet.from_mnemonic(
        node,
        mnemonic=DYDX_TEST_MNEMONIC_2,
        address=TEST_ADDRESS_2,
    )

    market = Market(
        (await indexer.markets.get_perpetual_markets(MARKET_ID))["markets"][MARKET_ID]
    )

    # First, place an order using the primary wallet
    current_block = await node.latest_block_height()
    good_til_block = current_block + 1 + 10
    order_id = market.order_id(
        TEST_ADDRESS, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )

    order = market.order(
        order_id,
        OrderType.LIMIT,
        Order.Side.SIDE_SELL,
        size=0.01,
        price=40000,
        time_in_force=Order.TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        reduce_only=False,
        good_til_block=good_til_block,
    )
    place_response = await node.place_order(wallet, order)
    print(f"Placed order: {place_response}")
    assert place_response.tx_response.code == 0

    wallet.sequence += 1
    await asyncio.sleep(5)

    # Authenticate the "trader" wallet to cancel orders
    cancel_order_auth = Authenticator.compose(
        AuthenticatorType.AllOf,
        [
            Authenticator.signature_verification(trader_wallet.public_key.key),
            Authenticator.message_filter("/dydxprotocol.clob.MsgCancelOrder"),
        ],
    )

    response = await node.add_authenticator(wallet, cancel_order_auth)

    print(f"Added authenticator: {response}")
    assert response.tx_response.code == 0, response

    print("Waiting for authenticator to be added... (might be to short)")
    await asyncio.sleep(3)

    # Refresh wallet account info after adding authenticator
    account = await node.get_account(wallet.address)
    wallet.sequence = account.sequence
    wallet.account_number = account.account_number

    # Get the authenticator
    authenticators = await node.get_authenticators(wallet.address)
    last_auth = authenticators.account_authenticators[-1]
    print(f"Last authenticator in the account auths is possibly ours: {last_auth}")
    last_auth_id = last_auth.id

    tx_options = TxOptions(
        authenticators=[last_auth_id],
        sequence=wallet.sequence,
        account_number=wallet.account_number,
    )

    # Cancel the order using permission keys
    cancel_response = await node.cancel_order(
        trader_wallet,
        order_id,
        good_til_block=good_til_block + 10,
        tx_options=tx_options,
    )
    print(f"Canceled order: {cancel_response}")
    assert cancel_response.tx_response.code == 0

    # Wait for transaction to be processed
    await asyncio.sleep(3)

    # Refresh wallet account info after canceling order
    account = await node.get_account(wallet.address)
    wallet.sequence = account.sequence
    wallet.account_number = account.account_number

    # Remove the authenticator
    response = await node.remove_authenticator(wallet, last_auth_id)
    print(f"Removed authenticator: {response}")


if __name__ == "__main__":
    asyncio.run(authenticator_example())
