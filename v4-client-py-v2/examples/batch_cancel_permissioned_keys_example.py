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
from v4_proto.dydxprotocol.clob.tx_pb2 import OrderBatch
from v4_proto.dydxprotocol.subaccounts.subaccount_pb2 import SubaccountId


MARKET_ID = "BTC-USD"
PERPETUAL_PAIR_BTC_USD = 0


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

    # Place multiple orders using the primary wallet
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
        place_order_response = await node.place_order(wallet, order)
        print(f"Placed order: {place_order_response}")
        wallet.sequence += 1

    await asyncio.sleep(5)

    # Authenticate the "trader" wallet to batch cancel orders
    batch_cancel_auth = Authenticator.compose(
        AuthenticatorType.AllOf,
        [
            Authenticator.signature_verification(trader_wallet.public_key.key),
            Authenticator.message_filter("/dydxprotocol.clob.MsgBatchCancel"),
        ],
    )

    response = await node.add_authenticator(wallet, batch_cancel_auth)

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

    # Prepare batch cancel
    subaccount_id = SubaccountId(owner=TEST_ADDRESS, number=0)
    order_batch = OrderBatch(clob_pair_id=PERPETUAL_PAIR_BTC_USD, client_ids=client_ids)
    cancellation_current_block = await node.latest_block_height()

    # Execute batch cancel using permission keys
    batch_cancel_response = await node.batch_cancel_orders(
        trader_wallet,
        subaccount_id,
        [order_batch],
        cancellation_current_block + 10,
        tx_options=tx_options,
    )
    print(f"Batch cancel response: {batch_cancel_response}")
    resp_code = batch_cancel_response.tx_response.code
    print(f"Successful {resp_code == 0},")
    assert resp_code == 0

    # Wait for transaction to be processed
    await asyncio.sleep(3)

    # Refresh wallet account info after batch cancel
    account = await node.get_account(wallet.address)
    wallet.sequence = account.sequence
    wallet.account_number = account.account_number

    # Remove the authenticator
    response = await node.remove_authenticator(wallet, last_auth_id)
    print(f"Removed authenticator: {response}")


if __name__ == "__main__":
    asyncio.run(authenticator_example())
