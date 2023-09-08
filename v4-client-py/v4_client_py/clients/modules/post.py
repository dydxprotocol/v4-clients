from google.protobuf import message as _message

from v4_proto.dydxprotocol.clob.tx_pb2 import MsgPlaceOrder
from v4_proto.dydxprotocol.clob.order_pb2 import Order

from v4_client_py.clients.helpers.chain_helpers import ORDER_FLAGS_LONG_TERM, ORDER_FLAGS_SHORT_TERM

from ..constants import BroadcastMode, ValidatorConfig
from ..composer import Composer
from ..dydx_subaccount import Subaccount

from ...chain.aerial.tx import Transaction
from ...chain.aerial.tx_helpers import SubmittedTx
from ...chain.aerial.client import LedgerClient, NetworkConfig
from ...chain.aerial.client.utils import prepare_and_broadcast_basic_transaction

class Post:
    def __init__(
        self,
        config: ValidatorConfig,
    ):
        self.config = config
        self.composer = Composer()

    def send_message(
        self,
        subaccount: Subaccount,
        msg: _message.Message,
        zeroFee: bool = False,
        broadcast_mode: BroadcastMode = None,
    ) -> SubmittedTx:
        
        '''
        Send a message

        :param subaccount: required
        :type subaccount: Subaccount

        :param msg: required
        :type msg: Message

        :returns: Tx information
        '''

        wallet = subaccount.wallet
        url = ('grpc+https://' if self.config.ssl_enabled else 'grpc+http://') + self.config.grpc_endpoint
        network = NetworkConfig(self.config.chain_id, 0, None, None, url, None)
        ledger = LedgerClient(network)
        tx = Transaction()
        tx.add_message(msg)
        gas_limit = 0 if zeroFee else None

        return prepare_and_broadcast_basic_transaction(
            client=ledger, 
            tx=tx, 
            sender=wallet, 
            gas_limit=gas_limit,
            memo=None,
            broadcast_mode=broadcast_mode if (broadcast_mode != None) else self.default_broadcast_mode(msg),
            )
    
    def place_order(
        self,
        subaccount: Subaccount,
        client_id: int,
        clob_pair_id: int,
        side: Order.Side,
        quantums: int,
        subticks: int,
        time_in_force: Order.TimeInForce,
        order_flags: int,
        reduce_only: bool,
        good_til_block: int,
        good_til_block_time: int,
        client_metadata: int,
        condition_type: Order.ConditionType=Order.ConditionType.CONDITION_TYPE_UNSPECIFIED,
        conditional_order_trigger_subticks: int=0,
        broadcast_mode: BroadcastMode=None,
    ) -> SubmittedTx:
        '''
        Place order

        :param subaccount: required
        :type subaccount: Subaccount

        :param clob_pair_id: required
        :type clob_pair_id: int

        :param side: required
        :type side: Order.Side

        :param quantums: required
        :type quantums: int

        :param subticks: required
        :type subticks: int

        :param good_til_block: required
        :type good_til_block: int

        :param good_til_block_time: required
        :type good_til_block_time: int

        :param client_id: required
        :type client_id: int

        :param time_in_force: required
        :type time_in_force: int

        :param order_flags: required
        :type order_flags: int

        :param reduce_only: required
        :type reduce_only: bool

        :returns: Tx information
        '''
        # prepare tx msg
        subaccount_number = subaccount.subaccount_number

        msg = self.composer.compose_msg_place_order(
            address=subaccount.address,
            subaccount_number=subaccount_number, 
            client_id=client_id, 
            clob_pair_id=clob_pair_id, 
            order_flags=order_flags, 
            good_til_block=good_til_block, 
            good_til_block_time=good_til_block_time, 
            side=side, 
            quantums=quantums, 
            subticks=subticks, 
            time_in_force=time_in_force, 
            reduce_only=reduce_only,
            client_metadata=client_metadata,
            condition_type=condition_type,
            conditional_order_trigger_subticks=conditional_order_trigger_subticks,
            )
        return self.send_message(
            subaccount=subaccount, 
            msg=msg, 
            zeroFee=True, 
            broadcast_mode=broadcast_mode
        )
    

    def place_order_object(
        self,
        subaccount: Subaccount,
        place_order: any,
        broadcast_mode: BroadcastMode=None,
    ) -> SubmittedTx:
        return self.place_order(
            subaccount,
            place_order["client_id"],
            place_order["clob_pair_id"],
            place_order["side"],
            place_order["quantums"],
            place_order["subticks"],
            place_order["time_in_force"],
            place_order["order_flags"],
            place_order["reduce_only"],
            place_order.get("good_til_block", 0),
            place_order.get("good_til_block_time", 0),
            place_order.get("client_metadata", 0),
            broadcast_mode,
        )

    def cancel_order(
        self,
        subaccount: Subaccount,
        client_id: int,
        clob_pair_id: int,
        order_flags: int,
        good_til_block: int,
        good_til_block_time: int,
        broadcast_mode: BroadcastMode=None,
    ) -> SubmittedTx:
        '''
        Cancel order

        :param subaccount: required
        :type subaccount: Subaccount

        :param client_id: required
        :type client_id: int

        :param clob_pair_id: required
        :type clob_pair_id: int

        :param order_flags: required
        :type order_flags: int

        :param good_til_block: optional
        :type good_til_block: int

        :param good_til_block_time: optional
        :type good_til_block_time: int

        :param broadcast_mode: optional
        :type broadcast_mode: BroadcastMode

        :returns: Tx information
        '''
        msg = self.composer.compose_msg_cancel_order(
            subaccount.address, 
            subaccount.subaccount_number,
            client_id,
            clob_pair_id,
            order_flags,
            good_til_block,
            good_til_block_time,
            )
        return self.send_message(subaccount, msg, zeroFee=True, broadcast_mode=broadcast_mode)
        
    def cancel_order_object(
        self,
        subaccount: Subaccount,
        cancel_order: any,
        broadcast_mode: BroadcastMode=None,
    ) -> SubmittedTx:
        return self.cancel_order(
            subaccount,
            cancel_order.client_id,
            cancel_order.clob_pair_id,
            cancel_order.order_flags,
            cancel_order.good_til_block,
            cancel_order.good_til_block_time,
            broadcast_mode=broadcast_mode,
        )
        
    def transfer(
        self,
        subaccount: Subaccount,
        recipient_address: str,
        recipient_subaccount_number: int,
        asset_id: int,
        amount: int,
        broadcast_mode: BroadcastMode=None,
    ) -> SubmittedTx:
        msg = self.composer.compose_msg_transfer(
            subaccount.address,
            subaccount.subaccount_number,
            recipient_address,
            recipient_subaccount_number,
            asset_id,
            amount,
        )
        return self.send_message(subaccount, msg, broadcast_mode=broadcast_mode)


    def deposit(
        self,
        subaccount: Subaccount,
        asset_id: int,
        quantums: int,
        broadcast_mode: BroadcastMode=None,
    ) -> SubmittedTx:
        msg = self.composer.compose_msg_deposit_to_subaccount(
            subaccount.address,
            subaccount.subaccount_number,
            asset_id,
            quantums,
        )
        return self.send_message(subaccount, msg, broadcast_mode=broadcast_mode)


    def withdraw(
        self,
        subaccount: Subaccount,
        asset_id: int,
        quantums: int,
        broadcast_mode: BroadcastMode=None,
    ) -> SubmittedTx:
        msg = self.composer.compose_msg_withdraw_from_subaccount(
            subaccount.address,
            subaccount.subaccount_number,
            asset_id,
            quantums,
        )
        return self.send_message(subaccount, msg, broadcast_mode=broadcast_mode)
    
    def default_broadcast_mode(self, msg: _message.Message) -> BroadcastMode:
        if isinstance(msg, MsgPlaceOrder):
            order_flags = msg.order.order_id.order_flags
            if order_flags == ORDER_FLAGS_SHORT_TERM:
                return BroadcastMode.BroadcastTxSync
            elif order_flags == ORDER_FLAGS_LONG_TERM:
                return BroadcastMode.BroadcastTxCommit
            else:
                return BroadcastMode.BroadcastTxCommit
        return BroadcastMode.BroadcastTxSync