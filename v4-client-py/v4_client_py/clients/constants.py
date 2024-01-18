from enum import Enum

# define constants
VALIDATOR_GRPC_ENDPOINT = '{get from deployer}'
AERIAL_CONFIG_URL = '{get from deployer}'
AERIAL_GRPC_OR_REST_PREFIX = '{get from deployer}'
INDEXER_REST_ENDPOINT = '{get from deployer}'
INDEXER_WS_ENDPOINT = '{get from deployer}'
CHAIN_ID = '{get from deployer}'
ENV = '{get from deployer}'

# ------------ Market Statistic Day Types ------------
MARKET_STATISTIC_DAY_ONE = "1"
MARKET_STATISTIC_DAY_SEVEN = "7"
MARKET_STATISTIC_DAY_THIRTY = "30"

# ------------ Order Types ------------
ORDER_TYPE_LIMIT = "LIMIT"
ORDER_TYPE_MARKET = "MARKET"
ORDER_TYPE_STOP = "STOP_LIMIT"
ORDER_TYPE_TRAILING_STOP = "TRAILING_STOP"
ORDER_TYPE_TAKE_PROFIT = "TAKE_PROFIT"

# ------------ Order Side ------------
ORDER_SIDE_BUY = "BUY"
ORDER_SIDE_SELL = "SELL"

# ------------ Time in Force Types ------------
TIME_IN_FORCE_GTT = "GTT"
TIME_IN_FORCE_FOK = "FOK"
TIME_IN_FORCE_IOC = "IOC"

# ------------ Position Status Types ------------
POSITION_STATUS_OPEN = "OPEN"
POSITION_STATUS_CLOSED = "CLOSED"
POSITION_STATUS_LIQUIDATED = "LIQUIDATED"

# ------------ Order Status Types ------------
ORDER_STATUS_PENDING = "PENDING"
ORDER_STATUS_OPEN = "OPEN"
ORDER_STATUS_FILLED = "FILLED"
ORDER_STATUS_CANCELED = "CANCELED"
ORDER_STATUS_UNTRIGGERED = "UNTRIGGERED"

# ------------ Transfer Status Types ------------
TRANSFER_STATUS_PENDING = "PENDING"
TRANSFER_STATUS_CONFIRMED = "CONFIRMED"
TRANSFER_STATUS_QUEUED = "QUEUED"
TRANSFER_STATUS_CANCELED = "CANCELED"
TRANSFER_STATUS_UNCONFIRMED = "UNCONFIRMED"

# ------------ Markets ------------
MARKET_BTC_USD = "BTC-USD"
MARKET_ETH_USD = "ETH-USD"


# ------------ Assets ------------
ASSET_USDC = "USDC"
ASSET_BTC = "BTC"
ASSET_ETH = "ETH"
COLLATERAL_ASSET = ASSET_USDC

# ------------ Synthetic Assets by Market ------------
SYNTHETIC_ASSET_MAP = {
    MARKET_BTC_USD: ASSET_BTC,
    MARKET_ETH_USD: ASSET_ETH,
}

# ------------ API Defaults ------------
DEFAULT_API_TIMEOUT = 3000

MAX_MEMO_CHARACTERS = 256

BECH32_PREFIX = "dydx"


class BroadcastMode(Enum):
    BroadcastTxSync = 0
    BroadcastTxCommit = 1


class IndexerConfig:
    def __init__(
        self,
        rest_endpoint: str,
        websocket_endpoint: str,
    ):
        if rest_endpoint.endswith("/"):
            rest_endpoint = rest_endpoint[:-1]
        self.rest_endpoint = rest_endpoint
        self.websocket_endpoint = websocket_endpoint


class ValidatorConfig:
    def __init__(self, grpc_endpoint: str, chain_id: str, ssl_enabled: bool, url_prefix: str, aerial_url: str):
        self.grpc_endpoint = grpc_endpoint
        self.chain_id = chain_id
        self.ssl_enabled = ssl_enabled
        self.url_prefix = url_prefix
        self.url = aerial_url


class Network:
    def __init__(
        self,
        env: str,
        validator_config: ValidatorConfig,
        indexer_config: IndexerConfig,
        faucet_endpoint: str,
    ):
        self.env = env
        self.validator_config = validator_config
        self.indexer_config = indexer_config
        if faucet_endpoint is not None and faucet_endpoint.endswith("/"):
            faucet_endpoint = faucet_endpoint[:-1]
        self.faucet_endpoint = faucet_endpoint

    @classmethod
    def config_network(
        cls
    ) -> "Network":
        validator_config = ValidatorConfig(
            grpc_endpoint=VALIDATOR_GRPC_ENDPOINT,
            chain_id=CHAIN_ID,
            ssl_enabled=True,
            url_prefix=AERIAL_GRPC_OR_REST_PREFIX,
            aerial_url=AERIAL_CONFIG_URL,
        )
        indexer_config = IndexerConfig(rest_endpoint=INDEXER_REST_ENDPOINT, websocket_endpoint=INDEXER_WS_ENDPOINT)
        return cls(
            env=ENV,
            validator_config=validator_config,
            indexer_config=indexer_config,
            faucet_endpoint=None,
        )
