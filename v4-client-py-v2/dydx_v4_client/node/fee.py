from dataclasses import dataclass
from math import ceil, floor
from typing import List, Tuple
from enum import Enum

from v4_proto.cosmos.base.v1beta1.coin_pb2 import Coin as ProtoCoin
from v4_proto.cosmos.tx.v1beta1.tx_pb2 import Fee as ProtoFee

from dydx_v4_client.config import GAS_MULTIPLIER

GAS_PRICE = 0.025
DYDX_GAS_PRICE = 25000000000


class Denom(Enum):
    USDC = "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5"
    DYDX = "adydx"
    DYDX_TNT = "adv4tnt"


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


def calculate_fee(gas_used: int, denom: Denom = Denom.USDC) -> Tuple[int, int]:
    gas_limit = floor(gas_used * GAS_MULTIPLIER)

    if denom in [Denom.DYDX, Denom.DYDX_TNT]:
        gas_price = DYDX_GAS_PRICE
    elif denom == Denom.USDC:
        gas_price = GAS_PRICE
    else:
        raise ValueError(f"{denom} cannot be used to cover gas fees")

    fee_amount = ceil(gas_limit * gas_price)

    return gas_limit, fee_amount
