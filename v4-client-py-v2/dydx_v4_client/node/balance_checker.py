#!/usr/bin/env python3
"""
Balance checker script for CI/CD pipeline.
Checks if the funding account has sufficient balance for testing.
"""

import asyncio
import sys

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.fee import Denom
from tests.conftest import TEST_ADDRESS


async def check_funding_account_balance(
    test_address: str, min_balance_usdc: int = 21000000
) -> bool:
    """
    Check if the funding account has sufficient balance.

    Args:
        test_address: The test account address to check
        min_balance_usdc: Minimum required balance in USDC (default: 21 USDC)

    Returns:
        bool: True if balance is sufficient, False otherwise

    Raises:
        Exception: If there's an error checking the balance
    """
    node_client = await NodeClient.connect(TESTNET.node)

    try:
        # Get the account balance for USDC
        response = await node_client.get_account_balance(test_address, Denom.USDC.value)

        # Check if response is valid
        if not hasattr(response, "balance") or not hasattr(response.balance, "amount"):
            print(f"❌ Invalid response format: {response}")
            return False

        # Parse the balance amount
        try:
            balance_amount = int(response.balance.amount)
        except (ValueError, TypeError) as e:
            print(f"❌ Failed to parse balance amount: {e}")
            return False

        # Check if balance is sufficient
        if balance_amount >= min_balance_usdc:
            usdc_amount = balance_amount / 1_000_000
            print(
                f"✅ Funding account has sufficient balance: {usdc_amount:.6f} USDC ({balance_amount} micro-USDC)"
            )
            return True
        else:
            usdc_amount = balance_amount / 1_000_000
            required_usdc = min_balance_usdc / 1_000_000
            print(
                f"❌ Insufficient balance: {usdc_amount:.6f} USDC (required: {required_usdc:.6f} USDC)"
            )
            return False

    except Exception as e:
        print(f"❌ Error checking balance: {e}")
        raise


async def main():
    """Main function for CLI usage."""
    # Use the test address from conftest.py
    default_test_address = TEST_ADDRESS

    # Allow override via command line argument
    test_address = sys.argv[1] if len(sys.argv) > 1 else default_test_address

    print(f"🔍 Checking balance for test address: {test_address}")

    try:
        is_sufficient = await check_funding_account_balance(test_address)

        if is_sufficient:
            print("✅ Balance check passed - funding account has sufficient balance")
            sys.exit(0)
        else:
            print("❌ Balance check failed - funding account has insufficient balance")
            sys.exit(1)

    except Exception as e:
        print(f"❌ Balance check failed with error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
