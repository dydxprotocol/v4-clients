"""Example for connecting to private WebSockets with an existing account.

Usage: python -m examples.websocket_example
"""

import asyncio
import json

from v4_client_py.clients.dydx_socket_client import SocketClient
from v4_client_py.clients.constants import Network

from tests.constants import DYDX_TEST_ADDRESS


def on_open(ws):
    print("WebSocket connection opened")
    ws.send_ping_if_inactive_for(30)


def on_message(ws, message):
    print(f"Received message: {message}")
    payload = json.loads(message)
    if payload["type"] == "connected":
        my_ws.subscribe_to_markets()
        my_ws.subscribe_to_orderbook("ETH-USD")
        my_ws.subscribe_to_trades("ETH-USD")
        my_ws.subscribe_to_candles("ETH-USD")
        my_ws.subscribe_to_subaccount(DYDX_TEST_ADDRESS, 0)
    ws.send_ping_if_inactive_for(30)
    ws.subscribe_to_markets()


def on_close(ws):
    print("WebSocket connection closed")


my_ws = SocketClient(config=Network.config_network().indexer_config, on_message=on_message, on_open=on_open, on_close=on_close)


async def main():
    my_ws.connect()

    # Do some stuff...

    # my_ws.close()


asyncio.get_event_loop().run_until_complete(main())
