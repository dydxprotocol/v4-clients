# Chain Constants
GOV_MODULE_ADDRESS = "dydx10d07y265gmmuvt4z0w9aw880jnsr700jnmapky"
DELAYMSG_MODULE_ADDRESS = "dydx1mkkvp26dngu6n8rmalaxyp3gwkjuzztq5zx6tr"


# Market Statistic Day Types
class MarketStatisticDay:
    ONE = "1"
    SEVEN = "7"
    THIRTY = "30"


# Order Types
class OrderType:
    LIMIT = "LIMIT"
    MARKET = "MARKET"
    STOP_LIMIT = "STOP_LIMIT"
    TAKE_PROFIT_LIMIT = "TAKE_PROFIT"
    STOP_MARKET = "STOP_MARKET"
    TAKE_PROFIT_MARKET = "TAKE_PROFIT_MARKET"


# Order Side
class OrderSide:
    BUY = "SIDE_BUY"
    SELL = "SIDE_SELL"


# Order TimeInForce
class OrderTimeInForce:
    GTT = "TIME_IN_FORCE_UNSPECIFIED"
    IOC = "TIME_IN_FORCE_IOC"
    FOK = "TIME_IN_FORCE_FILL_OR_KILL"


# Order Execution
class OrderExecution:
    DEFAULT = "DEFAULT"
    IOC = "IOC"
    FOK = "FOK"
    POST_ONLY = "POST_ONLY"


# Order Status
class OrderStatus:
    BEST_EFFORT_OPENED = "BEST_EFFORT_OPENED"
    OPEN = "OPEN"
    FILLED = "FILLED"
    BEST_EFFORT_CANCELED = "BEST_EFFORT_CANCELED"
    CANCELED = "CANCELED"


class TickerType:
    PERPETUAL = "PERPETUAL"  # Only PERPETUAL is supported right now


class PositionStatus:
    OPEN = "OPEN"
    CLOSED = "CLOSED"
    LIQUIDATED = "LIQUIDATED"


# Time Period for Sparklines
class TimePeriod:
    ONE_DAY = "ONE_DAY"
    SEVEN_DAYS = "SEVEN_DAYS"


class TradingRewardAggregationPeriod:
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"


# API Defaults
DEFAULT_API_TIMEOUT = 3_000
MAX_MEMO_CHARACTERS = 256
SHORT_BLOCK_WINDOW = 20
SHORT_BLOCK_FORWARD = 3
