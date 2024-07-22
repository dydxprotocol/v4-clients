from dydx_v4_client.indexer.rest.constants import (
    OrderType,
    OrderExecution,
    OrderTimeInForce,
)
from v4_proto.dydxprotocol.clob.order_pb2 import Order


class OrderHelper:
    @staticmethod
    def calculate_time_in_force(
        order_type: OrderType,
        time_in_force: Order.TimeInForce,
        post_only: bool = False,
        execution: OrderExecution = OrderExecution.DEFAULT,
    ) -> Order.TimeInForce:
        if order_type == OrderType.MARKET:
            return Order.TimeInForce.TIME_IN_FORCE_IOC
        elif order_type == OrderType.LIMIT:
            if post_only:
                return Order.TimeInForce.TIME_IN_FORCE_POST_ONLY
            else:
                return time_in_force
        elif order_type in [OrderType.STOP_LIMIT, OrderType.TAKE_PROFIT_LIMIT]:
            if execution == OrderExecution.DEFAULT:
                return Order.TimeInForce.TIME_IN_FORCE_UNSPECIFIED
            elif execution == OrderExecution.POST_ONLY:
                return Order.TimeInForce.TIME_IN_FORCE_POST_ONLY
            elif execution == OrderExecution.FOK:
                return Order.TimeInForce.TIME_IN_FORCE_FILL_OR_KILL
            elif execution == OrderExecution.IOC:
                return Order.TimeInForce.TIME_IN_FORCE_IOC
        elif order_type in [OrderType.STOP_MARKET, OrderType.TAKE_PROFIT_MARKET]:
            if execution in [OrderExecution.DEFAULT, OrderExecution.POST_ONLY]:
                raise ValueError(
                    f"Execution value {execution.value} not supported for {order_type.value}"
                )
            elif execution == OrderExecution.FOK:
                return Order.TimeInForce.TIME_IN_FORCE_FILL_OR_KILL
            elif execution == OrderExecution.IOC:
                return Order.TimeInForce.TIME_IN_FORCE_IOC
        raise ValueError(
            "Invalid combination of order type, time in force, and execution"
        )

    @staticmethod
    def calculate_client_metadata(order_type: OrderType) -> int:
        return (
            1
            if order_type
            in [OrderType.MARKET, OrderType.STOP_MARKET, OrderType.TAKE_PROFIT_MARKET]
            else 0
        )

    @staticmethod
    def calculate_condition_type(order_type: OrderType) -> Order.ConditionType:
        if order_type in [OrderType.LIMIT, OrderType.MARKET]:
            return Order.ConditionType.CONDITION_TYPE_UNSPECIFIED
        elif order_type in [OrderType.STOP_LIMIT, OrderType.STOP_MARKET]:
            return Order.ConditionType.CONDITION_TYPE_STOP_LOSS
        elif order_type in [OrderType.TAKE_PROFIT_LIMIT, OrderType.TAKE_PROFIT_MARKET]:
            return Order.ConditionType.CONDITION_TYPE_TAKE_PROFIT
        else:
            raise ValueError("Invalid order type")
