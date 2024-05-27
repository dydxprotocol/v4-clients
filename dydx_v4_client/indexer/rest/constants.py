# Chain ID
DEV_CHAIN_ID = "dydxprotocol-testnet"
STAGING_CHAIN_ID = "dydxprotocol-testnet"
TESTNET_CHAIN_ID = "dydx-testnet-4"
LOCAL_CHAIN_ID = "localdydxprotocol"
MAINNET_CHAIN_ID = "dydx-mainnet-1"


# API URLs
class IndexerApiHost:
    TESTNET = "https://dydx-testnet.imperator.co"
    LOCAL = "http://localhost:3002"
    MAINNET = "https://indexer.dydx.trade"


class IndexerWSHost:
    TESTNET = "wss://dydx-testnet.imperator.co/v4/ws"
    LOCAL = "ws://localhost:3003"
    MAINNET = "wss://indexer.dydx.trade/v4/ws"


class NobleClientHost:
    TESTNET = "https://rpc.testnet.noble.strange.love"


class ValidatorApiHost:
    TESTNET = "https://test-dydx.kingnodes.com"
    LOCAL = "http://localhost:26657"
    MAINNET = "https://dydx-ops-rpc.kingnodes.com:443"


# Network IDs
class NetworkId:
    TESTNET = "dydx-testnet-4"
    MAINNET = "dydx-mainnet-1"


NETWORK_ID_TESTNET = "dydxprotocol-testnet"
NETWORK_ID_MAINNET = "dydx-mainnet-1"

# MsgType URLs
TYPE_URL_MSG_SEND = "/cosmos.bank.v1beta1.MsgSend"
TYPE_URL_MSG_SUBMIT_PROPOSAL = "/cosmos.gov.v1.MsgSubmitProposal"
TYPE_URL_MSG_PLACE_ORDER = "/dydxprotocol.clob.MsgPlaceOrder"
TYPE_URL_MSG_CANCEL_ORDER = "/dydxprotocol.clob.MsgCancelOrder"
TYPE_URL_MSG_CREATE_CLOB_PAIR = "/dydxprotocol.clob.MsgCreateClobPair"
TYPE_URL_MSG_UPDATE_CLOB_PAIR = "/dydxprotocol.clob.MsgUpdateClobPair"
TYPE_URL_MSG_DELAY_MESSAGE = "/dydxprotocol.delaymsg.MsgDelayMessage"
TYPE_URL_MSG_CREATE_PERPETUAL = "/dydxprotocol.perpetuals.MsgCreatePerpetual"
TYPE_URL_MSG_CREATE_ORACLE_MARKET = "/dydxprotocol.prices.MsgCreateOracleMarket"
TYPE_URL_MSG_CREATE_TRANSFER = "/dydxprotocol.sending.MsgCreateTransfer"
TYPE_URL_MSG_WITHDRAW_FROM_SUBACCOUNT = (
    "/dydxprotocol.sending.MsgWithdrawFromSubaccount"
)
TYPE_URL_MSG_DEPOSIT_TO_SUBACCOUNT = "/dydxprotocol.sending.MsgDepositToSubaccount"

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
    BUY = "BUY"
    SELL = "SELL"


# Order TimeInForce
class OrderTimeInForce:
    GTT = "GTT"
    IOC = "IOC"
    FOK = "FOK"


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


class IndexerConfig:
    def __init__(self, rest_endpoint: str, websocket_endpoint: str):
        self.rest_endpoint = rest_endpoint
        self.websocket_endpoint = websocket_endpoint


GAS_MULTIPLIER = 1.4
