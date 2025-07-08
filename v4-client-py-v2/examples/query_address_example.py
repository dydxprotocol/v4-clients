import asyncio

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from tests.conftest import TEST_ADDRESS


async def query_address_examples():
    node = await NodeClient.connect(TESTNET.node)
    response = await node.query_address(TEST_ADDRESS)
    print(response)


asyncio.run(test_examples())
