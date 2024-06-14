from dataclasses import dataclass
from math import ceil, floor
from typing import List, Tuple

from v4_proto.cosmos.base.v1beta1.coin_pb2 import Coin as ProtoCoin
from v4_proto.cosmos.tx.v1beta1.tx_pb2 import Fee as ProtoFee

from dydx_v4_client.config import GAS_MULTIPLIER

GAS_PRICE = 0.025
DYDX_GAS_PRICE = 25000000000


@dataclass
class Coin:
    amount: int
    denomination: str

    def as_proto(self) -> ProtoCoin:
        return ProtoCoin(amount=str(self.amount), denom=self.denomination)


@dataclass
class Fee:
    gas_limit: int
    amount: List[Coin]

    def as_proto(self) -> ProtoFee:
        return ProtoFee(
            gas_limit=self.gas_limit,
            amount=list(map(lambda coin: coin.as_proto(), self.amount)),
        )


def calculate_fee(gas_used) -> Tuple[int, int]:
    gas_limit = floor(gas_used * GAS_MULTIPLIER)
    return gas_limit, ceil(gas_limit * GAS_PRICE)
