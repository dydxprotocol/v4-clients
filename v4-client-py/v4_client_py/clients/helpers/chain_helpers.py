
from enum import Flag, auto, Enum
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

# FE enums. Do not pass these directly into the order proto TimeInForce field.
class OrderTimeInForce(Flag):
    GTT = auto()    # Good Til Time
    IOC = auto()    # Immediate or Cancel
    FOK = auto()    # Fill or Kill

class OrderExecution(Flag):
    DEFAULT = 0         # Default. Note proto enums start at 0, which is why this start at 0.
    IOC = auto()        # Immediate or Cancel
    POST_ONLY = auto()  # Post-only
    FOK = auto()        # Fill or Kill

# Enums to use in order proto fields. Use proto generated fields once that's fixed.
# should match https://github.com/dydxprotocol/v4-chain/blob/main/proto/dydxprotocol/clob/order.proto#L159
class Order_TimeInForce(Flag):

    '''
    TIME_IN_FORCE_UNSPECIFIED - TIME_IN_FORCE_UNSPECIFIED represents the default behavior where an
    order will first match with existing orders on the book, and any
    remaining size will be added to the book as a maker order.
    '''
    TIME_IN_FORCE_UNSPECIFIED = 0

    '''
    TIME_IN_FORCE_IOC - TIME_IN_FORCE_IOC enforces that an order only be matched with
    maker orders on the book. If the order has remaining size after
    matching with existing orders on the book, the remaining size
    is not placed on the book.
    '''
    TIME_IN_FORCE_IOC = 1

    '''
    TIME_IN_FORCE_POST_ONLY - TIME_IN_FORCE_POST_ONLY enforces that an order only be placed
    on the book as a maker order. Note this means that validators will cancel
    any newly-placed post only orders that would cross with other maker
    orders.
    '''
    TIME_IN_FORCE_POST_ONLY = 2

    '''
    TIME_IN_FORCE_FILL_OR_KILL - TIME_IN_FORCE_FILL_OR_KILL enforces that an order will either be filled
    completely and immediately by maker orders on the book or canceled if the
    entire amount can‘t be matched.
    '''
    TIME_IN_FORCE_FILL_OR_KILL = 3

ORDER_FLAGS_SHORT_TERM = 0
ORDER_FLAGS_LONG_TERM = 64
ORDER_FLAGS_CONDITIONAL = 32

SHORT_BLOCK_WINDOW = 20

QUOTE_QUANTUMS_ATOMIC_RESOLUTION = -6

def is_order_flag_stateful_order(
    order_flag: int
) -> bool:
    if order_flag == ORDER_FLAGS_SHORT_TERM:
        return False
    elif order_flag == ORDER_FLAGS_LONG_TERM:
        return True
    elif order_flag == ORDER_FLAGS_CONDITIONAL:
        return True
    else:
        raise ValueError('Invalid order flag')

def validate_good_til_fields(
    is_stateful_order: bool,
    good_til_block_time: int,
    good_til_block: int,
):
    if is_stateful_order:
        if good_til_block_time == 0:
            raise ValueError(
                "stateful orders must have a valid GTBT. GTBT: ${0}".format(
                    good_til_block_time,
                )
            )
        if good_til_block != 0:
            raise ValueError(
                "stateful order uses GTBT. GTB must be zero. GTB: ${0}".format(
                    good_til_block,
                )
            )
    else:
        if good_til_block == 0:
            raise ValueError(
                "short term orders must have a valid GTB. GTB: ${0}".format(
                    good_til_block,
                )
            )
        if good_til_block_time != 0:
            raise ValueError(
                "stateful order uses GTB. GTBT must be zero. GTBT: ${0}".format(
                    good_til_block_time,
                )
            )

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
) -> Order_TimeInForce:
    if type == OrderType.MARKET:
        return Order_TimeInForce.TIME_IN_FORCE_IOC
    elif type == OrderType.LIMIT:
        if time_in_force == OrderTimeInForce.GTT:
            if post_only:
                return Order_TimeInForce.TIME_IN_FORCE_POST_ONLY
            else:
                return Order_TimeInForce.TIME_IN_FORCE_UNSPECIFIED
        elif time_in_force == OrderTimeInForce.FOK:
            return Order_TimeInForce.TIME_IN_FORCE_FILL_OR_KILL
        elif time_in_force == OrderTimeInForce.IOC:
            return Order_TimeInForce.TIME_IN_FORCE_IOC
        else:
            raise Exception("Unexpected code path: time_in_force")
    elif type == OrderType.STOP_LIMIT or type == OrderType.TAKE_PROFIT_LIMIT:
        if execution == OrderExecution.DEFAULT:
            return Order_TimeInForce.TIME_IN_FORCE_UNSPECIFIED
        elif execution == OrderExecution.POST_ONLY:
            return Order_TimeInForce.TIME_IN_FORCE_POST_ONLY
        if execution == OrderExecution.FOK:
            return Order_TimeInForce.TIME_IN_FORCE_FILL_OR_KILL
        elif execution == OrderExecution.IOC:
            return Order_TimeInForce.TIME_IN_FORCE_IOC
        else:
            raise Exception("Unexpected code path: time_in_force")
    elif type == OrderType.STOP_MARKET or type == OrderType.TAKE_PROFIT_MARKET:
        if execution == OrderExecution.DEFAULT:
            raise Exception("Execution value DEFAULT not supported for STOP_MARKET or TAKE_PROFIT_MARKET")
        elif execution == OrderExecution.POST_ONLY:
            raise Exception("Execution value POST_ONLY not supported for STOP_MARKET or TAKE_PROFIT_MARKET")
        if execution == OrderExecution.FOK:
            return Order_TimeInForce.TIME_IN_FORCE_FILL_OR_KILL
        elif execution == OrderExecution.IOC:
            return Order_TimeInForce.TIME_IN_FORCE_IOC
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
    