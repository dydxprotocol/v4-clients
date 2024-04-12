# ------------ Constants for Testing ------------
from v4_client_py.clients.constants import ORDER_SIDE_BUY
from v4_client_py.clients.helpers.chain_helpers import ORDER_FLAGS_SHORT_TERM
from v4_proto.dydxprotocol.clob.order_pb2 import Order


DEFAULT_HOST = 'http://localhost:8080'
DEFAULT_NETWORK_ID = 1001
SEVEN_DAYS_S = 7 * 24 * 60 * 60

MAX_CLIENT_ID = 2 ** 32 - 1

DYDX_TEST_ADDRESS = 'dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art'
DYDX_TEST_PRIVATE_KEY = 'e92a6595c934c991d3b3e987ea9b3125bf61a076deab3a9cb519787b7b3e8d77'
DYDX_TEST_MNEMONIC = 'mirror actor skill push coach wait confirm orchard lunch mobile athlete gossip awake miracle matter bus reopen team ladder lazy list timber render wait';

default_order = {
    "clientId": 0,
    "orderFlags": ORDER_FLAGS_SHORT_TERM,
    "clobPairId": "BTC-USD",
    "side": ORDER_SIDE_BUY,
    "quantums": 1_000_000_000,
    "subticks": 1_000_000_000,
    "timeInForce": Order.TIME_IN_FORCE_UNSPECIFIED,
    "reduceOnly": False,
    "clientMetadata": 0,
}