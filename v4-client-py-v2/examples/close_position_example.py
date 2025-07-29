import asyncio
import random

from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.market import Market
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS


async def close_position_example():
    indexer = IndexerClient(TESTNET.rest_indexer)
    node_client = await NodeClient.connect(TESTNET.node)
    wallet = await Wallet.from_mnemonic(
        node_client,
        mnemonic=DYDX_TEST_MNEMONIC,
        address=TEST_ADDRESS,
    )
    MARKET_ID = "ETH-USD"
    market = Market(
        (await indexer.markets.get_perpetual_markets(MARKET_ID))["markets"][MARKET_ID]
    )
    response = await node_client.close_position(
        wallet, TEST_ADDRESS, 0, market, None, random.randint(0, 1000000000)
    )
    print(response)


asyncio.run(close_position_example())
