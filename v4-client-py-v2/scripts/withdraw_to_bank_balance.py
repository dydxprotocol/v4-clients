#!/usr/bin/env python3
"""
Script to withdraw funds from subaccount 0 (trade balance) to on-chain bank balance
for TEST_ADDRESS_3. This ensures the account has sufficient spendable balance for
deposit operations in tests.

The script:
1. Checks current on-chain bank balance (spendable)
2. Checks subaccount 0 asset balance (trade balance) for asset_id=0 (USDC)
3. Withdraws 1,000,000 quantums from subaccount 0 to the on-chain address
4. Verifies the new balance
"""

import asyncio
import sys

import grpc

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.message import subaccount
from dydx_v4_client.node.fee import Denom
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3


ASSET_ID_USDC = 0
WITHDRAWAL_AMOUNT_QUANTUMS = 10_000_000
SUBACCOUNT_NUMBER = 0


async def main() -> int:
    print("Connecting to dYdX testnet node...")
    node = await NodeClient.connect(TESTNET.node)

    print("Creating wallet for Test Account 3...")
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3)
    print(f"Address: {TEST_ADDRESS_3}")
    print(f"Account number: {wallet.account_number}, sequence: {wallet.sequence}")

    # Check current bank balance (spendable)
    print(f"\nChecking current bank balance for {Denom.USDC.value}...")
    try:
        bank_balance_response = await node.get_account_balance(
            TEST_ADDRESS_3, Denom.USDC.value
        )
        current_bank_balance = int(bank_balance_response.balance.amount)
        print(f"Current bank balance: {current_bank_balance} quantums")
        print(f"  ({current_bank_balance / 1_000_000:.6f} USDC)")
    except Exception as e:
        print(f"Error checking bank balance: {e}")
        # If balance doesn't exist, it might be 0
        current_bank_balance = 0
        print(f"Assuming balance is 0 (denom may not exist yet)")

    # Check subaccount balance
    print(f"\nChecking subaccount {SUBACCOUNT_NUMBER} balance...")
    try:
        subaccount_info = await node.get_subaccount(TEST_ADDRESS_3, SUBACCOUNT_NUMBER)
        
        # Find asset position with asset_id=0 (USDC)
        usdc_position = None
        for asset_pos in subaccount_info.asset_positions:
            if asset_pos.asset_id == ASSET_ID_USDC:
                usdc_position = asset_pos
                break
        
        if usdc_position is None:
            print(f"❌ No USDC (asset_id={ASSET_ID_USDC}) position found in subaccount {SUBACCOUNT_NUMBER}")
            return 1
        
        subaccount_balance = usdc_position.quantums_decoded
        print(f"Subaccount {SUBACCOUNT_NUMBER} USDC balance: {subaccount_balance} quantums")
        print(f"  ({subaccount_balance / 1_000_000:.6f} USDC)")
        
        # Validate withdrawal
        if subaccount_balance < WITHDRAWAL_AMOUNT_QUANTUMS:
            print(f"\n❌ Insufficient subaccount balance!")
            print(f"  Required: {WITHDRAWAL_AMOUNT_QUANTUMS} quantums")
            print(f"  Available: {subaccount_balance} quantums")
            print(f"  Shortfall: {WITHDRAWAL_AMOUNT_QUANTUMS - subaccount_balance} quantums")
            return 1
        
        print(f"\n✅ Sufficient balance in subaccount for withdrawal")
        
    except Exception as e:
        print(f"❌ Error checking subaccount balance: {e}")
        return 1

    # Perform withdrawal
    print(f"\nWithdrawing {WITHDRAWAL_AMOUNT_QUANTUMS} quantums from subaccount {SUBACCOUNT_NUMBER} to on-chain address...")
    try:
        sender_subaccount = subaccount(TEST_ADDRESS_3, SUBACCOUNT_NUMBER)
        response = await node.withdraw(
            wallet,
            sender_subaccount,
            TEST_ADDRESS_3,
            asset_id=ASSET_ID_USDC,
            quantums=WITHDRAWAL_AMOUNT_QUANTUMS,
        )
        print(f"Withdrawal transaction response:")
        print(f"  Code: {response.tx_response.code}")
        if response.tx_response.code != 0:
            print(f"  ❌ Transaction failed!")
            print(f"  Raw log: {response.tx_response.raw_log}")
            return 1
        print(f"  ✅ Transaction successful!")
        print(f"  Tx hash: {response.tx_response.txhash}")
        
    except grpc.RpcError as e:
        if "StillUndercollateralized" in str(e.details()) or "NewlyUndercollateralized" in str(e.details()):
            print(f"❌ Withdrawal failed: Subaccount is undercollateralized")
            print(f"  Error: {e.details()}")
            return 1
        else:
            print(f"❌ Withdrawal failed with gRPC error: {e.details()}")
            return 1
    except Exception as e:
        print(f"❌ Error during withdrawal: {e}")
        return 1

    # Wait for confirmation
    print(f"\nWaiting 5 seconds for transaction to be processed...")
    await asyncio.sleep(5)

    # Refresh wallet sequence
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3)
    print(f"Refreshed wallet sequence: {wallet.sequence}")

    # Verify new balance
    print(f"\nVerifying new bank balance...")
    try:
        new_bank_balance_response = await node.get_account_balance(
            TEST_ADDRESS_3, Denom.USDC.value
        )
        new_bank_balance = int(new_bank_balance_response.balance.amount)
        print(f"New bank balance: {new_bank_balance} quantums")
        print(f"  ({new_bank_balance / 1_000_000:.6f} USDC)")
        
        expected_balance = current_bank_balance + WITHDRAWAL_AMOUNT_QUANTUMS
        if new_bank_balance >= expected_balance:
            print(f"✅ Balance verification successful!")
            print(f"  Expected: >= {expected_balance} quantums")
            print(f"  Actual: {new_bank_balance} quantums")
            print(f"  Increase: {new_bank_balance - current_bank_balance} quantums")
        else:
            print(f"⚠️  Balance increased but may be less than expected")
            print(f"  Expected: >= {expected_balance} quantums")
            print(f"  Actual: {new_bank_balance} quantums")
            print(f"  (Note: Some amount may have been used for gas fees)")
            
    except Exception as e:
        print(f"⚠️  Error verifying new balance: {e}")
        print(f"  (Withdrawal may have succeeded, but balance check failed)")

    print(f"\n✅ Script completed successfully!")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
