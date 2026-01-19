import asyncio

from v4_proto.dydxprotocol.clob.tx_pb2 import LeverageEntry

from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3

# Constants for market configuration
MARKET_ID = "ENA-USD"


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
            print(entry)
    else:
        print(
            "No 'clob_pair_leverage' field on response; raw decoded response printed above."
        )


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

        entry = LeverageEntry(clob_pair_id=clob_pair_id, custom_imf_ppm=custom_imf_ppm)
        print(entry)
        leverage_entries = [
            entry,
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
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3)

    subaccount_number = 0

    # Get market data
    market_data = await indexer.markets.get_perpetual_markets(market_id)
    market = Market(market_data["markets"][market_id])

    # Get the CLOB pair ID from the market data (dynamically retrieved, not hardcoded)
    clob_pair_id = int(market.market["clobPairId"])
    print(f"Using CLOB pair ID: {clob_pair_id} for market {market_id}")

    success = await set_leverage_with_verification(
        node, wallet, TEST_ADDRESS_3, subaccount_number, clob_pair_id, 5, 200_000
    )
    if not success:
        print("Failed to set leverage to 5x. Aborting.")
        return
    success = await set_leverage_with_verification(
        node, wallet, TEST_ADDRESS_3, subaccount_number, clob_pair_id, 10, 100_000
    )
    if not success:
        print("Failed to set leverage to 10x. Aborting.")
        return
    print("Test complete!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(test())
