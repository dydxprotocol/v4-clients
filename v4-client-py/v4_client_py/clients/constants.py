from enum import Enum

# ------------ API URLs ------------
INDEXER_API_HOST_MAINNET = None
INDEXER_API_HOST_TESTNET = 'https://dydx-testnet.imperator.co'

INDEXER_WS_HOST_MAINNET =  None
INDEXER_WS_HOST_TESTNET = 'wss://indexer.v4testnet.dydx.exchange/v4/ws'

FAUCET_API_HOST_TESTNET = 'https://faucet.v4testnet.dydx.exchange'

VALIDATOR_API_HOST_MAINNET = None
VALIDATOR_API_HOST_TESTNET = 'https://dydx-testnet-archive.allthatnode.com'

VALIDATOR_GRPC_MAINNET =  None
VALIDATOR_GRPC_TESTNET = 'dydx-testnet-archive.allthatnode.com:9090'

# ------------ Ethereum Network IDs../../v4_client_py/clients/constants.py ------------
NETWORK_ID_MAINNET = None
NETWORK_ID_TESTNET = 'dydx-testnet-4'

# ----------- Aerial configs -------------------
AERIAL_CONFIG_CHAIN_ID_TESTNET = "dydx-testnet-4"
AERIAL_CONFIG_CHAIN_ID_MAINNET = None

AERIAL_CONFIG_URL_TESTNET = "https://dydx-testnet-archive.allthatnode.com:9090"
AERIAL_CONFIG_URL_MAINNET = None

# ------------ Market Statistic Day Types ------------
MARKET_STATISTIC_DAY_ONE = '1'
MARKET_STATISTIC_DAY_SEVEN = '7'
MARKET_STATISTIC_DAY_THIRTY = '30'

# ------------ Order Types ------------
ORDER_TYPE_LIMIT = 'LIMIT'
ORDER_TYPE_MARKET = 'MARKET'
ORDER_TYPE_STOP = 'STOP_LIMIT'
ORDER_TYPE_TRAILING_STOP = 'TRAILING_STOP'
ORDER_TYPE_TAKE_PROFIT = 'TAKE_PROFIT'

# ------------ Order Side ------------
ORDER_SIDE_BUY = 'BUY'
ORDER_SIDE_SELL = 'SELL'

# ------------ Time in Force Types ------------
TIME_IN_FORCE_GTT = 'GTT'
TIME_IN_FORCE_FOK = 'FOK'
TIME_IN_FORCE_IOC = 'IOC'

# ------------ Position Status Types ------------
POSITION_STATUS_OPEN = 'OPEN'
POSITION_STATUS_CLOSED = 'CLOSED'
POSITION_STATUS_LIQUIDATED = 'LIQUIDATED'

# ------------ Order Status Types ------------
ORDER_STATUS_PENDING = 'PENDING'
ORDER_STATUS_OPEN = 'OPEN'
ORDER_STATUS_FILLED = 'FILLED'
ORDER_STATUS_CANCELED = 'CANCELED'
ORDER_STATUS_UNTRIGGERED = 'UNTRIGGERED'

# ------------ Transfer Status Types ------------
TRANSFER_STATUS_PENDING = 'PENDING'
TRANSFER_STATUS_CONFIRMED = 'CONFIRMED'
TRANSFER_STATUS_QUEUED = 'QUEUED'
TRANSFER_STATUS_CANCELED = 'CANCELED'
TRANSFER_STATUS_UNCONFIRMED = 'UNCONFIRMED'

# ------------ Markets ------------
MARKET_BTC_USD = 'BTC-USD'
MARKET_ETH_USD = 'ETH-USD'


# ------------ Assets ------------
ASSET_USDC = 'USDC'
ASSET_BTC = 'BTC'
ASSET_ETH = 'ETH'
COLLATERAL_ASSET = ASSET_USDC

# ------------ Synthetic Assets by Market ------------
SYNTHETIC_ASSET_MAP = {
    MARKET_BTC_USD: ASSET_BTC,
    MARKET_ETH_USD: ASSET_ETH,
}

# ------------ API Defaults ------------
DEFAULT_API_TIMEOUT = 3000

MAX_MEMO_CHARACTERS = 256

BECH32_PREFIX = 'dydx'

class BroadcastMode(Enum):
    BroadcastTxSync = 0
    BroadcastTxCommit = 1


class IndexerConfig:
    def __init__(
        self,
        rest_endpoint: str,
        websocket_endpoint: str,
    ):
        if rest_endpoint.endswith('/'):
            rest_endpoint = rest_endpoint[:-1]
        self.rest_endpoint = rest_endpoint
        self.websocket_endpoint = websocket_endpoint

class ValidatorConfig:
    def __init__(
        self,
        grpc_endpoint: str,
        chain_id: str,
        ssl_enabled: bool,
    ):
        self.grpc_endpoint = grpc_endpoint
        self.chain_id = chain_id
        self.ssl_enabled = ssl_enabled


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
        if faucet_endpoint is not None and faucet_endpoint.endswith('/'):
            faucet_endpoint = faucet_endpoint[:-1]
        self.faucet_endpoint = faucet_endpoint

    @classmethod
    def testnet(cls):
        validator_config=ValidatorConfig(
            grpc_endpoint=VALIDATOR_GRPC_TESTNET,
            chain_id=NETWORK_ID_TESTNET, 
            ssl_enabled=True
        )
        indexer_config=IndexerConfig(
            rest_endpoint=INDEXER_API_HOST_TESTNET,
            websocket_endpoint=INDEXER_WS_HOST_TESTNET,
        )
        return cls(
            env='testnet',
            validator_config=validator_config,
            indexer_config=indexer_config,
            faucet_endpoint=FAUCET_API_HOST_TESTNET,
        )

    @classmethod
    def mainnet(cls):
        validator_config=ValidatorConfig(
            grpc_endpoint=VALIDATOR_GRPC_MAINNET,
            chain_id=NETWORK_ID_MAINNET, 
            ssl_enabled=True
        )
        indexer_config=IndexerConfig(
            rest_endpoint=INDEXER_API_HOST_MAINNET,
            websocket_endpoint=INDEXER_WS_HOST_MAINNET,
        )
        return cls(
            env='mainnet',
            validator_config=validator_config,
            indexer_config=indexer_config,
            faucet_endpoint=None,
        )

    def string(self):
        return self.env
