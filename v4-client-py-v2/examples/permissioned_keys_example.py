import asyncio
import random

from v4_proto.dydxprotocol.clob.order_pb2 import Order

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from dydx_v4_client.indexer.rest.constants import OrderType
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.authenticators import Authenticator, AuthenticatorType
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market
from dydx_v4_client.node.subaccount import SubaccountInfo
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
    owner_subaccount = SubaccountInfo.for_wallet(wallet, 0)

    # Set up the "trader" wallet
    trader_wallet = await Wallet.from_mnemonic(
        node,
        mnemonic=DYDX_TEST_MNEMONIC_2,
        address=TEST_ADDRESS_2,
    )

    # Authenticate the "trader" wallet to place orders
    place_order_auth = Authenticator.compose(
        AuthenticatorType.AllOf,
        [
            Authenticator.signature_verification(trader_wallet.public_key.key),
            Authenticator.message_filter("/dydxprotocol.clob.MsgPlaceOrder"),
        ],
    )

    response = await node.add_authenticator(owner_subaccount, place_order_auth)

    print(f"Added authenticator: {response}")
    assert response.tx_response.code == 0, response

    print("Waiting for authenticator to be added... (might be to short)")
    await asyncio.sleep(3)

    # Place an order on behalf of the "wallet"
    authenticators = await node.get_authenticators(wallet.address)
    # print(f"Got authenticators:\n {authenticators}")

    # Let's print the authenticator
    last_auth = authenticators.account_authenticators[-1]
    print(f"Last authenticator in the account auths is possibly ours: {last_auth}")
    last_auth_id = last_auth.id
    # exit(0)

    # Create a permissioned subaccount for the trader wallet
    permissioned_subaccount = SubaccountInfo.for_permissioned_wallet(
        trader_wallet,
        TEST_ADDRESS,  # Account address
        0,  # Subaccount number
        [last_auth_id],  # Authenticator IDs
    )

    market = Market(
        (await indexer.markets.get_perpetual_markets(MARKET_ID))["markets"][MARKET_ID]
    )
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
    response = await node.place_order(
        permissioned_subaccount,
        order,
    )
    print(f"Placed order: {response}")
    assert response.tx_response.code == 0

    # Remove the authenticator
    response = await node.remove_authenticator(owner_subaccount, last_auth_id)
    print(f"Removed authenticator: {response}")


if __name__ == "__main__":
    asyncio.run(authenticator_example())
