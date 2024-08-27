import asyncio

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.message import subaccount
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS


async def test():
    node = await NodeClient.connect(TESTNET.node)

    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)
    sender_subaccount = subaccount(TEST_ADDRESS, 0)
    recipient_subaccount = subaccount(TEST_ADDRESS, 1)

    response = await node.transfer(
        wallet, sender_subaccount, recipient_subaccount, 0, 10_000_000
    )
    print(response)


asyncio.run(test())
