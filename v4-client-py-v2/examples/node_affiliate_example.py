import asyncio

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.wallet import Wallet
from tests.conftest import (
    DYDX_TEST_MNEMONIC_3,
    TEST_ADDRESS_3,
    DYDX_TEST_MNEMONIC_2,
    TEST_ADDRESS_2,
)


async def affiliate_examples():
    node = await NodeClient.connect(TESTNET.node)
    referee_wallet = await Wallet.from_mnemonic(
        node, DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3
    )
    affiliate_wallet = await Wallet.from_mnemonic(
        node, DYDX_TEST_MNEMONIC_2, TEST_ADDRESS_2
    )
    try:
        response = await node.register_affiliate(
            referee_wallet, referee_wallet.address, affiliate_wallet.address
        )
        print(response)
    except Exception as e:
        if "Affiliate already exists for referee" in str(e):
            print("Affiliate already exists for referee")
        else:
            print(f"Error: {e}")


asyncio.run(affiliate_examples())
