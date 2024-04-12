import json
import websocket
import threading
import time

from .constants import IndexerConfig

class SocketClient:
    def __init__(
        self,
        config: IndexerConfig, 
        on_message=None, 
        on_open=None, 
        on_close=None
    ):
        self.url = config.websocket_endpoint
        self.ws = None
        self.on_message = on_message
        self.on_open = on_open
        self.on_close = on_close
        self.last_activity_time = None

    def connect(self):
        self.ws = websocket.WebSocketApp(self.url,
                                         on_open=self._on_open,
                                         on_message=self._on_message,
                                         on_close=self._on_close)

        self.ws.run_forever()

    def _on_open(self, ws):
        if self.on_open:
            self.on_open(ws)
        else:
            print('WebSocket connection opened')
        self.last_activity_time = time.time()

    def _on_message(self, ws, message):
        if self.on_message:
            self.on_message(ws, message)
        else:
            print(f'Received message: {message}')
        self.last_activity_time = time.time()

    def _on_close(self, ws):
        if self.on_close:
            self.on_close(ws)
        else:
            print('WebSocket connection closed')
        self.last_activity_time = None

    def send(self, message):
        if self.ws:
            self.ws.send(message)
            self.last_activity_time = time.time()
        else:
            print('Error: WebSocket is not connected')

    def close(self):
        if self.ws:
            self.ws.close()
        else:
            print('Error: WebSocket is not connected')

    def subscribe(self, channel, params=None):
        if params is None:
            params = {}
        message = json.dumps({'type': 'subscribe', 'channel': channel, **params})
        self.send(message)

    def unsubscribe(self, channel, params=None):
        if params is None:
            params = {}
        message = json.dumps({'type': 'unsubscribe', 'channel': channel, **params})
        self.send(message)

    def subscribe_to_markets(self):
        self.subscribe('v4_markets', {'batched': 'true'})

    def unsubscribe_from_markets(self):
        self.unsubscribe('v4_markets', {})

    def subscribe_to_trades(self, market: str):
        self.subscribe('v4_trades', {'id': market, 'batched': 'true'})

    def unsubscribe_from_trades(self, market: str):
        self.unsubscribe('v4_trades', {'id': market})

    def subscribe_to_orderbook(self, market: str):
        self.subscribe('v4_orderbook', {'id': market, 'batched': 'true'})

    def unsubscribe_from_orderbook(self, market: str):
        self.unsubscribe('v4_orderbook', {'id': market})

    def subscribe_to_candles(self, market: str):
        self.subscribe('v4_candles', {'id': market, 'batched': 'true'})

    def unsubscribe_from_candles(self, market: str):
        self.unsubscribe('v4_candles', {'id': market})

    def subscribe_to_subaccount(self, address: str, subaccount_number: int):
        subaccount_id = '/'.join([address, str(subaccount_number)])
        self.subscribe('v4_subaccounts', {'id': subaccount_id})

    def unsubscribe_from_subaccount(self, address: str, subaccount_number: int):
        subaccount_id = '/'.join([address, str(subaccount_number)])
        self.unsubscribe('v4_subaccounts', {'id': subaccount_id})
