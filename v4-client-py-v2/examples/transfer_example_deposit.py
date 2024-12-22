import asyncio

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.message import subaccount
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS


async def test():
    # Create the client
    node = await NodeClient.connect(TESTNET.node)

    # Create the wallet
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)

    # Call the API - deposit funds
    response = await node.deposit(
        wallet, TEST_ADDRESS, subaccount(TEST_ADDRESS, 0), 0, 10_000_000
    )
    print(response)


asyncio.run(test())
