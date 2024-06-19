from dataclasses import dataclass
from functools import partial

import grpc
from grpc import insecure_channel

secure_channel = partial(
    grpc.secure_channel, credentials=grpc.ssl_channel_credentials()
)


@dataclass
class NodeConfig:
    chain_id: str
    chaintoken_denom: str
    usdc_denom: str
    channel: grpc.Channel


@dataclass
class Network:
    rest_indexer: str
    websocket_indexer: str
    node: NodeConfig


def make_config(
    make_channel, make_node, rest_indexer: str, websocket_indexer: str, node_url: str
):
    return Network(
        rest_indexer,
        websocket_indexer,
        make_node(channel=make_channel(node_url)),
    )


make_secure = partial(make_config, secure_channel)
make_insecure = partial(make_config, insecure_channel)


mainnet_node = partial(
    NodeConfig,
    "dydx-mainnet-1",
    chaintoken_denom="adydx",
    usdc_denom="ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
)
make_mainnet = partial(make_secure, mainnet_node)


testnet_node = partial(
    NodeConfig,
    "dydx-testnet-4",
    chaintoken_denom="adv4tnt",
    usdc_denom="ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
)
make_testnet = partial(
    make_secure,
    testnet_node,
    rest_indexer="https://dydx-testnet.imperator.co",
    websocket_indexer="wss://indexer.v4testnet.dydx.exchange/v4/ws",
    node_url="test-dydx-grpc.kingnodes.com",
)
TESTNET = make_testnet()
TESTNET_FAUCET = "https://faucet.v4testnet.dydx.exchange"
TESTNET_NOBLE = "https://rpc.testnet.noble.strange.love"


local_node = partial(
    NodeConfig,
    "localdydxprotocol",
    chaintoken_denom="adv4tnt",
    usdc_denom="ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
)
make_local = partial(
    make_insecure,
    local_node,
    rest_indexer="http://localhost:3002",
    websocket_indexer="ws://localhost:3003",
    node_url="http://localhost:9090",
)
LOCAL = make_local()
