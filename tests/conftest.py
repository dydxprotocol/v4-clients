import pytest

from dydx_v4_client import ValidatorClient
from dydx_v4_client.indexer.network import TESTNET
from dydx_v4_client.indexer.rest.constants import (
    IndexerApiHost,
    IndexerConfig,
    IndexerWSHost,
)
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient

pytest_plugins = ("pytest_asyncio",)

DYDX_TEST_PRIVATE_KEY = (
    "e92a6595c934c991d3b3e987ea9b3125bf61a076deab3a9cb519787b7b3e8d77"
)
DYDX_TEST_MNEMONIC = (
    "mirror actor skill push coach wait confirm orchard lunch mobile athlete gossip awake "
    "miracle matter bus reopen team ladder lazy list timber render wait"
)


@pytest.fixture
def indexer_client():
    config = IndexerConfig(
        rest_endpoint=IndexerApiHost.TESTNET, websocket_endpoint=IndexerWSHost.TESTNET
    )
    return IndexerClient(config)


@pytest.fixture
async def validator():
    return await ValidatorClient.connect(TESTNET)


@pytest.fixture
def test_address():
    return "dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art"
