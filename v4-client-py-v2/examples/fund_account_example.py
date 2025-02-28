import asyncio
from dydx_v4_client.faucet_client import FaucetClient
from dydx_v4_client.network import TESTNET_FAUCET
from dydx_v4_client.key_pair import KeyPair
from dydx_v4_client.wallet import Wallet
from tests.conftest import (
    DYDX_TEST_MNEMONIC_2,
    TEST_ADDRESS_2,
)

# Replace this with your actual testnet address
wallet = Wallet(KeyPair.from_mnemonic(DYDX_TEST_MNEMONIC_2), 0, 0)
assert TEST_ADDRESS_2 == wallet.address
ADDRESS_TO_FUND = wallet.address


async def get_tokens_from_faucet():
    print("Funding address:", ADDRESS_TO_FUND)
    faucet = FaucetClient(TESTNET_FAUCET)

    # Get non-native tokens (USDC)
    response_non_native = await faucet.fill(ADDRESS_TO_FUND, 0, 2000)

    # Get native tokens (DV4TNT)
    response_native = await faucet.fill_native(ADDRESS_TO_FUND)

    print("Non-native token response:", response_non_native)
    print("Native token response:", response_native)

    if 200 <= response_non_native.status_code < 300:
        print("Successfully obtained USDC from faucet")
    else:
        print("Failed to obtain USDC from faucet")

    if 200 <= response_native.status_code < 300:
        print("Successfully obtained native tokens from faucet")
    else:
        print("Failed to obtain native tokens from faucet")


asyncio.run(get_tokens_from_faucet())
