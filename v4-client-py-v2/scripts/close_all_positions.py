#!/usr/bin/env python3
"""
Script to cancel ALL open orders and close ALL positions for all test accounts.
Handles all markets and all subaccounts.
"""
import asyncio
from datetime import datetime

from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.indexer.rest.constants import OrderStatus
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market
from dydx_v4_client.wallet import Wallet
from dydx_v4_client.node.message import order_id as create_order_id
from dydx_v4_client import MAX_CLIENT_ID
import random


def parse_timestamp(value):
    """Parse a timestamp that might be an int or ISO date string."""
    if value is None:
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, str):
        # Try parsing as int first
        try:
            return int(value)
        except ValueError:
            pass
        # Try parsing as ISO date
        try:
            dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
            return int(dt.timestamp())
        except ValueError:
            pass
    return None

# All test accounts
TEST_ACCOUNTS = [
    {
        "name": "Test Account 1",
        "mnemonic": (
            "mirror actor skill push coach wait confirm orchard lunch mobile athlete gossip awake "
            "miracle matter bus reopen team ladder lazy list timber render wait"
        ),
        "address": "dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art",
    },
    {
        "name": "Test Account 2",
        "mnemonic": (
            "movie yard still copper exile wear brisk chest ride dizzy novel future menu finish "
            "radar lunar claim hub middle force turtle mouse frequent embark"
        ),
        "address": "dydx18sukah44zfkjndlhcdmhkjnarl2sevhwf894vh",
    },
    {
        "name": "Test Account 3",
        "mnemonic": (
            "mandate glove carry despair area gloom sting round toddler deal face vague receive "
            "shallow confirm south green cup rain drill monkey method tongue fence"
        ),
        "address": "dydx1wldnytkerzs39rs28djn0p9vvqer2x2k5x8hjy",
    },
]


async def get_all_subaccounts(indexer_client, address):
    """Get all subaccounts for an address."""
    try:
        response = await indexer_client.account.get_subaccounts(address)
        return response.get("subaccounts", [])
    except Exception as e:
        if "404" in str(e):
            return []
        raise


async def get_market_clob_pair_id(indexer_client, ticker):
    """Get the clob_pair_id for a market ticker."""
    try:
        market_data = await indexer_client.markets.get_perpetual_markets(ticker)
        return int(market_data["markets"][ticker]["clobPairId"])
    except Exception:
        return None


async def process_account(node_client, indexer_client, account):
    """Cancel all open orders and close all positions for a single account."""
    mnemonic = account["mnemonic"]
    address = account["address"]
    name = account["name"]

    print(f"\n{'='*60}")
    print(f"Processing {name}: {address}")
    print(f"{'='*60}")

    try:
        wallet = await Wallet.from_mnemonic(node_client, mnemonic, address)
        print(f"Connected - Account number: {wallet.account_number}, Sequence: {wallet.sequence}")
    except Exception as e:
        print(f"Failed to connect wallet: {e}")
        return

    # Get all subaccounts
    subaccounts = await get_all_subaccounts(indexer_client, address)

    if not subaccounts:
        print("No subaccounts found.")
        return

    for subaccount_data in subaccounts:
        subaccount_number = subaccount_data.get("subaccountNumber", 0)
        print(f"\n--- Subaccount {subaccount_number} ---")

        # Get all open orders for this subaccount
        try:
            orders = await indexer_client.account.get_subaccount_orders(
                address, subaccount_number, status=OrderStatus.OPEN
            )
        except Exception as e:
            print(f"Error fetching orders: {e}")
            orders = []

        if not orders:
            print("No open orders found.")
        else:
            print(f"Found {len(orders)} open order(s):")
            for order in orders:
                ticker = order.get("ticker")
                print(f"  - {ticker}: Client ID: {order.get('clientId')}, Side: {order.get('side')}, "
                      f"Size: {order.get('size')}, Price: {order.get('price')}")

            # Cancel each order
            for order in orders:
                ticker = order.get("ticker")
                client_id = int(order.get("clientId"))
                order_flags = int(order.get("orderFlags"))
                good_til_block = order.get("goodTilBlock")
                good_til_block_time = order.get("goodTilBlockTime")

                # Get clob_pair_id for this market
                clob_pair_id = await get_market_clob_pair_id(indexer_client, ticker)
                if clob_pair_id is None:
                    print(f"  Could not get clob_pair_id for {ticker}, skipping...")
                    continue

                oid = create_order_id(
                    address,
                    subaccount_number=subaccount_number,
                    client_id=client_id,
                    clob_pair_id=clob_pair_id,
                    order_flags=order_flags,
                )

                print(f"Cancelling {ticker} order (client_id={client_id})...")

                try:
                    parsed_block_time = parse_timestamp(good_til_block_time)
                    parsed_block = parse_timestamp(good_til_block)

                    if parsed_block_time:
                        response = await node_client.cancel_order(
                            wallet, oid, good_til_block_time=parsed_block_time,
                        )
                    elif parsed_block:
                        response = await node_client.cancel_order(
                            wallet, oid, good_til_block=parsed_block + 10,
                        )
                    else:
                        print(f"  Skipping - no good_til_block or good_til_block_time")
                        continue

                    if response.tx_response.code == 0:
                        print(f"  Successfully cancelled")
                    else:
                        print(f"  Failed: {response.tx_response.raw_log}")

                    wallet = await Wallet.from_mnemonic(node_client, mnemonic, address)
                    await asyncio.sleep(2)

                except Exception as e:
                    print(f"  Error: {e}")
                    wallet = await Wallet.from_mnemonic(node_client, mnemonic, address)

        # Check for open positions
        positions = subaccount_data.get("openPerpetualPositions", {})

        if not positions:
            print("No open positions found.")
        else:
            print(f"Found {len(positions)} open position(s):")
            for ticker, position in positions.items():
                size = float(position.get("size", 0))
                side = position.get("side")
                print(f"  - {ticker}: {size} ({side})")

            # Close each position
            for ticker, position in positions.items():
                size = float(position.get("size", 0))
                side = position.get("side")
                print(f"Closing {ticker} position ({size} {side})...")

                try:
                    # Get market data
                    market_data = await indexer_client.markets.get_perpetual_markets(ticker)
                    market = Market(market_data["markets"][ticker])

                    # Refresh wallet
                    wallet = await Wallet.from_mnemonic(node_client, mnemonic, address)

                    # Close position
                    response = await node_client.close_position(
                        wallet=wallet,
                        address=address,
                        subaccount_number=subaccount_number,
                        market=market,
                        reduce_by=None,  # Close entire position
                        client_id=random.randint(0, MAX_CLIENT_ID),
                        slippage_pct=10,  # Higher slippage for illiquid markets
                    )

                    if response.tx_response.code == 0:
                        print(f"  Successfully closed position")
                    else:
                        print(f"  Failed: {response.tx_response.raw_log}")

                    await asyncio.sleep(2)

                except Exception as e:
                    print(f"  Error closing position: {e}")


async def main():
    print("Connecting to DYDX Testnet...")
    node_client = await NodeClient.connect(TESTNET.node)
    indexer_client = IndexerClient("https://indexer.v4testnet.dydx.exchange")

    for account in TEST_ACCOUNTS:
        await process_account(node_client, indexer_client, account)
        await asyncio.sleep(2)

    print("\n" + "="*60)
    print("Done!")
    print("="*60)


if __name__ == "__main__":
    asyncio.run(main())
