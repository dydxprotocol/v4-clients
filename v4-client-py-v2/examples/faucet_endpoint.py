import asyncio

from dydx_v4_client.faucet_client import FaucetClient
from dydx_v4_client.network import TESTNET_FAUCET
from tests.conftest import TEST_ADDRESS


async def test():
    faucet = FaucetClient(TESTNET_FAUCET)
    response = await faucet.fill(TEST_ADDRESS, 0, 2000)
    print(response)
    print(response.status_code)


asyncio.run(test())
