import asyncio

from dydx_v4_client.indexer.candles_resolution import CandlesResolution
from dydx_v4_client.indexer.socket.websocket import IndexerSocket
from dydx_v4_client.network import TESTNET
from tests.conftest import TEST_ADDRESS

ETH_USD = "ETH-USD"


def handle_message(ws: IndexerSocket, message: dict):
    if message["type"] == "connected":
        ws.markets.subscribe()
        ws.order_book.subscribe(ETH_USD)
        ws.trades.subscribe(ETH_USD)
        ws.candles.subscribe(ETH_USD, CandlesResolution.FIFTEEN_MINUTES)
        ws.subaccounts.subscribe(TEST_ADDRESS, 0)
    print(message)


async def test():
    await IndexerSocket(TESTNET.websocket_indexer, on_message=handle_message).connect()


asyncio.run(test())
