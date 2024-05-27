from dataclasses import dataclass


@dataclass
class NodeConfig:
    chain_id: str
    url: str
    denomination: str


@dataclass
class Network:
    node: NodeConfig
    rest_indexer: str
    websocket_indexer: str


MAINNET = Network(
    NodeConfig("dydx-mainnet-1", "https://dydx-ops-rpc.kingnodes.com:443", "adydx"),
    "https://indexer.dydx.trade",
    "wss://indexer.dydx.trade/v4/ws",
)

TESTNET = Network(
    NodeConfig("dydx-testnet-4", "testnet-dydx-grpc.lavenderfive.com:443", "adv4tnt"),
    "https://dydx-testnet.imperator.co",
    "wss://indexer.v4testnet.dydx.exchange/v4/ws",
)
TESTNET_FAUCET = "https://faucet.v4testnet.dydx.exchange"

LOCAL = Network(
    NodeConfig("localdydxprotocol", "http://localhost:26657", "adv4tnt"),
    "http://localhost:3002",
    "ws://localhost:3003",
)
