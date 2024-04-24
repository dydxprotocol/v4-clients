from dataclasses import dataclass, field
from typing import Any, Callable, Optional, Self, Union

import websocket
from dydx_v4_client.network import Network
import json
# from websockets.sync.client import connect, ClientConnection
import rel


@dataclass
class Channel:
    channel: str = field(init=False)
    app: websocket.WebSocketApp
    # kwargs: dict = field(init=False)

    def subscribe(self, **kwargs) -> Self:
        self.kwargs = kwargs
        self.app.send(json.dumps({'type': 'subscribe', 'channel': self.channel, **kwargs}))
        return self
    
    def unsubscribe(self, **kwargs):
        self.app.send(json.dumps({'type': 'unsubscribe', 'channel': self.channel, **kwargs}))
    
    def process(self, message):
        """
        WIP.
        An idea to provide per-channel processing instead of `on_message` for all messages.

        Maybe allow creating standalone channels? Ie.:
        order_book = OrderBook()
        order_book.subscribe(id="BTC-USD")
        """
        raise NotImplementedError()

    # def __enter__(self) -> Self:
    #     return self

    # def __exit__(self, exc_type, exc_value, traceback):
    #     self.unsubscribe(**self.kwargs)
    
    # def recv(self, *args, **kwargs):
    #     return self.connection.recv(*args, **kwargs)

def as_json(on_message):
    def wrapper(ws, message):
        return on_message(ws, json.loads(message))
    return wrapper

def channel_only(on_message):
    def wrapper(ws, message):
        if message["type"] == "connected":
            return
        return on_message(ws, message)
    return wrapper


class OrderBook(Channel):
    channel = "v4_orderbook"

    def subscribe(self, id) -> Self:
        return super().subscribe(id=id)
    
    def unsubscribe(self, id):
        return super().unsubscribe(id=id)
        

class Indexer(websocket.WebSocketApp):
    def __init__(self, url: str,
        header: Union[list, dict, Callable, None] = None,
        on_open: Optional[Callable[[websocket.WebSocket], None]] = None,
        on_message: Optional[Callable[[websocket.WebSocket, Any], None]] = None, *args, **kwargs):
        self.name_to_channel = {}
        self.order_book = OrderBook(self)
        # self.order_book = self.register(OrderBook)

        super().__init__(url, header, on_open, as_json(on_message), *args, **kwargs)

    @staticmethod
    async def connect(*args, **kwargs) -> Self:
        indexer = Indexer(*args, **kwargs)
        # indexer.run_forever(dispatcher=rel)
        indexer.run_forever()
    

    # def register(self, ChannelClass: Channel):
    #     channel = ChannelClass(self)
    #     self.name_to_channel[channel.channel] = channel
    #     return channel

    # def _on_message(self, ws, message):
    #     process = message["channel"]


# @dataclass
# class Indexer:
#     connection: ClientConnection
#     order_book: Channel

#     @staticmethod
#     async def connect(url: str) -> Self:
#         connection = connect(url)
#         return Indexer(connection,
#                        OrderBook(connection)
#                        )
    

#     def __enter__(self):
#         self.connection.__enter__()
#         return self

#     def __exit__(self, exc_type, exc_value, traceback):
#         return self.connection.__exit__(exc_type, exc_value, traceback)

#     def recv(self, *args, **kwargs):
#         return self.connection.recv(*args, **kwargs)
