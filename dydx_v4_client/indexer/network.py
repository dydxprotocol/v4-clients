from dataclasses import dataclass


@dataclass
class Network:
    validator: str
    indexer: str


TESTNET = Network("testnet-dydx-grpc.lavenderfive.com:443", "dydx-testnet.imperator.co")
