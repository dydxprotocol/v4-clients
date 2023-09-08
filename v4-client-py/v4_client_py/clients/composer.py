

from v4_proto.dydxprotocol.clob.tx_pb2 import MsgPlaceOrder, MsgCancelOrder
from v4_proto.dydxprotocol.clob.order_pb2 import Order, OrderId
from v4_proto.dydxprotocol.subaccounts.subaccount_pb2 import SubaccountId
from v4_proto.dydxprotocol.sending.transfer_pb2 import Transfer, MsgWithdrawFromSubaccount, MsgDepositToSubaccount
from v4_proto.dydxprotocol.sending.tx_pb2 import MsgCreateTransfer


class Composer:
    def compose_msg_place_order(
        self,
        address: str,
        subaccount_number: int,
        client_id: int,
        clob_pair_id: int,
        order_flags: int,
        good_til_block: int,
        good_til_block_time: int,
        side: Order.Side,
        quantums: int,
        subticks: int,
        time_in_force: Order.TimeInForce,
        reduce_only: bool,
        client_metadata: int,
        condition_type: Order.ConditionType,
        conditional_order_trigger_subticks: int,
    ) -> MsgPlaceOrder:
        '''
        Compose a place order message

        :param address: required
        :type address: str

        :param subaccount_number: required
        :type subaccount_number: int

        :param client_id: required
        :type client_id: int

        :param clob_pair_id: required
        :type clob_pair_id: int

        :param order_flags: required
        :type order_flags: int

        :param good_til_block: required
        :type good_til_block: int

        :param good_til_block_time: required
        :type good_til_block_time: int

        :param side: required
        :type side: Order.Side

        :param quantums: required
        :type quantums: int

        :param subticks: required
        :type subticks: int

        :param time_in_force: required
        :type time_in_force: int

        :param reduce_only: required
        :type reduce_only: bool

        :param client_metadata: required
        :type client_metadata: int

        :param condition_type: required
        :type condition_type: int

        :param conditional_order_trigger_subticks: required
        :type conditional_order_trigger_subticks: int

        :returns: Place order message, to be sent to chain
        '''
        subaccount_id = SubaccountId(owner=address, number=subaccount_number)
        order_id = OrderId(
            subaccount_id=subaccount_id, 
            client_id=client_id, 
            order_flags=order_flags, 
            clob_pair_id=int(clob_pair_id)
        )
        
        order = Order(
            order_id=order_id, 
            side=side, 
            quantums=quantums, 
            subticks=subticks, 
            good_til_block=good_til_block, 
            time_in_force=time_in_force, 
            reduce_only=reduce_only,
            client_metadata=client_metadata,
            condition_type=condition_type,
            conditional_order_trigger_subticks=conditional_order_trigger_subticks,
        ) if (good_til_block != 0) else Order(
            order_id=order_id, 
            side=side, 
            quantums=quantums, 
            subticks=subticks, 
            good_til_block_time=good_til_block_time, 
            time_in_force=time_in_force, 
            reduce_only=reduce_only,
            client_metadata=client_metadata,
            condition_type=condition_type,
            conditional_order_trigger_subticks=conditional_order_trigger_subticks,
        )
        return MsgPlaceOrder(order=order)
    
    def compose_msg_cancel_order(
        self,
        address: str,
        subaccount_number: int,
        client_id: int,
        clob_pair_id: int,
        order_flags: int,
        good_til_block: int,
        good_til_block_time: int,
    ) -> MsgCancelOrder:
        '''
        Compose a cancel order messasge

        :param address: required
        :type address: str

        :param subaccount_number: required
        :type subaccount_number: int

        :param client_id: required
        :type client_id: int

        :param clob_pair_id: required
        :type clob_pair_id: int

        :param order_flags: required
        :type order_flags: int

        :param good_til_block: required
        :type good_til_block: int

        :param good_til_block_time: required
        :type good_til_block_time: int


        :returns: Tx information
        '''
        subaccount_id = SubaccountId(owner=address, number=subaccount_number)
        order_id = OrderId(
            subaccount_id=subaccount_id, 
            client_id=client_id, 
            order_flags=order_flags, 
            clob_pair_id=int(clob_pair_id)
        )
        return MsgCancelOrder(
            order_id=order_id, 
            good_til_block=good_til_block,
            good_til_block_time=good_til_block_time
        )
    
    def compose_msg_transfer(
        self,
        address: str,
        subaccount_number: int,
        recipient_address: str,
        recipient_subaccount_number: int,
        asset_id: int,
        amount: int
    ) -> MsgCreateTransfer:
        sender = SubaccountId(owner=address, number=subaccount_number)
        recipient = SubaccountId(owner=recipient_address, number=recipient_subaccount_number)

        transfer = Transfer(sender=sender, recipient=recipient, asset_id=asset_id, amount=amount)

        return MsgCreateTransfer(transfer=transfer)


    def compose_msg_deposit_to_subaccount(
        self,
        address: str,
        subaccount_number: int,
        asset_id: int,
        quantums: int
    ) -> MsgDepositToSubaccount:
        recipient = SubaccountId(owner=address, number=subaccount_number)

        return MsgDepositToSubaccount(sender=address, recipient=recipient, asset_id=asset_id, quantums=quantums)


    def compose_msg_withdraw_from_subaccount(
        self,
        address: str,
        subaccount_number: int,
        asset_id: int,
        quantums: int
    ) -> MsgWithdrawFromSubaccount:
        sender = SubaccountId(owner=address, number=subaccount_number)

        return MsgWithdrawFromSubaccount(sender=sender, recipient=address, asset_id=asset_id, quantums=quantums)