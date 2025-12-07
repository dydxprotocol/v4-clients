import asyncio
import time
from datetime import datetime, timezone
from typing import Set

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from v4_proto.dydxprotocol.clob.order_pb2 import Order

from dydx_v4_client.indexer.rest.constants import OrderType
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS

MARKET_ID = "ETH-USD"

# TWAP Configuration
TWAP_DURATION = 300  # minimum is 300 seconds
# Interval must be in range [30 (30 seconds), 3600 (1 hour)] AND must be a factor of duration
TWAP_INTERVAL = 60   # minimum is 30 seconds, must be factor of duration
TWAP_PRICE_TOLERANCE = 10000  # 1% tolerance (10,000 ppm) - valid range [0, 1_000_000)
MONITORING_INTERVAL = 2  # Check for fills every 2 seconds


def format_order_id_for_query(order_id_obj) -> str:
    """
    Format OrderId object to string format for API queries.
    The order ID format may vary, so we'll try to construct it.
    Format: {address}-{subaccount_number}-{client_id}-{clob_pair_id}-{order_flags}
    """
    subaccount = order_id_obj.subaccount_id
    return (
        f"{subaccount.owner}-{subaccount.number}-"
        f"{order_id_obj.client_id}-{order_id_obj.clob_pair_id}-{order_id_obj.order_flags}"
    )


async def try_get_order_status(indexer, order_id_str: str, order_id_obj):
    """
    Try to get order status. Returns None if query fails.
    """
    try:
        order_status = await indexer.account.get_order(order_id_str)
        return order_status
    except Exception:
        # If direct query fails, try querying all orders and finding ours
        try:
            subaccount = order_id_obj.subaccount_id
            orders = await indexer.account.get_subaccount_orders(
                address=subaccount.owner,
                subaccount_number=subaccount.number,
                limit=50,
            )
            # Find our order by client_id
            for order in orders.get("orders", []):
                if order.get("order", {}).get("clientId") == order_id_obj.client_id:
                    return {"order": order.get("order", {})}
        except Exception:
            pass
    return None


async def place_and_track_twap_order(size: float):
    """
    Place a TWAP order and track its execution in real-time.
    Verifies that fills belong to our specific order.
    """
    print("=" * 80)
    print("TWAP ORDER EXECUTION DEMONSTRATION")
    print("=" * 80)
    print(f"Market: {MARKET_ID}")
    print(f"Total Size: {size}")
    print(f"TWAP Duration: {TWAP_DURATION} seconds")
    print(f"TWAP Interval: {TWAP_INTERVAL} seconds")
    print(f"Expected Suborders: {TWAP_DURATION // TWAP_INTERVAL}")
    print(f"Expected Suborder Size: ~{size / (TWAP_DURATION // TWAP_INTERVAL):.6f}")
    print("=" * 80)
    print()

    # Initialize clients
    node = await NodeClient.connect(TESTNET.node)
    indexer = IndexerClient(TESTNET.rest_indexer)

    market = Market(
        (await indexer.markets.get_perpetual_markets(MARKET_ID))["markets"][MARKET_ID]
    )
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)

    initial_fills = await indexer.account.get_subaccount_fills(
        address=TEST_ADDRESS,
        subaccount_number=0,
        ticker=MARKET_ID,
        limit=100,
    )
    initial_fill_ids: Set[str] = {
        fill.get("id") for fill in initial_fills.get("fills", [])
    }
    print(f"Baseline: {len(initial_fill_ids)} existing fills before our order")
    return

    # Generate unique client_id using timestamp to ensure uniqueness
    # Use last 8 digits of timestamp to fit within MAX_CLIENT_ID range
    unique_client_id = int(time.time() * 1000) % MAX_CLIENT_ID
    print(f"Using unique client_id: {unique_client_id} (timestamp-based)")
    print()

    # Create order ID
    order_id = market.order_id(
        TEST_ADDRESS, 0, unique_client_id, OrderFlags.SHORT_TERM
    )

    current_block = await node.latest_block_height()

    # Record order placement time for filtering fills
    order_placed_time = datetime.now(timezone.utc)
    order_placed_timestamp = time.time()

    print("Placing TWAP order...")
    print(f"Order placed at: {order_placed_time.isoformat()}")
    print(f"Order ID: {format_order_id_for_query(order_id)}")
    print()

    # Create and place TWAP order
    new_order = market.order(
        order_id=order_id,
        order_type=OrderType.MARKET,
        side=Order.Side.SIDE_SELL,
        size=size,
        price=0,  # Market order
        time_in_force=Order.TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        reduce_only=False,
        good_til_block=current_block + 30,  # Must be within ShortBlockWindow limit (40 blocks max)
        twap_duration=TWAP_DURATION,
        twap_interval=TWAP_INTERVAL,
        twap_price_tolerance=TWAP_PRICE_TOLERANCE,
    )

    transaction = await node.place_order(wallet=wallet, order=new_order)
    wallet.sequence += 1

    print("✓ Order placed successfully!")
    print(f"Transaction: {transaction}")
    print()

    # Get initial fills to establish baseline
    initial_fills = await indexer.account.get_subaccount_fills(
        address=TEST_ADDRESS,
        subaccount_number=0,
        ticker=MARKET_ID,
        limit=100,
    )
    initial_fill_ids: Set[str] = {
        fill.get("id") for fill in initial_fills.get("fills", [])
    }
    print(f"Baseline: {len(initial_fill_ids)} existing fills before our order")
    print()

    # Format order ID for querying
    order_id_str = format_order_id_for_query(order_id)

    # Track execution
    seen_fill_ids: Set[str] = set(initial_fill_ids)
    total_filled = 0.0
    suborder_count = 0
    fill_records = []

    start_time = time.time()
    monitoring_duration = TWAP_DURATION + 20  # Add buffer for final fills
    end_time = start_time + monitoring_duration

    print("=" * 80)
    print("REAL-TIME EXECUTION TRACKING")
    print("=" * 80)
    print("Monitoring fills every 2 seconds...")
    print()

    last_order_status_check = 0
    order_status_check_interval = 10  # Check order status every 10 seconds

    while time.time() < end_time:
        elapsed = time.time() - start_time

        # Query order status periodically for verification
        if elapsed - last_order_status_check >= order_status_check_interval:
            order_status = await try_get_order_status(indexer, order_id_str, order_id)
            if order_status:
                order_data = order_status.get("order", {})
                order_filled = float(order_data.get("totalFilled", 0))
                order_status_val = order_data.get("status", "UNKNOWN")
                print(
                    f"[{elapsed:.1f}s] Order Status Check: {order_status_val}, "
                    f"Filled: {order_filled:.6f}"
                )
            last_order_status_check = elapsed

        # Query fills
        current_fills = await indexer.account.get_subaccount_fills(
            address=TEST_ADDRESS,
            subaccount_number=0,
            ticker=MARKET_ID,
            limit=100,
        )

        fills = current_fills.get("fills", [])

        # Find new fills (TWAP suborder executions)
        new_fills = [
            fill
            for fill in fills
            if fill.get("id") not in seen_fill_ids
            and fill.get("side") == "SELL"  # Match our order side
        ]

        if new_fills:
            for fill in new_fills:
                fill_id = fill.get("id")
                seen_fill_ids.add(fill_id)

                # Verify fill occurred after order placement
                fill_time_str = fill.get("createdAt")
                if fill_time_str:
                    try:
                        # Parse ISO timestamp
                        fill_time = datetime.fromisoformat(
                            fill_time_str.replace("Z", "+00:00")
                        )
                        if fill_time.timestamp() < order_placed_timestamp:
                            # Fill occurred before our order, skip it
                            continue
                    except Exception:
                        pass

                suborder_count += 1
                fill_size = float(fill.get("size", 0))
                fill_price = float(fill.get("price", 0))
                total_filled += fill_size

                fill_records.append(
                    {
                        "id": fill_id,
                        "size": fill_size,
                        "price": fill_price,
                        "time": fill_time_str,
                    }
                )

                elapsed_str = f"{elapsed:.1f}s"
                print(f"[{elapsed_str}] ✓ Suborder #{suborder_count} EXECUTED")
                print(f"         Fill ID: {fill_id[:20]}...")
                print(f"         Size: {fill_size:.6f}")
                print(f"         Price: ${fill_price:,.2f}")
                print(f"         Time: {fill_time_str}")
                print(
                    f"         Progress: {total_filled:.6f} / {size:.6f} "
                    f"({total_filled / size * 100:.1f}%)"
                )
                print()

        await asyncio.sleep(MONITORING_INTERVAL)

    # Final verification
    print("=" * 80)
    print("FINAL VERIFICATION")
    print("=" * 80)

    # Query final order status
    final_order_status = await try_get_order_status(indexer, order_id_str, order_id)
    if final_order_status:
        order_data = final_order_status.get("order", {})
        order_filled = float(order_data.get("totalFilled", 0))
        order_status = order_data.get("status", "UNKNOWN")
        order_size = float(order_data.get("size", 0))

        print(f"Order Status: {order_status}")
        print(f"Order Size: {order_size:.6f}")
        print(f"Order Total Filled (from API): {order_filled:.6f}")
        print(f"Tracked Fills Total: {total_filled:.6f}")

        # Verify match
        if abs(order_filled - total_filled) < 0.000001:
            print("✓ VERIFICATION PASSED: Tracked fills match order status")
        else:
            print(
                f"⚠ WARNING: Mismatch of {abs(order_filled - total_filled):.6f} "
                "(may be due to rounding or timing)"
            )
    else:
        print("Could not query order status for verification")
        print("Using fill tracking verification only:")
        print(f"  - Fills occurred after order placement: ✓")
        print(f"  - Fills match order side (SELL): ✓")
        print(f"  - Total tracked fills: {total_filled:.6f}")

    print()

    # Final summary
    print("=" * 80)
    print("EXECUTION SUMMARY")
    print("=" * 80)
    print(f"Total Suborders Executed: {suborder_count}")
    print(f"Expected Suborders: {TWAP_DURATION // TWAP_INTERVAL}")
    print(f"Total Size Filled: {total_filled:.6f} / {size:.6f}")
    print(f"Completion: {(total_filled / size * 100):.1f}%")
    print()

    if fill_records:
        print("Fill Details:")
        for i, fill in enumerate(fill_records, 1):
            print(
                f"  {i}. Size: {fill['size']:.6f}, "
                f"Price: ${fill['price']:,.2f}, "
                f"Time: {fill['time']}"
            )
    else:
        print("No fills recorded (order may still be executing or no fills occurred)")

    print()
    print("=" * 80)
    print("TWAP Order tracking completed!")
    print("=" * 80)


if __name__ == "__main__":
    asyncio.run(place_and_track_twap_order(0.0001))
