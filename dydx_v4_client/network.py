from dataclasses import dataclass


@dataclass
class Network:
    chain_id: str
    node: str
    indexer: str


TESTNET = Network(
    "dydx-testnet-4",
    "testnet-dydx-grpc.lavenderfive.com:443",
    "dydx-testnet.imperator.co",
)
