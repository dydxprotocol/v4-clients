import asyncio
import time

from v4_proto.dydxprotocol.clob.order_pb2 import Order

from dydx_v4_client.indexer.rest.constants import OrderType, OrderStatus
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3

MARKET_ID = "ETH-USD"

# Scale order configuration
NUM_ORDERS = 5
TOTAL_SIZE = 0.05  # Total size spread across all orders
PRICE_OFFSET_LOW_PCT = 5  # % below oracle for start price
PRICE_OFFSET_HIGH_PCT = 2  # % below oracle for end price
SKEW = 1.5  # >1 concentrates prices toward start, <1 toward end, 1 = linear


async def place_scale_order_example():
    """
    Demonstrates placing a BUY scale order: multiple limit orders
    distributed across a price range below the current oracle price,
    with configurable skew for non-linear price spacing.
    """
    print("=" * 60)
    print("SCALE ORDER EXAMPLE")
    print("=" * 60)

    # Initialize clients
    node = await NodeClient.connect(TESTNET.node)
    indexer = IndexerClient(TESTNET.rest_indexer)

    market = Market(
        (await indexer.markets.get_perpetual_markets(MARKET_ID))["markets"][MARKET_ID]
    )
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3)

    oracle_price = float(market.market["oraclePrice"])
    start_price = oracle_price * (1 - PRICE_OFFSET_LOW_PCT / 100)
    end_price = oracle_price * (1 - PRICE_OFFSET_HIGH_PCT / 100)

    # Preview the price distribution
    prices = NodeClient._generate_skewed_prices(
        start_price, end_price, NUM_ORDERS, SKEW
    )

    print(f"Market: {MARKET_ID}")
    print(f"Oracle Price: ${oracle_price:.2f}")
    print(f"Side: BUY")
    print(f"Total Size: {TOTAL_SIZE}")
    print(f"Number of Orders: {NUM_ORDERS}")
    print(f"Size per Order: {TOTAL_SIZE / NUM_ORDERS:.6f}")
    print(f"Price Range: ${start_price:.2f} - ${end_price:.2f}")
    print(f"Skew: {SKEW}")
    print(f"Price levels: {['${:.2f}'.format(p) for p in prices]}")
    print()

    # Place the scale order
    print("Placing scale order...")
    results = await node.place_scale_order(
        wallet=wallet,
        market=market,
        address=TEST_ADDRESS_3,
        subaccount_number=0,
        side=Order.Side.SIDE_BUY,
        total_size=TOTAL_SIZE,
        start_price=start_price,
        end_price=end_price,
        num_orders=NUM_ORDERS,
        skew=SKEW,
        good_til_block_time=int(time.time() + 600),
    )

    print(f"Placed {len(results)} orders:")
    for i, (order_id, response) in enumerate(results):
        status = "OK" if response.tx_response.code == 0 else "FAILED"
        print(
            f"  Order {i + 1}: price=${prices[i]:.2f}, "
            f"size={TOTAL_SIZE / NUM_ORDERS:.6f}, status={status}"
        )
    print()

    # Wait and verify
    await asyncio.sleep(5)

    orders = await indexer.account.get_subaccount_orders(
        TEST_ADDRESS_3, 0, status=OrderStatus.OPEN
    )
    print(f"Open orders on book: {len(orders)}")

    # Cleanup: cancel all placed orders
    print("\nCancelling orders...")
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3)
    for order_id, _ in results:
        try:
            await node.cancel_order(
                wallet=wallet,
                order_id=order_id,
                good_til_block_time=int(time.time() + 600),
            )
            wallet.sequence += 1
            await asyncio.sleep(1)
        except Exception as e:
            print(f"  Cancel failed (may already be filled): {e}")

    print("Done.")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(place_scale_order_example())
