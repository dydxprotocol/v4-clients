import math
from dataclasses import dataclass
from datetime import datetime, timedelta

from v4_proto.dydxprotocol.clob.order_pb2 import Order, OrderId

from dydx_v4_client.indexer.rest.constants import OrderType, OrderExecution
from dydx_v4_client.node.chain_helpers import OrderHelper
from dydx_v4_client.node.message import (
    order,
    order_id,
    builder_code_parameters,
    twap_parameters,
)


def since_now(*args, **kwargs) -> int:
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
        return result

    def calculate_subticks(
        self,
        price: float,
    ) -> int:
        QUOTE_QUANTUMS_ATOMIC_RESOLUTION = -6
        exponent = (
            self.market["atomicResolution"]
            - self.market["quantumConversionExponent"]
            - QUOTE_QUANTUMS_ATOMIC_RESOLUTION
        )
        raw_subticks = price * 10**exponent
        subticks = round_down(raw_subticks, self.market["subticksPerTick"])
        result = max(subticks, self.market["subticksPerTick"])
        return result

    def order_id(
        self, address: str, subaccount_number: int, client_id: int, order_flags: int
    ) -> OrderId:
        return order_id(
            address,
            subaccount_number,
            client_id,
            int(self.market["clobPairId"]),
            order_flags,
        )

    def order(
        self,
        order_id: OrderId,
        order_type: OrderType,
        side: Order.Side,
        size: float,
        price: int,
        time_in_force: Order.TimeInForce,
        reduce_only: bool,
        post_only: bool = False,
        good_til_block: int = None,
        good_til_block_time: int = None,
        execution: OrderExecution = OrderExecution.DEFAULT,
        condition_type=None,
        conditional_order_trigger_subticks: int = 0,
        builder_address: str = None,
        fee_ppm: int = None,
        twap_duration: int = None,
        twap_interval: int = None,
        twap_price_tolerance: int = None,
        order_router_address: str = None,
    ) -> Order:
        order_time_in_force = OrderHelper.calculate_time_in_force(
            order_type, time_in_force, post_only, execution
        )
        client_metadata = OrderHelper.calculate_client_metadata(order_type)

        # Use the provided condition_type if given, otherwise calculate it
        if condition_type is None:
            condition_type = OrderHelper.calculate_condition_type(order_type)

        return order(
            order_id=order_id,
            side=side,
            quantums=self.calculate_quantums(size),
            subticks=self.calculate_subticks(price),
            time_in_force=order_time_in_force,
            reduce_only=reduce_only,
            good_til_block=good_til_block,
            good_til_block_time=good_til_block_time,
            client_metadata=client_metadata,
            condition_type=condition_type,
            conditional_order_trigger_subticks=conditional_order_trigger_subticks,
            builder_code_parameters=builder_code_parameters(builder_address, fee_ppm),
            twap_parameters=twap_parameters(
                twap_duration, twap_interval, twap_price_tolerance
            ),
            order_router_address=order_router_address,
        )
