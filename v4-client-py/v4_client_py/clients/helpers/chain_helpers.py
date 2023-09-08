
from enum import Flag, auto
from v4_proto.dydxprotocol.clob.order_pb2 import Order

class OrderType(Flag):
    MARKET = auto()
    LIMIT = auto()
    STOP_MARKET = auto()
    TAKE_PROFIT_MARKET = auto()
    STOP_LIMIT = auto()
    TAKE_PROFIT_LIMIT = auto()

class OrderSide(Flag):
    BUY = auto()
    SELL = auto()
    
class OrderTimeInForce(Flag):
    GTT = auto()    # Good Til Time
    IOC = auto()    # Immediate or Cancel
    FOK = auto()    # Fill or Kill

class OrderExecution(Flag):
    DEFAULT = auto()    # Default, STOP_LIMIT and TAKE_PROFIT_LIMIT
    POST_ONLY = auto()  # Post-only, STOP_LIMIT and TAKE_PROFIT_LIMIT
    IOC = auto()        # Immediate or Cancel
    FOK = auto()        # Fill or Kill

ORDER_FLAGS_SHORT_TERM = 0
ORDER_FLAGS_LONG_TERM = 64
ORDER_FLAGS_CONDITIONAL = 32

QUOTE_QUANTUMS_ATOMIC_RESOLUTION = -6


def round(
    number: float,
    base: int
) -> int:
    return int(number / base) * base

def calculate_quantums(
    size: float, 
    atomic_resolution: int, 
    step_base_quantums: int,
):
    raw_quantums = size * 10**(-1 * atomic_resolution)
    quantums = round(raw_quantums, step_base_quantums)
    # step_base_quantums functions as the minimum order size
    return max(quantums, step_base_quantums)

def calculate_subticks(
    price: float,
    atomic_resolution: int,
    quantum_conversion_exponent: int,
    subticks_per_tick: int
):
    exponent = atomic_resolution - quantum_conversion_exponent - QUOTE_QUANTUMS_ATOMIC_RESOLUTION
    raw_subticks = price * 10**(exponent)
    subticks = round(raw_subticks, subticks_per_tick)
    return max(subticks, subticks_per_tick)

def calculate_side(
    side: OrderSide,
) -> Order.Side:
    return Order.SIDE_BUY if side == OrderSide.BUY else Order.SIDE_SELL
    
def calculate_time_in_force(
    type: OrderType, 
    time_in_force: OrderTimeInForce, 
    execution: OrderExecution, 
    post_only: bool
) -> Order.TimeInForce:
    if type == OrderType.MARKET:
        return Order.TIME_IN_FORCE_IOC
    elif type == OrderType.LIMIT:
        if time_in_force == OrderTimeInForce.GTT:
            if post_only:
                return Order.TIME_IN_FORCE_POST_ONLY
            else:
                return Order.TIME_IN_FORCE_UNSPECIFIED
        elif time_in_force == OrderTimeInForce.FOK:
            return Order.TIME_IN_FORCE_FILL_OR_KILL
        elif time_in_force == OrderTimeInForce.IOC:
            return Order.TIME_IN_FORCE_IOC
        else:
            raise Exception("Unexpected code path: time_in_force")
    elif type == OrderType.STOP_LIMIT or type == OrderType.TAKE_PROFIT_LIMIT:
        if execution == OrderExecution.DEFAULT:
            return Order.TIME_IN_FORCE_UNSPECIFIED
        elif execution == OrderExecution.POST_ONLY:
            return Order.TIME_IN_FORCE_POST_ONLY
        if execution == OrderExecution.FOK:
            return Order.TIME_IN_FORCE_FOK
        elif execution == OrderExecution.IOC:
            return Order.TIME_IN_FORCE_IOC
        else:
            raise Exception("Unexpected code path: time_in_force")
    elif type == OrderType.STOP_MARKET or type == OrderType.TAKE_PROFIT_MARKET:
        if execution == OrderExecution.DEFAULT:
            raise Exception("Execution value DEFAULT not supported for STOP_MARKET or TAKE_PROFIT_MARKET")
        elif execution == OrderExecution.POST_ONLY:
            raise Exception("Execution value POST_ONLY not supported for STOP_MARKET or TAKE_PROFIT_MARKET")
        if execution == OrderExecution.FOK:
            return Order.TIME_IN_FORCE_FOK
        elif execution == OrderExecution.IOC:
            return Order.TIME_IN_FORCE_IOC
        else:
            raise Exception("Unexpected code path: time_in_force")
    else:
        raise Exception("Unexpected code path: time_in_force")

def calculate_execution_condition(reduce_only: bool) -> int:
    if reduce_only:
        return Order.EXECUTION_CONDITION_REDUCE_ONLY
    else:
        return Order.EXECUTION_CONDITION_UNSPECIFIED

def calculate_order_flags(type: OrderType, time_in_force: OrderTimeInForce) -> int:
    if type == OrderType.MARKET:
        return ORDER_FLAGS_SHORT_TERM
    elif type == OrderType.LIMIT:
        if time_in_force == OrderTimeInForce.GTT:
            return ORDER_FLAGS_LONG_TERM
        else:
            return ORDER_FLAGS_SHORT_TERM
    else:
        return ORDER_FLAGS_CONDITIONAL
    