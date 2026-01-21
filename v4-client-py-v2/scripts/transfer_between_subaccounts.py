#!/usr/bin/env python3
"""
Script to transfer a small amount between subaccounts 0 and 127 for test account 3.

This is useful to "touch" a subaccount (create activity) and can help avoid
sequence/gas-related issues in integration tests.
"""

import asyncio
import sys

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.message import subaccount
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3


ASSET_ID_USDC = 0
DEFAULT_AMOUNT_QUANTUMS = 1_000_000  # 1 USDC (1e-6)
FROM_SUBACCOUNT = 0
TO_SUBACCOUNT = 127


async def main() -> int:
    amount = DEFAULT_AMOUNT_QUANTUMS
    if len(sys.argv) > 1:
        try:
            amount = int(sys.argv[1])
        except ValueError:
            print("Usage: transfer_between_subaccounts.py [amount_quantums]")
            print(f"Example: transfer_between_subaccounts.py {DEFAULT_AMOUNT_QUANTUMS}")
            return 2

    print("Connecting to dYdX testnet node...")
    node = await NodeClient.connect(TESTNET.node)

    print("Creating wallet for Test Account 3...")
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3)
    print(f"Address: {TEST_ADDRESS_3}")
    print(f"Account number: {wallet.account_number}, sequence: {wallet.sequence}")

    sender_0 = subaccount(TEST_ADDRESS_3, FROM_SUBACCOUNT)
    recipient_127 = subaccount(TEST_ADDRESS_3, TO_SUBACCOUNT)

    print(f"\nTransferring {amount} quantums (asset_id={ASSET_ID_USDC}) {FROM_SUBACCOUNT} -> {TO_SUBACCOUNT} ...")
    resp_1 = await node.transfer(wallet, sender_0, recipient_127, ASSET_ID_USDC, amount)
    print(resp_1)

    # Give the chain/indexer a moment and refresh wallet sequence.
    await asyncio.sleep(5)
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3)
    print(f"Refreshed sequence: {wallet.sequence}")

    print(f"\nTransferring {amount} quantums (asset_id={ASSET_ID_USDC}) {TO_SUBACCOUNT} -> {FROM_SUBACCOUNT} ...")
    resp_2 = await node.transfer(wallet, recipient_127, sender_0, ASSET_ID_USDC, amount)
    print(resp_2)

    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))

