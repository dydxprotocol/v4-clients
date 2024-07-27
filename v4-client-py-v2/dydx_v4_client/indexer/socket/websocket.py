import json
import ssl
from dataclasses import dataclass, field

import websocket
from typing_extensions import Any, Callable, Optional, Self, Union

from dydx_v4_client.indexer.candles_resolution import CandlesResolution


@dataclass
class Channel:
    channel: str = field(init=False)
    app: websocket.WebSocketApp

    def subscribe(self, **kwargs) -> Self:
        self.app.send(
            json.dumps({"type": "subscribe", "channel": self.channel, **kwargs})
        )
        return self

    def unsubscribe(self, **kwargs):
        self.app.send(
            json.dumps({"type": "unsubscribe", "channel": self.channel, **kwargs})
        )

    def process(self, message):
        """
        WIP.
        An idea to provide per-channel processing instead of `on_message` for all messages.

        Maybe allow creating standalone channels? Ie.:
        order_book = OrderBook()
        order_book.subscribe(id="BTC-USD")
        """
        raise NotImplementedError()


class OrderBook(Channel):
    channel = "v4_orderbook"

    def subscribe(self, id, batched=True) -> Self:
        return super().subscribe(id=id, batched=batched)

    def unsubscribe(self, id):
        return super().unsubscribe(id=id)


class Trades(Channel):
    channel = "v4_trades"

    def subscribe(self, id, batched=True) -> Self:
        return super().subscribe(id=id, batched=batched)

    def unsubscribe(self, id):
        return super().unsubscribe(id=id)


class Markets(Channel):
    channel = "v4_markets"

    def subscribe(self, batched=True) -> Self:
        return super().subscribe(batched=batched)

    def unsubscribe(self):
        return super().unsubscribe()


class Candles(Channel):
    channel = "v4_candles"

    def subscribe(self, id: str, resolution: CandlesResolution, batched=True) -> Self:
        return super().subscribe(id=f"{id}/{resolution.value}", batched=batched)

    def unsubscribe(self, id: str, resolution: CandlesResolution):
        return super().unsubscribe(id=f"{id}/{resolution.value}")


class Subaccounts(Channel):
    channel = "v4_subaccounts"

    def subscribe(self, address, subaccount_number) -> Self:
        subaccount_id = f"{address}/{subaccount_number}"
        return super().subscribe(id=subaccount_id)

    def unsubscribe(self, address, subaccount_number):
        subaccount_id = f"{address}/{subaccount_number}"
        return super().unsubscribe(id=subaccount_id)


def as_json(on_message):
    def wrapper(ws, message):
        return on_message(ws, json.loads(message))

    return wrapper


class IndexerSocket(websocket.WebSocketApp):
    def __init__(
        self,
        url: str,
        header: Union[list, dict, Callable, None] = None,
        on_open: Optional[Callable[[websocket.WebSocket], None]] = None,
        on_message: Optional[Callable[[websocket.WebSocket, Any], None]] = None,
        *args,
        **kwargs,
    ):
        self.order_book = OrderBook(self)
        self.trades = Trades(self)
        self.markets = Markets(self)
        self.candles = Candles(self)
        self.subaccounts = Subaccounts(self)

        super().__init__(
            url=url,
            header=header,
            on_open=on_open,
            on_message=as_json(on_message),
            *args,
            **kwargs,
        )

    async def connect(self, sslopt={"cert_reqs": ssl.CERT_NONE}) -> None:
        self.run_forever(sslopt=sslopt)
