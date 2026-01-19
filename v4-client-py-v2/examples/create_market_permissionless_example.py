import asyncio

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.wallet import Wallet
from tests.conftest import TEST_ADDRESS_3, DYDX_TEST_MNEMONIC_3


async def create_market_permissionless_example():
    node = await NodeClient.connect(TESTNET.node)
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3)
    try:
        response = await node.create_market_permissionless(
            wallet, "ENA-USD", TEST_ADDRESS_3, 0
        )
        print(response)
    except Exception as e:
        if "Market params pair already exists" in str(e):
            print("Market params pair already exists")
        else:
            print(f"str{e}")


asyncio.run(create_market_permissionless_example())
