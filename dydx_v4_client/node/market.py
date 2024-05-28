import math
from dataclasses import dataclass
from datetime import datetime, timedelta

from v4_proto.dydxprotocol.clob.order_pb2 import Order

from dydx_v4_client.node.message import order, order_id


def since_now(*args, **kwargs):
    return int(round((datetime.now() + timedelta(*args, **kwargs)).timestamp()))


def round_down(input_value: float, base: float) -> float:
    return math.floor(input_value / base) * base


@dataclass
class Market:
    market: dict

    def calculate_quantums(self, size: float) -> int:
        raw_quantums = size * 10 ** (-self.market["atomicResolution"])
        quantums = round_down(raw_quantums, self.market["stepBaseQuantums"])

        result = max(quantums, self.market["stepBaseQuantums"])
        return int(result)

    def calculate_subticks(self, price: float) -> int:
        QUOTE_QUANTUMS_ATOMIC_RESOLUTION = -6
        exponent = (
            self.market["atomicResolution"]
            - self.market["quantumConversionExponent"]
            - QUOTE_QUANTUMS_ATOMIC_RESOLUTION
        )
        raw_subticks = price * 10**exponent
        subticks = round_down(raw_subticks, self.market["subticksPerTick"])
        result = max(subticks, self.market["subticksPerTick"])
        return int(result)

    def order_id(
        self, address: str, subaccount_number: int, client_id: int, order_flags: int
    ):
        return order_id(
            address,
            subaccount_number,
            client_id,
            int(self.market["clobPairId"]),
            order_flags,
        )

    def order(
        self,
        order_id: Order,
        side: Order.Side,
        size: float,
        price: int,
        time_in_force: Order.TimeInForce,
        reduce_only: bool,
        good_til_block: int = 0,
        good_til_block_time: int = 0,
        client_metadata: int = 0,
        condition_type: Order.ConditionType = Order.ConditionType.CONDITION_TYPE_UNSPECIFIED,
        conditional_order_trigger_subticks: int = 0,
    ) -> Order:
        return order(
            order_id,
            side,
            self.calculate_quantums(size),
            self.calculate_subticks(price),
            time_in_force,
            reduce_only,
            good_til_block,
            good_til_block_time,
            client_metadata,
            condition_type,
            conditional_order_trigger_subticks,
        )
