from dataclasses import dataclass


@dataclass
class NodeConfig:
    chain_id: str
    url: str
    chaintoken_denom: str
    usdc_denom: str


@dataclass
class Network:
    node: NodeConfig
    rest_indexer: str
    websocket_indexer: str


MAINNET = Network(
    NodeConfig(
        "dydx-mainnet-1",
        "https://dydx-ops-rpc.kingnodes.com:443",
        "adydx",
        "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
    ),
    "https://indexer.dydx.trade",
    "wss://indexer.dydx.trade/v4/ws",
)

TESTNET = Network(
    NodeConfig(
        "dydx-testnet-4",
        "test-dydx-grpc.kingnodes.com",
        "adv4tnt",
        "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
    ),
    "https://dydx-testnet.imperator.co",
    "wss://indexer.v4testnet.dydx.exchange/v4/ws",
)
TESTNET_FAUCET = "https://faucet.v4testnet.dydx.exchange"

LOCAL = Network(
    NodeConfig(
        "localdydxprotocol",
        "http://localhost:26657",
        "adv4tnt",
        "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
    ),
    "http://localhost:3002",
    "ws://localhost:3003",
)
