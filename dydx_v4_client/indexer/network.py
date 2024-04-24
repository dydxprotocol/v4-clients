from dataclasses import dataclass


@dataclass
class Network:
    validator: str
    indexer: str


TESTNET = Network("testnet-dydx-grpc.lavenderfive.com:443", "wss://indexer.v4testnet.dydx.exchange/v4/ws")
