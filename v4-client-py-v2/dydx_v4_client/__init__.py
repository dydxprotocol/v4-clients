from enum import IntEnum

from v4_proto.dydxprotocol.clob.order_pb2 import Order

from dydx_v4_client.faucet_client import FaucetClient
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.indexer.socket.websocket import IndexerSocket
from dydx_v4_client.node.client import NodeClient, QueryNodeClient
from dydx_v4_client.wallet import Wallet


class OrderFlags(IntEnum):
    SHORT_TERM = 0
    LONG_TERM = 64
    CONDITIONAL = 32


MAX_CLIENT_ID = 2**32 - 1
