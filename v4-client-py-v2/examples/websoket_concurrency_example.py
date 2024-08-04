import asyncio
import threading
from typing import Any, Dict

from dydx_v4_client.indexer.candles_resolution import CandlesResolution
from dydx_v4_client.indexer.socket.websocket import IndexerSocket
from dydx_v4_client.network import TESTNET

ETH_USD = "ETH-USD"
RESOLUTION = CandlesResolution.ONE_MINUTE


class LiveCandleRepresentation:
    def __init__(self):
        self._ws = IndexerSocket(
            TESTNET.websocket_indexer,
            on_message=self.handle_message,
        )
        self._count = 1
        self.representation: Dict[str, Any] = {}

    def wrap_async_func(self) -> None:
        # NOTE: ._ws.connect() is a blocking async function call
        asyncio.run(self._ws.connect())

    def start_websocket_connection(self) -> None:
        t = threading.Thread(target=self.wrap_async_func)
        t.start()

    def handle_message(self, ws: IndexerSocket, message: dict):
        if message["type"] == "connected":
            ws.candles.subscribe(ETH_USD, RESOLUTION)

        if message["type"] == "channel_batch_data":
            if candle_dict := message["contents"][0]:
                self.representation = candle_dict
                print(f"Received {RESOLUTION.value}-candle update #{self._count}.\n")
                self._count += 1


async def some_candle_query(live_candle: LiveCandleRepresentation):
    while True:
        if candle := live_candle.representation:
            print(f"Query current candle: {candle}\n")
        await asyncio.sleep(20)  # Query every 20 seconds


async def test():
    live_candle = LiveCandleRepresentation()
    live_candle.start_websocket_connection()

    tasks = [asyncio.create_task(some_candle_query(live_candle))]
    await asyncio.gather(*tasks)


asyncio.run(test())
