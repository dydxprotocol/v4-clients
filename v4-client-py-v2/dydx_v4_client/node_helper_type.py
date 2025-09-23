from dataclasses import dataclass

from dydx_v4_client.indexer.rest.constants import OrderSide
from dydx_v4_client.utility import (
    convert_quantum_bytes_to_value_with_order_side,
    convert_quantum_bytes_to_value,
)
from v4_proto.dydxprotocol.clob.order_pb2 import Order
from v4_proto.dydxprotocol.subaccounts import (
    perpetual_position_pb2 as perpetual_position_type,
)
from v4_proto.dydxprotocol.subaccounts import asset_position_pb2 as asset_position_type
from v4_proto.dydxprotocol.subaccounts import subaccount_pb2 as subaccount_type


@dataclass(init=False)
class ExtendedPerpetual:
    quantums: bytes
    perpetual_id: int
    quote_balance: bytes
    funding_index: bytes
    quantums_decoded: int
    side: OrderSide

    def __init__(self, perpetual_positions: perpetual_position_type.PerpetualPosition):
        self.quantums = perpetual_positions.quantums
        self.perpetual_id = perpetual_positions.perpetual_id
        self.quote_balance = perpetual_positions.quote_balance
        self.funding_index = perpetual_positions.funding_index
        (quantums_decoded, side) = convert_quantum_bytes_to_value_with_order_side(
            perpetual_positions.quantums
        )
        self.quantums_decoded = quantums_decoded
        self.side = side


@dataclass(init=False)
class ExtendedAssetPosition:
    asset_id: int
    quantums: bytes
    index: int
    quantums_decoded: int

    def __init__(self, asset_position: asset_position_type.AssetPosition):
        self.asset_id = asset_position.asset_id
        self.quantums = asset_position.quantums
        self.index = asset_position.index
        self.quantums_decoded = convert_quantum_bytes_to_value_with_order_side(
            asset_position.quantums
        )[0]


@dataclass(init=False)
class ExtendedSubaccount:
    id: subaccount_type.SubaccountId
    margin_enabled: bool
    perpetual_positions: [perpetual_position_type.PerpetualPosition]
    asset_positions: [asset_position_type.AssetPosition]

    def __init__(self, subaccount: subaccount_type.Subaccount):
        self.id = subaccount.id
        self.margin_enabled = subaccount.margin_enabled
        self.perpetual_positions = []
        for p in subaccount.perpetual_positions:
            self.perpetual_positions.append(ExtendedPerpetual(p))
        self.asset_positions = []
        for a in subaccount.asset_positions:
            self.asset_positions.append(ExtendedAssetPosition(a))
