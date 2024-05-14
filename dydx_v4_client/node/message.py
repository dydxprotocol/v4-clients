from v4_proto.dydxprotocol.clob.order_pb2 import Order, OrderId
from v4_proto.dydxprotocol.clob.tx_pb2 import MsgCancelOrder, MsgPlaceOrder
from v4_proto.dydxprotocol.sending.transfer_pb2 import (
    MsgDepositToSubaccount,
    MsgWithdrawFromSubaccount,
    Transfer,
)
from v4_proto.dydxprotocol.sending.tx_pb2 import MsgCreateTransfer
from v4_proto.dydxprotocol.subaccounts.subaccount_pb2 import SubaccountId


def order(
    order_id: Order,
    side: Order.Side,
    quantums: int,
    subticks: int,
    time_in_force: Order.TimeInForce,
    reduce_only: bool,
    good_til_block: int = 0,
    good_til_block_time: int = 0,
    client_metadata: int = 0,
    condition_type: Order.ConditionType = Order.ConditionType.CONDITION_TYPE_UNSPECIFIED,
    conditional_order_trigger_subticks: int = 0,
):
    return Order(
        order_id=order_id,
        side=side,
        quantums=quantums,
        subticks=subticks,
        good_til_block=good_til_block,
        good_til_block_time=good_til_block_time,
        time_in_force=time_in_force,
        reduce_only=reduce_only,
        client_metadata=client_metadata,
        condition_type=condition_type,
        conditional_order_trigger_subticks=conditional_order_trigger_subticks,
    )


def order_id(
    address,
    subaccount_number: int,
    client_id: int,
    clob_pair_id: int,
    order_flags: int,
):
    return OrderId(
        subaccount_id=SubaccountId(owner=address, number=subaccount_number),
        client_id=client_id,
        order_flags=order_flags,
        clob_pair_id=clob_pair_id,
    )
