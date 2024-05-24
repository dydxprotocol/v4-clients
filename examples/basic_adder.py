import asyncio
import logging
from decimal import Decimal

from dydx_v4_client.indexer.rest.constants import (
    IndexerApiHost,
    IndexerConfig,
    IndexerWSHost,
    OrderSide,
    OrderTimeInForce,
)
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.indexer.socket.websocket import IndexerSocket
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.message import order, order_id
from tests.conftest import DYDX_TEST_PRIVATE_KEY

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
    ],
)


COIN = "ETH"
MARKET = f"{COIN}-USD"
DEPTH = Decimal("0.003")
ALLOWABLE_DEVIATION = Decimal("0.5")
MAX_POSITION = Decimal("1.0")


class BasicAdder:
    def __init__(self, node_client, address, key, subaccount_number):
        self.address = address
        self.key = key
        self.subaccount_number = subaccount_number
        self.indexer_config = IndexerConfig(
            rest_endpoint=IndexerApiHost.TESTNET,
            websocket_endpoint=IndexerWSHost.TESTNET,
        )
        self.node_client = node_client
        self.indexer_client = IndexerClient(self.indexer_config)
        self.indexer_socket = IndexerSocket(
            self.indexer_config,
            on_open=self.on_open,
            on_message=self.on_message,
        )
        self.position = None
        self.provide_state = {
            "BUY": {"type": "cancelled"},
            "SELL": {"type": "cancelled"},
        }

    def on_open(self, ws):
        self.indexer_socket.subaccounts.subscribe(
            address=self.address, subaccount_number=self.subaccount_number
        )
        self.indexer_socket.markets.subscribe()
        self.indexer_socket.trades.subscribe(id=MARKET)
        self.indexer_socket.order_book.subscribe(id=MARKET)

        logging.info(
            "WebSocket is subscribed to markets, trades, order_book, subaccounts"
        )

    def on_message(self, ws, message):
        if message.get("channel") == "v4_subaccounts":
            asyncio.run(self.on_subaccount_update(message))
        elif message.get("channel") == "v4_orderbook":
            asyncio.run(self.on_order_book_update(message))

    async def on_order_book_update(self, message):
        logging.debug("Order book update", message)
        data = message["contents"]
        if message["id"] != MARKET:
            return

        for side in [OrderSide.BUY, OrderSide.SELL]:
            book_price = Decimal(
                data["bids" if side == OrderSide.BUY else "asks"][0]["price"]
            )
            ideal_distance = book_price * DEPTH
            ideal_price = book_price + (
                ideal_distance if side == OrderSide.BUY else -ideal_distance
            )

            provide_state = self.provide_state[side]
            if provide_state["type"] == "resting":
                distance = abs(ideal_price - Decimal(provide_state["px"]))
                if distance > ALLOWABLE_DEVIATION * ideal_distance:
                    oid = provide_state["oid"]
                    logging.info(
                        f"Cancelling order due to deviation oid:{oid} side:{side} "
                        f"ideal_price:{ideal_price} px:{provide_state['px']}"
                    )
                    await self.cancel_order(oid)
                    self.provide_state[side] = {"type": "cancelled"}
            elif provide_state["type"] == "in_flight_order":
                # Skip if order is still in flight
                continue
            elif provide_state["type"] == "cancelled":
                if self.position is None:
                    logging.info(
                        "Not placing an order because waiting for next position refresh"
                    )
                    continue
                size = MAX_POSITION + (
                    self.position if side == OrderSide.BUY else -self.position
                )
                if size * ideal_price < Decimal("10"):
                    logging.info("Not placing an order because at position limit")
                    continue
                px = str(ideal_price)
                logging.info(f"Placing order size:{size} px:{px} side:{side}")
                self.provide_state[side] = {"type": "in_flight_order"}
                oid = await self.place_order(side, size, px)
                if oid:
                    self.provide_state[side] = {"type": "resting", "px": px, "oid": oid}
                else:
                    self.provide_state[side] = {"type": "cancelled"}

    async def on_subaccount_update(self, message):
        data = message["contents"]["subaccount"]
        self.position = sum(
            Decimal(position["size"])
            for position in data["openPerpetualPositions"].values()
            if position["market"] == MARKET
        )
        logging.info(f"Updated position for {MARKET}: {self.position}")

    async def place_order(self, side, size, px):
        account = await self.node_client.get_account(self.address)
        oid = order_id(
            address=self.address,
            subaccount_number=self.subaccount_number,
            client_id=0,
            clob_pair_id=0,
            order_flags=0,
        )
        time_in_force = (
            OrderTimeInForce.GTT if side == OrderSide.BUY else OrderTimeInForce.IOC
        )
        new_order = order(
            order_id=oid,
            side=side,
            quantums=int(size * Decimal("1e18")),
            subticks=int(Decimal(px) * Decimal("1e5")),
            time_in_force=time_in_force,
            reduce_only=False,
        )
        transaction = await self.node_client.broadcast().place_order(
            key=self.key,
            order=new_order,
            account_number=account.account_number,
            sequence=account.sequence,
        )
        logging.info(f"Placed order transaction: {transaction}")

    async def cancel_order(self, oid):
        account = await self.node_client.get_account(self.address)
        transaction = await self.node_client.broadcast().cancel_order(
            key=self.key,
            account_number=account.account_number,
            sequence=account.sequence,
            order_id=oid,
        )
        logging.info(f"Cancelled order transaction: {transaction}")


async def main():
    address = "dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art"
    key = DYDX_TEST_PRIVATE_KEY
    subaccount_number = 0

    node = await NodeClient.connect(TESTNET.chain_id, TESTNET.node)

    adder = BasicAdder(node, address, key, subaccount_number)
    await adder.indexer_socket.connect()


if __name__ == "__main__":
    import nest_asyncio

    nest_asyncio.apply()
    logging.info("Starting Basic Adder")
    asyncio.run(main())
