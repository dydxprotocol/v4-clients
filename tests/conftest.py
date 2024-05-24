import random
import time

import pytest

from dydx_v4_client import NodeClient
from dydx_v4_client.indexer.rest.constants import (
    FaucetApiHost,
    IndexerApiHost,
    IndexerConfig,
    IndexerWSHost,
    NobleClientHost,
)
from dydx_v4_client.indexer.rest.faucet_client import FaucetClient
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.indexer.rest.noble_client import NobleClient
from dydx_v4_client.indexer.rest.shared.rest import RestClient
from dydx_v4_client.indexer.socket.websocket import IndexerSocket
from dydx_v4_client.network import TESTNET
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


@pytest.fixture
def indexer_config():
    return IndexerConfig(
        rest_endpoint=IndexerApiHost.TESTNET, websocket_endpoint=IndexerWSHost.TESTNET
    )


@pytest.fixture
def indexer_rest_client(indexer_config):
    return IndexerClient(indexer_config)


@pytest.fixture
async def indexer_socket_client(indexer_config):
    return IndexerSocket(indexer_config)


@pytest.fixture
async def node():
    return await NodeClient.connect(TESTNET.node)
async def faucet_client(indexer_config):
    return FaucetClient(faucet_url=FaucetApiHost.TESTNET)


@pytest.fixture
async def node_client():
    return await NodeClient.connect(TESTNET.chain_id, TESTNET.node)


@pytest.fixture
async def noble_client():
    client = NobleClient(NobleClientHost.TESTNET)
    await client.connect(DYDX_TEST_MNEMONIC)
    yield client


@pytest.fixture
def test_address():
    return "dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art"


@pytest.fixture
def recipient():
    return "dydx1slanxj8x9ntk9knwa6cvfv2tzlsq5gk3dshml0"


@pytest.fixture
async def account(node_client, test_address):
    return await node_client.get_account(test_address)


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


@pytest.fixture
def wallet(private_key, account):
    return Wallet(private_key, account.account_number, account.sequence)
