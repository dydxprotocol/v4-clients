import asyncio
import random
import time
from functools import wraps

import httpx
import pytest

from dydx_v4_client.faucet_client import FaucetClient
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.indexer.rest.noble_client import NobleClient
from dydx_v4_client.indexer.socket.websocket import IndexerSocket
from dydx_v4_client.network import TESTNET, TESTNET_FAUCET, TESTNET_NOBLE
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.message import order, order_id
from dydx_v4_client.wallet import Wallet, from_mnemonic

pytest_plugins = ("pytest_asyncio",)

DYDX_TEST_PRIVATE_KEY = (
    "e92a6595c934c991d3b3e987ea9b3125bf61a076deab3a9cb519787b7b3e8d77"
)
DYDX_TEST_MNEMONIC = (
    "mirror actor skill push coach wait confirm orchard lunch mobile athlete gossip awake "
    "miracle matter bus reopen team ladder lazy list timber render wait"
)
TEST_ADDRESS = "dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art"
RECIPIENT = "dydx1slanxj8x9ntk9knwa6cvfv2tzlsq5gk3dshml0"


@pytest.fixture
def indexer_rest_client():
    return IndexerClient("https://indexer.v4testnet.dydx.exchange")


@pytest.fixture
async def indexer_socket_client():
    return IndexerSocket(TESTNET.websocket_indexer)


@pytest.fixture
async def faucet_client():
    return FaucetClient(faucet_url=TESTNET_FAUCET)


@pytest.fixture
async def node_client():
    return await NodeClient.connect(TESTNET.node)


@pytest.fixture
async def noble_client():
    client = NobleClient(TESTNET_NOBLE)
    await client.connect(DYDX_TEST_MNEMONIC)
    yield client


@pytest.fixture
def test_address():
    return TEST_ADDRESS


@pytest.fixture
def recipient():
    return RECIPIENT


@pytest.fixture
def private_key():
    return from_mnemonic(DYDX_TEST_MNEMONIC)


@pytest.fixture
def test_order_id(test_address):
    return order_id(
        test_address,
        subaccount_number=0,
        client_id=random.randint(0, 1000000000),
        clob_pair_id=0,
        order_flags=64,
    )


@pytest.fixture
def test_order(test_order_id):
    return order(
        test_order_id,
        time_in_force=0,
        reduce_only=False,
        side=1,
        quantums=10000000,
        subticks=40000000000,
        good_til_block_time=int(time.time() + 60),
    )


async def get_wallet(node_client, private_key, test_address):
    account = await node_client.get_account(test_address)
    return Wallet(private_key, account.account_number, account.sequence)


@pytest.fixture()
async def wallet(node_client, private_key, test_address):
    return await get_wallet(node_client, private_key, test_address)


def retry_on_forbidden(max_retries=3, delay=1, skip=False):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return await func(*args, **kwargs)
                except httpx.HTTPStatusError as e:
                    if e.response.status_code == 403:
                        if attempt < max_retries - 1:
                            await asyncio.sleep(delay)
                            continue
                        else:
                            if skip:
                                pytest.skip("403 Forbidden error. Skipping the test.")
                            else:
                                raise
                    raise
            raise httpx.HTTPStatusError(
                request=e.request,
                response=e.response,
                message=f"Failed after {max_retries} retries with 403 Forbidden error.",
            )

        return wrapper

    return decorator
