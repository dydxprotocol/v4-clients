from dataclasses import dataclass


@dataclass
class NodeConfig:
    chain_id: str
    url: str
    denomination: str


@dataclass
class Network:
    node: NodeConfig
    websocket_indexer: str


MAINNET = Network(
    NodeConfig("dydx-mainnet-1", "https://dydx-ops-rpc.kingnodes.com:443", "adydx"),
    "wss://indexer.dydx.trade/v4/ws",
)

TESTNET = Network(
    NodeConfig("dydx-testnet-4", "testnet-dydx-grpc.lavenderfive.com:443", "adv4tnt"),
    "wss://indexer.v4testnet.dydx.exchange/v4/ws",
)

LOCAL = Network(
    NodeConfig("localdydxprotocol", "http://localhost:26657", "adv4tnt"),
    "ws://localhost:3003",
)
