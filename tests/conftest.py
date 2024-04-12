import pytest

from dydx_v4_client import ValidatorClient
from dydx_v4_client.network import TESTNET

pytest_plugins = ("pytest_asyncio",)


@pytest.fixture
async def validator():
    return await ValidatorClient.connect(TESTNET)


@pytest.fixture
def test_address():
    return "dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art"
