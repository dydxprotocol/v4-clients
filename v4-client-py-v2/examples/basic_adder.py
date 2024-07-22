import asyncio
import logging
from decimal import Decimal

from v4_proto.dydxprotocol.clob.order_pb2 import OrderId, Order

from dydx_v4_client.indexer.rest.constants import OrderSide, OrderTimeInForce
from dydx_v4_client.indexer.socket.websocket import (
    IndexerSocket,
    OrderBook,
    Subaccounts,
)
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.message import order, order_id
from dydx_v4_client.wallet import Wallet, from_string
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
    def __init__(
        self, node_client: NodeClient, address: str, key: str, subaccount_number: int
    ):
        self.address = address
        self.key = from_string(bytes.fromhex(key))
        self.subaccount_number = subaccount_number
        self.node_client = node_client
        self.testnet_indexer_socket = IndexerSocket(
            TESTNET.websocket_indexer,
            on_open=self.on_open,
            on_message=self.on_message,
        )
        self.position = None
        self.provide_state = {
            OrderSide.BUY: {"type": "cancelled"},
            OrderSide.SELL: {"type": "cancelled"},
        }

    def on_open(self, ws):
        ws.subaccounts.subscribe(
            address=self.address, subaccount_number=self.subaccount_number
        )
        ws.markets.subscribe()
        ws.trades.subscribe(id=MARKET)
        ws.order_book.subscribe(id=MARKET)
        logging.info(
            "Testnet WebSocket is subscribed to subaccounts, markets, trades, order_book"
        )

    def on_message(self, ws, message):
        if message.get("channel") == Subaccounts.channel:
            asyncio.run(self.on_subaccount_update(message))
        if message.get("channel") == OrderBook.channel:
            asyncio.run(self.on_order_book_update(message))

    async def on_order_book_update(self, message):
        logging.info(f"Order book update: {message}")
        if message["id"] != MARKET:
            return

        if message["type"] == "subscribed":
            bids = [
                (Decimal(item["price"]), Decimal(item["size"]))
                for item in message["contents"]["bids"]
            ]
            asks = [
                (Decimal(item["price"]), Decimal(item["size"]))
                for item in message["contents"]["asks"]
            ]
        elif message["type"] == "channel_batch_data":
            bids = []
            asks = []
            for item in message["contents"]:
                if "bids" in item:
                    bids.append(
                        (Decimal(item["bids"][0][0]), Decimal(item["bids"][0][1]))
                    )
                elif "asks" in item:
                    asks.append(
                        (Decimal(item["asks"][0][0]), Decimal(item["asks"][0][1]))
                    )
        else:
            logging.warning(f"Unsupported order book message type: {message['type']}")
            return

        for side, book in [(OrderSide.BUY, bids), (OrderSide.SELL, asks)]:
            if book:
                book_price, _ = book[0]
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
                    logging.info("Not placing an order because in flight")
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
                        self.provide_state[side] = {
                            "type": "resting",
                            "px": px,
                            "oid": oid,
                        }
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

    async def place_order(self, side: OrderSide, size: float, px: Decimal):
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
        quantums = int(Decimal(size) * Decimal("1e18"))
        subticks = int(Decimal(px) * Decimal("1e5"))

        clob_pair = await self.node_client.get_clob_pair(0)
        step_base_quantums = clob_pair.step_base_quantums
        subticks_per_tick = clob_pair.subticks_per_tick

        current_block = await self.node_client.latest_block_height()
        new_order = order(
            order_id=oid,
            side=Order.SIDE_BUY if side == OrderSide.BUY else Order.SIDE_SELL,
            quantums=(quantums // step_base_quantums) * step_base_quantums,
            subticks=(subticks // subticks_per_tick) * subticks_per_tick,
            time_in_force=time_in_force,
            reduce_only=False,
            good_til_block=current_block + 10,
        )

        transaction = await self.node_client.place_order(
            wallet=Wallet(
                key=self.key,
                sequence=account.sequence,
                account_number=account.account_number,
            ),
            order=new_order,
        )
        logging.info(f"Placed order transaction: {transaction}")

    async def cancel_order(self, oid: OrderId):
        account = await self.node_client.get_account(self.address)
        current_block = await self.node_client.latest_block_height()
        transaction = await self.node_client.cancel_order(
            wallet=Wallet(
                key=self.key,
                sequence=account.sequence,
                account_number=account.account_number,
            ),
            order_id=oid,
            good_til_block=current_block + 10,
        )
        logging.info(f"Cancelled order transaction: {transaction}")


async def main():
    address: str = "dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art"
    key: str = DYDX_TEST_PRIVATE_KEY
    subaccount_number: int = 0

    node = await NodeClient.connect(TESTNET.node)

    adder = BasicAdder(node, address, key, subaccount_number)

    await adder.testnet_indexer_socket.connect()


if __name__ == "__main__":
    import nest_asyncio

    nest_asyncio.apply()
    logging.info("Starting Basic Adder")
    asyncio.run(main())
