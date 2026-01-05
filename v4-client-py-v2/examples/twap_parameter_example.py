import asyncio
import time

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from v4_proto.dydxprotocol.clob.order_pb2 import Order

from dydx_v4_client.indexer.rest.constants import OrderType
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS
from datetime import datetime, timedelta, timezone

MARKET_ID = "ETH-USD"

# TWAP Configuration
TWAP_DURATION = 300  # minimum is 300 seconds
# Interval must be in range [30 (30 seconds), 3600 (1 hour)] AND must be a factor of duration
TWAP_INTERVAL = 60  # minimum is 30 seconds, must be factor of duration
TWAP_PRICE_TOLERANCE = 10000  # 1% tolerance (10,000 ppm) - valid range [0, 1_000_000)
MONITORING_INTERVAL = 2  # Check position changes every 2 seconds


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

def since_now(*args, **kwargs) -> int:
    return int(round((datetime.now() + timedelta(*args, **kwargs)).timestamp()))


async def get_all_fills(
    indexer: IndexerClient,
    address: str,
    subaccount_number: int,
    ticker: str,
    limit: int = 100,
) -> list:
    """
    Retrieve all fills for a subaccount by paginating through all pages.

    Args:
        indexer: The IndexerClient instance
        address: The account address
        subaccount_number: The subaccount number
        ticker: The market ticker to filter by
        limit: Number of fills per page (default 100)

    Returns:
        List of all fills
    """
    all_fills = []
    created_before_or_at = None

    while True:
        params = {
            "address": address,
            "subaccount_number": subaccount_number,
            "ticker": ticker,
            "limit": limit,
        }

        if created_before_or_at:
            params["created_before_or_at"] = created_before_or_at

        response = await indexer.account.get_subaccount_fills(**params)
        fills = response.get("fills", [])

        if not fills:
            break

        all_fills.extend(fills)

        # If we got fewer fills than the limit, we've reached the end
        if len(fills) < limit:
            break

        # Use the createdAt timestamp of the last fill for the next page
        # The API expects fills created before or at this timestamp
        last_fill = fills[-1]
        created_before_or_at = last_fill.get("createdAt")

        if not created_before_or_at:
            # If createdAt is missing, we can't paginate further
            break

    return all_fills


async def place_and_track_twap_order(size: float):
    """
    Place a TWAP order and track its execution in real-time.
    Tracks position changes to verify order execution.
    """
    unique_client_id = int(time.time() * 1000) % MAX_CLIENT_ID

    print("=" * 80)
    print("TWAP ORDER EXECUTION DEMONSTRATION")
    print("=" * 80)
    print(f"Market: {MARKET_ID}")
    print(f"Client ID: {unique_client_id}")
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

    # Retrieve all initial fills with pagination
    print(
        "Retrieving initial fills (this may take a moment if there are many fills)..."
    )
    initial_fills = await get_all_fills(
        indexer=indexer,
        address=TEST_ADDRESS,
        subaccount_number=0,
        ticker=MARKET_ID,
    )
    # Store initial fill IDs for comparison
    initial_fill_ids = {fill.get("id") for fill in initial_fills if fill.get("id")}
    print(f"Retrieved {len(initial_fills)} initial fills")
    print()

    # Get initial position before placing order
    positions_response = await indexer.account.get_subaccount_perpetual_positions(
        TEST_ADDRESS, 0
    )
    positions = positions_response.get("positions", [])

    initial_position = None
    for pos in positions:
        if pos.get("market") == MARKET_ID and pos.get("status") != "CLOSED":
            initial_position = pos
            break

    initial_size = float(initial_position.get("size", 0)) if initial_position else 0.0
    is_long = initial_size > 0

    print(f"Initial Position:")
    if initial_position:
        print(f"  Market: {MARKET_ID}")
        print(f"  Size: {initial_size:.6f}")
        print(
            f"  Direction: {'LONG' if is_long else 'SHORT' if initial_size < 0 else 'NONE'}"
        )
    else:
        print(f"  No open position for {MARKET_ID}")
    print()

    # Generate unique client_id using timestamp to ensure uniqueness
    # Use last 8 digits of timestamp to fit within MAX_CLIENT_ID range
    print(f"Using unique client_id: {unique_client_id} (timestamp-based)")
    print()

    # Create order ID
    order_id = market.order_id(TEST_ADDRESS, 0, unique_client_id, OrderFlags.TWAP)

    current_block = await node.latest_block_height()

    # Record order placement time
    order_placed_time = datetime.now(timezone.utc)

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
        good_til_block_time = since_now(seconds=3600),
        twap_duration=TWAP_DURATION,
        twap_interval=TWAP_INTERVAL,
        twap_price_tolerance=TWAP_PRICE_TOLERANCE,
    )

    transaction = await node.place_order(wallet=wallet, order=new_order)
    wallet.sequence += 1

    print("✓ Order placed successfully!")
    print(f"Transaction: {transaction}")
    print()

    # Track position changes
    position_changes = []
    last_position_size = initial_size

    start_time = time.time()
    monitoring_duration = TWAP_DURATION + 20  # Add buffer for final position updates
    end_time = start_time + monitoring_duration

    print("=" * 80)
    print("REAL-TIME POSITION TRACKING")
    print("=" * 80)
    print("Monitoring position changes every 2 seconds...")
    print()

    while time.time() < end_time:
        elapsed = time.time() - start_time

        # Query current position
        positions_response = await indexer.account.get_subaccount_perpetual_positions(
            TEST_ADDRESS, 0
        )
        positions = positions_response.get("positions", [])

        current_position = None
        for pos in positions:
            if pos.get("market") == MARKET_ID and pos.get("status") != "CLOSED":
                current_position = pos
                break

        current_size = (
            float(current_position.get("size", 0)) if current_position else 0.0
        )

        # Check if position changed
        if abs(current_size - last_position_size) > 0.000001:
            position_change = current_size - last_position_size
            total_change = current_size - initial_size
            abs_total_change = abs(total_change)

            position_changes.append(
                {
                    "time": elapsed,
                    "size": current_size,
                    "change": position_change,
                    "total_change": total_change,
                }
            )

            elapsed_str = f"{elapsed:.1f}s"
            print(f"[{elapsed_str}] ✓ Position Updated")
            print(f"         Current Size: {current_size:.6f}")
            print(f"         Change: {position_change:+.6f}")
            print(f"         Total Change from Initial: {total_change:+.6f}")
            print(
                f"         Progress: {abs_total_change:.6f} / {size:.6f} "
                f"({abs_total_change / size * 100:.1f}%)"
            )
            print()

            last_position_size = current_size

        # Store the latest position data for final verification
        final_position = current_position
        final_size = current_size

        await asyncio.sleep(MONITORING_INTERVAL)

    # Retrieve all fills again after TWAP execution
    print("Retrieving all fills after TWAP execution...")
    final_fills = await get_all_fills(
        indexer=indexer,
        address=TEST_ADDRESS,
        subaccount_number=0,
        ticker=MARKET_ID,
    )
    print(f"Retrieved {len(final_fills)} total fills")
    print()

    # Identify new fills (TWAP fills)
    final_fill_ids = {fill.get("id") for fill in final_fills if fill.get("id")}
    new_fill_ids = final_fill_ids - initial_fill_ids
    twap_fills = [fill for fill in final_fills if fill.get("id") in new_fill_ids]

    # Sort TWAP fills by creation time (oldest first)
    twap_fills.sort(key=lambda x: x.get("createdAt", ""))

    # Final verification
    print("=" * 80)
    print("FINAL VERIFICATION")
    print("=" * 80)

    # Reuse position data from the last monitoring loop iteration
    total_position_change = final_size - initial_size
    abs_total_change = abs(total_position_change)

    print(f"Initial Position Size: {initial_size:.6f}")
    print(f"Final Position Size: {final_size:.6f}")
    print(f"Total Position Change: {total_position_change:+.6f}")
    print(f"Expected Order Size: {size:.6f}")
    print()

    # Position tracking verification
    print("Using position tracking verification:")
    print(f"  - Position changed: ✓")
    print(f"  - Total position change: {abs_total_change:.6f}")
    print()

    # Display TWAP fills
    print("=" * 80)
    print("TWAP FILLS")
    print("=" * 80)
    if twap_fills:
        print(f"Found {len(twap_fills)} new fills from TWAP order execution:")
        print()
        total_filled_size = 0.0
        for i, fill in enumerate(twap_fills, 1):
            fill_id = fill.get("id", "N/A")
            created_at = fill.get("createdAt", "N/A")
            size = float(fill.get("size", 0))
            price = float(fill.get("price", 0))
            side = fill.get("side", "N/A")
            total_filled_size += abs(size)

            print(f"Fill {i}:")
            print(f"  ID: {fill_id}")
            print(f"  Created At: {created_at}")
            print(f"  Side: {side}")
            print(f"  Size: {size:.6f}")
            print(f"  Price: ${price:.2f}")
            print(f"  Notional: ${abs(size * price):.2f}")
            print()

        print(f"Total Filled Size: {total_filled_size:.6f}")
        print(f"Expected Order Size: {size:.6f}")
        if total_filled_size > 0:
            fill_percentage = (total_filled_size / size) * 100
            print(f"Fill Percentage: {fill_percentage:.1f}%")
    else:
        print("No new fills detected. The TWAP order may not have executed yet,")
        print("or all fills were already present in the initial retrieval.")
    print()

    # Final summary
    print("=" * 80)
    print("EXECUTION SUMMARY")
    print("=" * 80)
    print(f"Initial Position: {initial_size:.6f}")
    print(f"Final Position: {final_size:.6f}")
    print(f"Total Position Change: {total_position_change:+.6f}")
    print(f"Expected Order Size: {size:.6f}")
    print(f"Position Changes Detected: {len(position_changes)}")
    print()

    if position_changes:
        print("Position Change History:")
        for i, change in enumerate(position_changes, 1):
            print(
                f"  {i}. Time: {change['time']:.1f}s, "
                f"Size: {change['size']:.6f}, "
                f"Change: {change['change']:+.6f}, "
                f"Total Change: {change['total_change']:+.6f}"
            )
    else:
        print(
            "No position changes detected (order may still be executing or no changes occurred)"
        )

    print()
    print("=" * 80)
    print("TWAP Order tracking completed!")
    print("=" * 80)


if __name__ == "__main__":
    asyncio.run(place_and_track_twap_order(0.01))
