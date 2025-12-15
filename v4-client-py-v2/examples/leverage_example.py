import asyncio
import random

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from dydx_v4_client.indexer.rest.constants import OrderType
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS
from v4_proto.dydxprotocol.clob.order_pb2 import Order
from v4_proto.dydxprotocol.clob.tx_pb2 import LeverageEntry

# Constants for market configuration
MARKET_ID = "BTC-USD"


def print_leverage_response(leverage_response, node, title="Leverage"):
    """Helper function to print leverage response in a readable format."""
    print(f"\n{title}:")
    decoded = node.transcode_response(leverage_response)
    print(f"Decoded response: {decoded}")

    if hasattr(leverage_response, "clob_pair_leverage"):
        leverage_list = leverage_response.clob_pair_leverage
        if len(leverage_list) == 0:
            print("No leverage settings found for this address/subaccount.")
            return

        print("Per-CLOB leverage entries:")
        for entry in leverage_list:
            imf_percent = entry.custom_imf_ppm / 10_000  # ppm to %
            target_leverage = (
                1_000_000 / entry.custom_imf_ppm if entry.custom_imf_ppm > 0 else 0
            )

            print(
                f"  - CLOB Pair ID: {entry.clob_pair_id} | "
                f"Custom IMF: {entry.custom_imf_ppm} ppm ({imf_percent}%) | "
                f"Target Leverage: {target_leverage:.2f}x"
            )
    else:
        print(
            "No 'clob_pair_leverage' field on response; raw decoded response printed above."
        )


async def close_position_if_exists(
    node: NodeClient,
    indexer: IndexerClient,
    wallet: Wallet,
    address: str,
    subaccount_number: int,
    market: Market,
    market_id: str,
) -> float:
    """
    Close position for the specified market if it exists.

    Args:
        market_id: The market identifier (e.g., "BTC-USD")

    Returns:
        float: The closed position size (with sign preserved, e.g., -0.1 for short, 0.1 for long).
               Returns 0.0 if no position existed.
    """
    # Check if position exists
    positions_response = await indexer.account.get_subaccount_perpetual_positions(
        address, subaccount_number
    )
    positions = positions_response.get("positions", [])

    position = None
    for pos in positions:
        if pos.get("market") == market_id and pos.get("status") != "CLOSED":
            position = pos
            break

    if position is None:
        print(f"No open {market_id} position found.")
        return 0.0

    # Capture initial position size with sign preserved
    initial_position_size = float(position.get("size"))
    is_long = initial_position_size > 0
    abs_size = abs(initial_position_size)
    position_type = "long" if is_long else "short"
    print(f"Found open {market_id} position: {abs_size} ({position_type})")
    print(f"Closing {market_id} position...")

    # Create order to close position
    order_id = market.order_id(
        address,
        subaccount_number,
        random.randint(0, MAX_CLIENT_ID),
        OrderFlags.SHORT_TERM,
    )

    current_block = await node.latest_block_height()

    # Calculate price from oracle price with slippage
    # For SELL orders (closing long): subtract slippage
    # For BUY orders (closing short): add slippage
    slippage_pct = 10  # Same as open_position default
    oracle_price = float(market.market["oraclePrice"])

    if is_long:
        # Long position: use SELL to close, subtract slippage
        side = Order.Side.SIDE_SELL
        price = oracle_price * ((100 - slippage_pct) / 100.0)
    else:
        # Short position: use BUY to close, add slippage
        side = Order.Side.SIDE_BUY
        price = oracle_price * ((100 + slippage_pct) / 100.0)

    new_order = market.order(
        order_id=order_id,
        order_type=OrderType.MARKET,
        side=side,
        size=abs_size,
        price=price,
        time_in_force=None,
        reduce_only=True,
        good_til_block=current_block + 20,
    )

    transaction = await node.place_order(
        wallet=wallet,
        order=new_order,
    )

    print(f"Position close transaction submitted: {transaction}")
    wallet.sequence += 1

    # Wait 5 seconds after sending the close request
    await asyncio.sleep(5)
    # Check position size again, throw an exception if it exists
    positions_response = await indexer.account.get_subaccount_perpetual_positions(
        address, subaccount_number
    )
    positions = positions_response.get("positions", [])

    position = None
    for pos in positions:
        if pos.get("market") == market_id and pos.get("status") != "CLOSED":
            position = pos
            break

    if position is not None:
        raise Exception(
            f"Failed to close {market_id} position: position remains open with size {position.get("size")}"
        )

    # Return the initial position size with sign preserved
    return initial_position_size


async def set_leverage_with_verification(
    node: NodeClient,
    wallet: Wallet,
    address: str,
    subaccount_number: int,
    clob_pair_id: int,
    leverage: int,
    custom_imf_ppm: int,
) -> bool:
    """
    Set leverage and verify it was set correctly.

    Args:
        leverage: The target leverage (e.g., 5 for 5x, 10 for 10x)
        custom_imf_ppm: The custom IMF in parts per million

    Returns:
        bool: True if leverage was set successfully, False otherwise
    """
    try:
        print(f"\n{'=' * 60}")
        print(
            f"Setting leverage to {leverage}x ({custom_imf_ppm} ppm = {custom_imf_ppm / 10_000}% IMF) for CLOB pair {clob_pair_id}"
        )
        print(f"{'=' * 60}")

        leverage_entries = [
            LeverageEntry(clob_pair_id=clob_pair_id, custom_imf_ppm=custom_imf_ppm),
        ]

        response = await node.update_leverage(
            wallet=wallet,
            address=address,
            subaccount_number=subaccount_number,
            entries=leverage_entries,
        )
        print("Leverage update transaction submitted!")
        print(f"Transaction response: {response}")

        # Wait for the transaction to be processed
        await asyncio.sleep(2)

        # Verify leverage was set correctly
        leverage_response = await node.get_leverage(address, subaccount_number)
        print_leverage_response(
            leverage_response, node, f"Leverage After Update ({leverage}x)"
        )

        return True

    except Exception as e:
        print(f"Error setting leverage to {leverage}x: {e}")
        import traceback

        traceback.print_exc()
        return False


async def open_position(
    node: NodeClient,
    wallet: Wallet,
    address: str,
    subaccount_number: int,
    market: Market,
    size: float,
    slippage_pct: float = 10,
) -> bool:
    """
    Open a position with the specified size.

    Args:
        size: Position size (e.g., 0.001)
        slippage_pct: Percentage to add to oracle price for BUY orders (default: 10)

    Returns:
        bool: True if order was placed successfully, False otherwise
    """
    try:
        print(f"\nOpening {size} position...")

        order_id = market.order_id(
            address,
            subaccount_number,
            random.randint(0, MAX_CLIENT_ID),
            OrderFlags.SHORT_TERM,
        )

        current_block = await node.latest_block_height()

        # Calculate price from oracle price with slippage (for BUY orders)
        oracle_price = float(market.market["oraclePrice"])
        price = oracle_price * ((100 + slippage_pct) / 100.0)

        # Use BUY side to open a long position
        new_order = market.order(
            order_id=order_id,
            order_type=OrderType.MARKET,
            side=Order.Side.SIDE_BUY,
            size=size,
            price=price,
            time_in_force=None,
            reduce_only=False,
            good_til_block=current_block + 20,
        )

        transaction = await node.place_order(
            wallet=wallet,
            order=new_order,
        )

        print(f"Order placed transaction: {transaction}")
        wallet.sequence += 1

        # Wait for order execution
        await asyncio.sleep(5)
        print(f"Position opened: {size}")

        return True

    except Exception as e:
        print(f"Error opening position: {e}")
        import traceback

        traceback.print_exc()
        return False


async def measure_used_collateral(
    indexer: IndexerClient,
    address: str,
    subaccount_number: int,
    title: str,
) -> dict:
    """
    Measure used collateral by getting equity and free collateral.

    Returns:
        dict: Contains equity, free_collateral, and used_collateral
    """
    try:
        print(f"\n{'-' * 60}")
        print(title)
        print(f"{'-' * 60}")

        # Get subaccount info
        subaccount_response = await indexer.account.get_subaccount(
            address, subaccount_number
        )
        subaccount = (
            subaccount_response.get("subaccount", {})
            if isinstance(subaccount_response, dict)
            else subaccount_response["subaccount"]
        )

        equity_raw = subaccount.get("equity", 0)
        free_collateral_raw = subaccount.get("freeCollateral", 0)

        try:
            equity = float(equity_raw)
            free_collateral = float(free_collateral_raw)
        except Exception:
            equity = 0.0
            free_collateral = 0.0

        used_collateral = equity - free_collateral

        print(f"Equity (USD):            {equity:.2f}")
        print(f"Free Collateral (USD):   {free_collateral:.2f}")
        print(f"Used Collateral (USD):   {used_collateral:.2f}")

        return {
            "equity": equity,
            "free_collateral": free_collateral,
            "used_collateral": used_collateral,
        }

    except Exception as e:
        print(f"Error measuring used collateral: {e}")
        import traceback

        traceback.print_exc()
        return {
            "equity": 0.0,
            "free_collateral": 0.0,
            "used_collateral": 0.0,
        }


async def test():
    """Main function orchestrating the leverage collateral comparison test."""
    market_id = MARKET_ID
    print("=" * 60)
    print(f"{market_id} Leverage Collateral Comparison Test")
    print("=" * 60)

    # Create the clients
    node = await NodeClient.connect(TESTNET.node)
    indexer = IndexerClient(TESTNET.rest_indexer)

    # Create the wallet
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)

    subaccount_number = 0
    position_size = 0.001

    # Get market data
    market_data = await indexer.markets.get_perpetual_markets(market_id)
    market = Market(market_data["markets"][market_id])

    # Get the CLOB pair ID from the market data (dynamically retrieved, not hardcoded)
    clob_pair_id = int(market.market["clobPairId"])
    print(f"Using CLOB pair ID: {clob_pair_id} for market {market_id}")

    # Step 1: Close initial position if any
    print("\n" + "=" * 60)
    print(f"Step 1: Closing initial {market_id} position (if any)")
    print("=" * 60)
    closed_size = await close_position_if_exists(
        node, indexer, wallet, TEST_ADDRESS, subaccount_number, market, market_id
    )

    # Step 2: Set leverage to 5x and verify
    print("\n" + "=" * 60)
    print("Step 2: Setting leverage to 5x")
    print("=" * 60)
    success = await set_leverage_with_verification(
        node, wallet, TEST_ADDRESS, subaccount_number, clob_pair_id, 5, 200_000
    )
    if not success:
        print("Failed to set leverage to 5x. Aborting.")
        return

    # Step 3: Open position and measure used collateral
    print("\n" + "=" * 60)
    print(
        f"Step 3: Opening {market_id} position and measuring used collateral at 5x leverage"
    )
    print("=" * 60)
    success = await open_position(
        node, wallet, TEST_ADDRESS, subaccount_number, market, position_size
    )
    if not success:
        print("Failed to open position. Aborting.")
        return

    collateral_5x = await measure_used_collateral(
        indexer, TEST_ADDRESS, subaccount_number, "Used Collateral at 5x Leverage"
    )
    used_collateral_5x = collateral_5x["used_collateral"]

    print("\nPausing for 30 seconds to allow UI inspection...")
    await asyncio.sleep(30)

    # Step 4: Close the position
    print("\n" + "=" * 60)
    print("Step 4: Closing position")
    print("=" * 60)
    await close_position_if_exists(
        node, indexer, wallet, TEST_ADDRESS, subaccount_number, market, market_id
    )

    # Step 5: Set leverage to 10x and verify
    print("\n" + "=" * 60)
    print("Step 5: Setting leverage to 10x")
    print("=" * 60)
    success = await set_leverage_with_verification(
        node, wallet, TEST_ADDRESS, subaccount_number, clob_pair_id, 10, 100_000
    )
    if not success:
        print("Failed to set leverage to 10x. Aborting.")
        return

    # Step 6: Open position and measure used collateral
    print("\n" + "=" * 60)
    print(
        f"Step 6: Opening {market_id} position and measuring used collateral at 10x leverage"
    )
    print("=" * 60)
    success = await open_position(
        node, wallet, TEST_ADDRESS, subaccount_number, market, position_size
    )
    if not success:
        print("Failed to open position. Aborting.")
        return

    collateral_10x = await measure_used_collateral(
        indexer, TEST_ADDRESS, subaccount_number, "Used Collateral at 10x Leverage"
    )
    used_collateral_10x = collateral_10x["used_collateral"]

    print("\nPausing for 30 seconds to allow UI inspection...")
    await asyncio.sleep(30)

    await close_position_if_exists(
        node, indexer, wallet, TEST_ADDRESS, subaccount_number, market, market_id
    )

    await restore_initial_position(
        node, wallet, TEST_ADDRESS, subaccount_number, market, closed_size
    )
    await asyncio.sleep(2)

    # Step 7: Print difference in used collateral
    print("\n" + "=" * 60)
    print("Step 7: Comparison Results")
    print("=" * 60)
    print(f"\nUsed Collateral at 5x leverage:  ${used_collateral_5x:.2f}")
    print(f"Used Collateral at 10x leverage: ${used_collateral_10x:.2f}")

    diff = used_collateral_10x - used_collateral_5x
    diff_percent = (diff / used_collateral_5x * 100) if used_collateral_5x > 0 else 0

    print(f"\nDifference: ${diff:.2f} ({diff_percent:+.2f}%)")

    if diff < 0:
        print(
            f"\n✓ Higher leverage (10x) uses ${abs(diff):.2f} LESS collateral than 5x leverage"
        )
    elif diff > 0:
        print(
            f"\n✓ Higher leverage (10x) uses ${diff:.2f} MORE collateral than 5x leverage"
        )
    else:
        print(f"\n✓ Both leverage settings use the same amount of collateral")

    print("\n" + "=" * 60)
    print("Test complete!")
    print("=" * 60)


async def restore_initial_position(
    node: NodeClient,
    wallet: Wallet,
    address: str,
    subaccount_number: int,
    market: Market,
    closed_size: float,
) -> bool:
    if closed_size == 0.0:
        print("No position to restore (closed_size is 0.0).")
        return True

    try:
        is_long = closed_size > 0
        abs_size = abs(closed_size)
        position_type = "long" if is_long else "short"
        print(f"\nRestoring {position_type} position with size {abs_size}...")

        order_id = market.order_id(
            address,
            subaccount_number,
            random.randint(0, MAX_CLIENT_ID),
            OrderFlags.SHORT_TERM,
        )

        current_block = await node.latest_block_height()

        # Calculate price from oracle price with slippage
        slippage_pct = 10  # Same as open_position default
        oracle_price = float(market.market["oraclePrice"])

        if is_long:
            # Long position: use BUY, add slippage
            side = Order.Side.SIDE_BUY
            price = oracle_price * ((100 + slippage_pct) / 100.0)
        else:
            # Short position: use SELL, subtract slippage
            side = Order.Side.SIDE_SELL
            price = oracle_price * ((100 - slippage_pct) / 100.0)

        new_order = market.order(
            order_id=order_id,
            order_type=OrderType.MARKET,
            side=side,
            size=abs_size,
            price=price,
            time_in_force=None,
            reduce_only=False,
            good_til_block=current_block + 20,
        )

        transaction = await node.place_order(
            wallet=wallet,
            order=new_order,
        )

        print(f"Restore position transaction submitted: {transaction}")
        wallet.sequence += 1

        # Wait for order execution
        await asyncio.sleep(5)
        print(f"Position restored: {closed_size}")

        return True

    except Exception as e:
        print(f"Error restoring position: {e}")
        import traceback

        traceback.print_exc()
        return False


if __name__ == "__main__":
    asyncio.run(test())
