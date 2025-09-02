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
from dydx_v4_client.node.mega_vault import MegaVault
from dydx_v4_client.node.message import order, order_id
from dydx_v4_client.wallet import Wallet
from dydx_v4_client.key_pair import KeyPair

from v4_proto.dydxprotocol.clob.order_pb2 import Order, OrderId
from v4_proto.cosmos.tx.v1beta1.service_pb2 import BroadcastTxResponse

pytest_plugins = ("pytest_asyncio",)

DYDX_TEST_PRIVATE_KEY = (
    "e92a6595c934c991d3b3e987ea9b3125bf61a076deab3a9cb519787b7b3e8d77"
)
DYDX_TEST_MNEMONIC = (
    "mirror actor skill push coach wait confirm orchard lunch mobile athlete gossip awake "
    "miracle matter bus reopen team ladder lazy list timber render wait"
)

DYDX_TEST_PUBLIC_KEY = (
    "03f0be763f781b5b59ebc37d721beda913148a539425baa720b97d4820f652ed75"
)
TEST_ADDRESS = "dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art"
RECIPIENT = "dydx1slanxj8x9ntk9knwa6cvfv2tzlsq5gk3dshml0"

# NOTE: took this from js client, seems to be inactive though
DYDX_TEST_MNEMONIC_2 = (
    "movie yard still copper exile wear brisk chest ride dizzy novel future menu finish "
    "radar lunar claim hub middle force turtle mouse frequent embark"
)
TEST_ADDRESS_2 = "dydx18sukah44zfkjndlhcdmhkjnarl2sevhwf894vh"


@pytest.fixture
def indexer_rest_client() -> IndexerClient:
    return IndexerClient("https://indexer.v4testnet.dydx.exchange")


@pytest.fixture
async def indexer_socket_client() -> IndexerSocket:
    return IndexerSocket(TESTNET.websocket_indexer)


@pytest.fixture
async def faucet_client() -> FaucetClient:
    return FaucetClient(faucet_url=TESTNET_FAUCET)


@pytest.fixture
async def node_client() -> NodeClient:
    return await NodeClient.connect(TESTNET.node)


@pytest.fixture
async def megavault() -> MegaVault:
    node = await NodeClient.connect(TESTNET.node)
    return MegaVault(node_client=node)


@pytest.fixture
async def noble_client():
    client = NobleClient(TESTNET_NOBLE)
    await client.connect(DYDX_TEST_MNEMONIC)
    yield client


@pytest.fixture
def test_address() -> str:
    return TEST_ADDRESS


@pytest.fixture
def test_public_key() -> str:
    return DYDX_TEST_PUBLIC_KEY


@pytest.fixture
def recipient() -> str:
    return RECIPIENT


@pytest.fixture
def key_pair() -> KeyPair:
    return KeyPair.from_mnemonic(DYDX_TEST_MNEMONIC)


@pytest.fixture
def test_order_id(test_address) -> OrderId:
    return order_id(
        test_address,
        subaccount_number=0,
        client_id=random.randint(0, 1000000000),
        clob_pair_id=0,
        order_flags=64,
    )


@pytest.fixture
def test_order(test_order_id) -> Order:
    return order(
        test_order_id,
        time_in_force=0,
        reduce_only=False,
        side=1,
        quantums=1000000,
        subticks=100000,
        good_til_block_time=int(time.time() + 60),
    )


@pytest.fixture
def test_order2(test_order_id) -> Order:
    return order(
        test_order_id,
        time_in_force=0,
        reduce_only=False,
        side=1,
        quantums=1000000,
        subticks=100000,
        good_til_block_time=int(time.time() + 60),
        builder_code_parameters=None,
        twap_parameters=None,
        order_router_address=None,
    )


async def get_wallet(node_client, key_pair, test_address) -> Wallet:
    account = await node_client.get_account(test_address)
    return Wallet(key_pair, account.account_number, account.sequence)


@pytest.fixture()
async def wallet(node_client, key_pair, test_address) -> Wallet:
    return await get_wallet(node_client, key_pair, test_address)


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


def is_successful(response) -> bool:
    return response.tx_response.code == 0


def assert_successful_broadcast(response):
    assert type(response) == BroadcastTxResponse
    assert is_successful(response)
