import asyncio

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.message import subaccount
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS


async def test():
    node = await NodeClient.connect(TESTNET.node)

    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)

    response = await node.withdraw(
        wallet, subaccount(TEST_ADDRESS, 0), TEST_ADDRESS, 0, 1_00_000_000
    )
    print(response)


asyncio.run(test())
