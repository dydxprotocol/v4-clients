import asyncio

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS
from v4_proto.dydxprotocol.clob.tx_pb2 import LeverageEntry


def print_leverage_response(leverage_response, node, title="Leverage"):
    """Helper function to print leverage response in a readable format."""
    print(f"\n{title}:")
    decoded = node.transcode_response(leverage_response)
    print(f"Decoded response: {decoded}")
    
    if hasattr(leverage_response, "clob_pair_leverage"):
        leverage_list = leverage_response.clob_pair_leverage
        print(f"Number of leverage entries: {len(leverage_list)}")
        if len(leverage_list) > 0:
            for entry in leverage_list:
                # Convert ppm to percentage and leverage multiplier
                imf_percent = entry.custom_imf_ppm / 10000.0  # ppm to percent
                leverage_multiplier = 100.0 / imf_percent if imf_percent > 0 else 0
                print(
                    f"  ClobPairId: {entry.clob_pair_id}, "
                    f"Custom IMF: {entry.custom_imf_ppm} ppm ({imf_percent}%), "
                    f"Leverage: {leverage_multiplier:.1f}x"
                )
        else:
            print("  No custom leverage entries found (using default leverage)")


async def test():
    # Create the client
    node = await NodeClient.connect(TESTNET.node)

    # Create the wallet
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)

    subaccount_number = 0
    clob_pair_id = 0  # Using CLOB pair 0 (BTC-USD) for this example

    # Step 1: Get initial leverage (before setting any custom values)
    try:
        leverage_response = await node.get_leverage(TEST_ADDRESS, subaccount_number)
        print_leverage_response(leverage_response, node, "Initial Leverage (before setting)")
    except Exception as e:
        print(f"Error getting initial leverage: {e}")
        import traceback
        traceback.print_exc()
        return

    # Step 2: Set first leverage value (5x leverage = 200000 ppm = 20%)
    try:
        print("\n" + "="*60)
        print("Setting leverage to 5x (200000 ppm = 20% IMF) for CLOB pair 0")
        print("="*60)
        
        leverage_entries = [
            LeverageEntry(clob_pair_id=clob_pair_id, custom_imf_ppm=200000),
        ]

        response = await node.update_leverage(
            wallet=wallet,
            address=TEST_ADDRESS,
            subaccount_number=subaccount_number,
            entries=leverage_entries,
        )
        print("Update successful!")
        print(f"Transaction response: {response}")
        
        # Wait a moment for the transaction to be processed
        await asyncio.sleep(2)
        
        # Get leverage after first update
        leverage_response = await node.get_leverage(TEST_ADDRESS, subaccount_number)
        print_leverage_response(leverage_response, node, "Leverage After First Update (5x)")
        
    except Exception as e:
        print(f"Error updating leverage to 5x: {e}")
        import traceback
        traceback.print_exc()
        return

    # Step 3: Set different leverage value (10x leverage = 100000 ppm = 10%)
    try:
        print("\n" + "="*60)
        print("Setting leverage to 10x (100000 ppm = 10% IMF) for CLOB pair 0")
        print("="*60)
        
        leverage_entries = [
            LeverageEntry(clob_pair_id=clob_pair_id, custom_imf_ppm=100000),
        ]

        response = await node.update_leverage(
            wallet=wallet,
            address=TEST_ADDRESS,
            subaccount_number=subaccount_number,
            entries=leverage_entries,
        )
        print("Update successful!")
        print(f"Transaction response: {response}")
        
        # Wait a moment for the transaction to be processed
        await asyncio.sleep(2)
        
        # Get leverage after second update
        leverage_response = await node.get_leverage(TEST_ADDRESS, subaccount_number)
        print_leverage_response(leverage_response, node, "Leverage After Second Update (10x)")
        
        print("\n" + "="*60)
        print("Summary: You can see the leverage changed from 5x to 10x!")
        print("="*60)
        
    except Exception as e:
        print(f"Error updating leverage to 10x: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test())

