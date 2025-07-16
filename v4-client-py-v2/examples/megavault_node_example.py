import asyncio

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.mega_vault import MegaVault
from dydx_v4_client.wallet import Wallet
from tests.conftest import TEST_ADDRESS, DYDX_TEST_MNEMONIC


async def megavault_examples():
    node = await NodeClient.connect(TESTNET.node)
    megavault = MegaVault(node)
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)
    total_shares = await megavault.get_owner_shares(TEST_ADDRESS)
    print("########################################")
    print(f"Total shares at beginning: {total_shares}")
    deposit_response = await megavault.deposit(wallet, TEST_ADDRESS, 0, 1)
    print("\n########################################")
    print(f"Deposit response: {deposit_response}")
    await asyncio.sleep(5)
    total_shares_after_deposit = await megavault.get_owner_shares(TEST_ADDRESS)
    print("\n########################################")
    print(f"Total shares at after deposit: {total_shares_after_deposit}")
    withdraw_response = await megavault.withdraw(wallet, TEST_ADDRESS, 0, 0, 1)
    print("\n########################################")
    print(f"Withdraw response: {withdraw_response}")
    total_shares_after_withdraw = await megavault.get_owner_shares(TEST_ADDRESS)
    print("\n########################################")
    print(f"Total shares at after withdraw: {total_shares_after_withdraw}")
    withdraw_info = await megavault.get_withdrawal_info(1)
    print("\n########################################")
    print(f"Share withdrawal info: {withdraw_info}")


asyncio.run(megavault_examples())
