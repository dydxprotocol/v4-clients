import asyncio

from dydx_v4_client.key_pair import KeyPair
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.message import subaccount
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_PRIVATE_KEY_3, TEST_ADDRESS_3

ASSET_ID_USDC = 0


async def get_subaccount_balance(
    node: NodeClient, address: str, subaccount_number: int
) -> int:
    """Get USDC balance for a subaccount in quantums."""
    subaccount_info = await node.get_subaccount(address, subaccount_number)
    for asset_pos in subaccount_info.asset_positions:
        if asset_pos.asset_id == ASSET_ID_USDC:
            return asset_pos.quantums_decoded
    return 0


async def print_balances(
    node: NodeClient, address: str, subaccount_numbers: list[int], label: str
):
    """Print USDC balances for multiple subaccounts."""
    print(f"\n{label}:")
    for subaccount_number in subaccount_numbers:
        balance = await get_subaccount_balance(node, address, subaccount_number)
        print(
            f"  Subaccount {subaccount_number}: {balance} quantums ({balance / 1_000_000:.6f} USDC)"
        )


async def test():
    node = await NodeClient.connect(TESTNET.node)

    # Create wallet from private key (hex string) instead of mnemonic
    account = await node.get_account(TEST_ADDRESS_3)
    wallet = Wallet(
        key=KeyPair.from_hex(DYDX_TEST_PRIVATE_KEY_3),
        account_number=account.account_number,
        sequence=account.sequence,
    )
    sender_subaccount = subaccount(TEST_ADDRESS_3, 0)
    recipient_subaccount = subaccount(TEST_ADDRESS_3, 1)

    transfer_amount = 10_000_000  # quantums

    # Print balances before transfer
    await print_balances(node, TEST_ADDRESS_3, [0, 1], "Balances BEFORE transfer")

    print(
        f"\nTransferring {transfer_amount} quantums ({transfer_amount / 1_000_000:.6f} USDC) from subaccount 0 to subaccount 1..."
    )
    response = await node.transfer(
        wallet, sender_subaccount, recipient_subaccount, ASSET_ID_USDC, transfer_amount
    )
    print(f"Transfer response: {response}")
    # wait for 10 seconds
    await asyncio.sleep(10)
    # Print balances after transfer
    await print_balances(node, TEST_ADDRESS_3, [0, 1], "Balances AFTER transfer")


asyncio.run(test())
