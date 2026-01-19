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
from dydx_v4_client.node.market import Market, since_now
from dydx_v4_client.wallet import Wallet
from tests.conftest import (
    DYDX_TEST_MNEMONIC_3,
    DYDX_TEST_MNEMONIC_2,
    TEST_ADDRESS_3,
    TEST_ADDRESS_2,
)
from v4_proto.dydxprotocol.clob.tx_pb2 import OrderBatch
from v4_proto.dydxprotocol.subaccounts.subaccount_pb2 import SubaccountId


MARKET_ID = "ENA-USD"
PERPETUAL_PAIR_BTC_USD = 127

async def authenticator_example():
    node = await NodeClient.connect(TESTNET.node)
    indexer = IndexerClient(TESTNET.rest_indexer)


    # Set up the primary wallet for which we want to add authenticator
    wallet = await Wallet.from_mnemonic(
        node,
        mnemonic=DYDX_TEST_MNEMONIC_3,
        address=TEST_ADDRESS_3,
    )

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

    response = await node.add_authenticator(wallet, place_order_auth)
    print(f"Added authenticator: {response}")
    assert response.tx_response.code == 0, response

    print("Waiting for authenticator to be added...")
    await asyncio.sleep(3)

    # Refresh wallet account info after adding authenticator
    account = await node.get_account(wallet.address)
    wallet.sequence = account.sequence
    wallet.account_number = account.account_number

    # Get the authenticator
    authenticators = await node.get_authenticators(wallet.address)
    last_auth = authenticators.account_authenticators[-1]
    print(f"Using authenticator: {last_auth.id}")
    last_auth_id = last_auth.id

    tx_options = TxOptions(
        authenticators=[last_auth_id],
        sequence=wallet.sequence,
        account_number=wallet.account_number,
    )

    market = Market(
        (await indexer.markets.get_perpetual_markets(MARKET_ID))["markets"][MARKET_ID]
    )
    current_block = await node.latest_block_height()
    good_til_block = current_block + 1 + 10
    order_id = market.order_id(
        TEST_ADDRESS_3, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
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
    response = await node.place_order(trader_wallet, order, tx_options)
    print(f"Placed short-term order: {response}")
    assert response.tx_response.code == 0

    # Wait for transaction to be processed
    await asyncio.sleep(3)

    # Refresh wallet account info after placing order
    account = await node.get_account(wallet.address)
    wallet.sequence = account.sequence
    wallet.account_number = account.account_number

    # Remove the authenticator
    response = await node.remove_authenticator(wallet, last_auth_id)
    print(f"Removed authenticator: {response}")


async def long_term_order_example(node, wallet, trader_wallet, indexer):
    """Demonstrate placing a long-term order using permission keys."""
    print("\n=== Long-Term Order with Permission Keys ===")

    # Authenticate the "trader" wallet to place orders
    place_order_auth = Authenticator.compose(
        AuthenticatorType.AllOf,
        [
            Authenticator.signature_verification(trader_wallet.public_key.key),
            Authenticator.message_filter("/dydxprotocol.clob.MsgPlaceOrder"),
        ],
    )

    response = await node.add_authenticator(wallet, place_order_auth)
    print(f"Added authenticator: {response}")
    assert response.tx_response.code == 0, response

    print("Waiting for authenticator to be added...")
    await asyncio.sleep(3)

    # Refresh wallet account info after adding authenticator
    account = await node.get_account(wallet.address)
    wallet.sequence = account.sequence
    wallet.account_number = account.account_number

    # Get the authenticator
    authenticators = await node.get_authenticators(wallet.address)
    last_auth = authenticators.account_authenticators[-1]
    print(f"Using authenticator: {last_auth.id}")
    last_auth_id = last_auth.id

    tx_options = TxOptions(
        authenticators=[last_auth_id],
        sequence=wallet.sequence,
        account_number=wallet.account_number,
    )

    market = Market(
        (await indexer.markets.get_perpetual_markets(MARKET_ID))["markets"][MARKET_ID]
    )
    order_id = market.order_id(
        TEST_ADDRESS, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.LONG_TERM
    )

    order = market.order(
        order_id,
        OrderType.LIMIT,
        Order.Side.SIDE_SELL,
        size=0.01,
        price=40000,
        time_in_force=Order.TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        reduce_only=False,
        good_til_block_time=since_now(seconds=60),
    )
    response = await node.place_order(trader_wallet, order, tx_options)
    print(f"Placed long-term order: {response}")
    assert response.tx_response.code == 0

    # Wait for transaction to be processed
    await asyncio.sleep(3)

    # Refresh wallet account info after placing order
    account = await node.get_account(wallet.address)
    wallet.sequence = account.sequence
    wallet.account_number = account.account_number

    # Remove the authenticator
    response = await node.remove_authenticator(wallet, last_auth_id)
    print(f"Removed authenticator: {response}")


async def cancel_order_example(node, wallet, trader_wallet, indexer):
    """Demonstrate canceling an order using permission keys."""
    print("\n=== Cancel Order with Permission Keys ===")

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

    print("Waiting for authenticator to be added...")
    await asyncio.sleep(3)

    # Refresh wallet account info after adding authenticator
    account = await node.get_account(wallet.address)
    wallet.sequence = account.sequence
    wallet.account_number = account.account_number

    # Get the authenticator
    authenticators = await node.get_authenticators(wallet.address)
    last_auth = authenticators.account_authenticators[-1]
    print(f"Using authenticator: {last_auth.id}")
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


async def batch_cancel_example(node, wallet, trader_wallet, indexer):
    """Demonstrate batch canceling orders using permission keys."""
    print("\n=== Batch Cancel with Permission Keys ===")

    market = Market(
        (await indexer.markets.get_perpetual_markets(MARKET_ID_BTC))["markets"][
            MARKET_ID_BTC
        ]
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

    print("Waiting for authenticator to be added...")
    await asyncio.sleep(3)

    # Refresh wallet account info after adding authenticator
    account = await node.get_account(wallet.address)
    wallet.sequence = account.sequence
    wallet.account_number = account.account_number

    # Get the authenticator
    authenticators = await node.get_authenticators(wallet.address)
    last_auth = authenticators.account_authenticators[-1]
    print(f"Using authenticator: {last_auth.id}")
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
    print(f"Successful: {resp_code == 0}")
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


async def refresh_wallet(node, wallet):
    """Refresh wallet account info from the chain."""
    account = await node.get_account(wallet.address)
    wallet.sequence = account.sequence
    wallet.account_number = account.account_number


async def main():
    """Run all permission key examples."""
    node = await NodeClient.connect(TESTNET.node)
    indexer = IndexerClient(TESTNET.rest_indexer)

    # Set up the primary wallet for which we want to add authenticators
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

    # Run all examples, refreshing wallet between each
    await short_term_order_example(node, wallet, trader_wallet, indexer)
    await refresh_wallet(node, wallet)
    await asyncio.sleep(3)  # Wait a bit between examples

    await long_term_order_example(node, wallet, trader_wallet, indexer)
    await refresh_wallet(node, wallet)
    await asyncio.sleep(3)  # Wait a bit between examples

    await cancel_order_example(node, wallet, trader_wallet, indexer)
    await refresh_wallet(node, wallet)
    await asyncio.sleep(3)  # Wait a bit between examples

    await batch_cancel_example(node, wallet, trader_wallet, indexer)

    print("\n=== All examples completed successfully! ===")


if __name__ == "__main__":
    asyncio.run(main())
