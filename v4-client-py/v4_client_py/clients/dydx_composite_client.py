import grpc

from datetime import datetime, timedelta

from v4_proto.dydxprotocol.clob.tx_pb2 import MsgPlaceOrder
from v4_client_py.clients.helpers.chain_helpers import (
    QUOTE_QUANTUMS_ATOMIC_RESOLUTION,
    Order,
    OrderType, 
    OrderSide, 
    OrderTimeInForce, 
    OrderExecution,
    calculate_side,
    calculate_quantums, 
    calculate_subticks, 
    calculate_time_in_force, 
    calculate_order_flags,
    ORDER_FLAGS_SHORT_TERM,
    ORDER_FLAGS_LONG_TERM,
    ORDER_FLAGS_CONDITIONAL,
)

from v4_client_py.clients.constants import Network
from v4_client_py.clients.dydx_indexer_client import IndexerClient
from v4_client_py.clients.dydx_validator_client import ValidatorClient
from v4_client_py.clients.dydx_subaccount import Subaccount

from v4_client_py.chain.aerial.tx_helpers import SubmittedTx


class CompositeClient:
    def __init__(
        self,
        network: Network,
        api_timeout = None,
        send_options = None,
        credentials = grpc.ssl_channel_credentials(),
    ):
        self.indexer_client = IndexerClient(network.indexer_config, api_timeout, send_options)
        self.validator_client = ValidatorClient(network.validator_config, credentials)

    def calculate_good_til_block(self) -> int:
        response = self.validator_client.get.latest_block()
        return response.block.header.height + 3
    
    def calculate_good_til_block_time(self, good_til_time_in_seconds: int) -> int:
        now = datetime.now()
        interval = timedelta(seconds=good_til_time_in_seconds)
        future = now + interval
        return int(future.timestamp())


    # Only MARKET and LIMIT types are supported right now
    # Use human readable form of input, including price and size
    # The quantum and subticks are calculated and submitted

    def place_order(
        self,
        subaccount: Subaccount,
        market: str,
        type: OrderType,
        side: OrderSide,
        price: float,
        size: float,
        client_id: int,
        time_in_force: OrderTimeInForce,
        good_til_time_in_seconds: int,
        execution: OrderExecution,
        post_only: bool,
        reduce_only: bool,
        trigger_price: float = None,
    ) -> SubmittedTx:
        '''
        Place order

        :param subaccount: required
        :type subaccount: Subaccount

        :param market: required
        :type market: str

        :param side: required
        :type side: Order.Side

        :param price: required
        :type price: float

        :param size: required
        :type size: float

        :param client_id: required
        :type client_id: int

        :param time_in_force: required
        :type time_in_force: OrderTimeInForce

        :param good_til_time_in_seconds: required
        :type good_til_time_in_seconds: int

        :param execution: required
        :type execution: OrderExecution

        :param post_only: required
        :type post_only: bool

        :param reduce_only: required
        :type reduce_only: bool

        :returns: Tx information
        '''
        msg = self.place_order_message(
            subaccount=subaccount,
            market=market,
            type=type,
            side=side,
            price=price,
            size=size,
            client_id=client_id,
            time_in_force=time_in_force,
            good_til_time_in_seconds=good_til_time_in_seconds,
            execution=execution,
            post_only=post_only,
            reduce_only=reduce_only,
            trigger_price=trigger_price,
        )
        return self.validator_client.post.send_message(subaccount=subaccount, msg=msg, zeroFee=True)
    
    def calculate_client_metadata(self, order_type: OrderType) -> int:
        '''
        Calculate Client Metadata

        :param order_type: required
        :type order_type: OrderType

        :returns: Client Metadata
        '''
        return 1 if (order_type == OrderType.MARKET or order_type == OrderType.STOP_MARKET or order_type == OrderType.TAKE_PROFIT_MARKET) else 0

    def calculate_condition_type(self, order_type: OrderType) -> Order.ConditionType:
        '''
        Calculate Condition Type

        :param order_type: required
        :type order_type: OrderType

        :returns: Condition Type
        '''
        if order_type == OrderType.LIMIT:
            return Order.CONDITION_TYPE_UNSPECIFIED
        elif order_type == OrderType.MARKET:
            return Order.CONDITION_TYPE_UNSPECIFIED
        elif order_type == OrderType.STOP_LIMIT or order_type == OrderType.STOP_MARKET:
            return Order.CONDITION_TYPE_STOP_LOSS
        elif order_type == OrderType.TAKE_PROFIT_LIMIT or order_type == OrderType.TAKE_PROFIT_MARKET:
            return Order.CONDITION_TYPE_TAKE_PROFIT
        else:
            raise ValueError('order_type is invalid')

    def calculate_conditional_order_trigger_subticks(
            self,
            order_type: OrderType,
            atomic_resolution: int,
            quantum_conversion_exponent: int,
            subticks_per_tick: int,
            trigger_price: float,
        ) -> int:
        '''
        Calculate Conditional Order Trigger Subticks

        :param order_type: required
        :type order_type: OrderType

        :param atomic_resolution: required
        :type atomic_resolution: int

        :param quantum_conversion_exponent: required
        :type quantum_conversion_exponent: int

        :param subticks_per_tick: required
        :type subticks_per_tick: int

        :param trigger_price: required
        :type trigger_price: float

        :returns: Conditional Order Trigger Subticks
        '''
        if order_type == OrderType.LIMIT or order_type == OrderType.MARKET:
            return 0
        elif order_type == OrderType.STOP_LIMIT or order_type == OrderType.STOP_MARKET or order_type == OrderType.TAKE_PROFIT_LIMIT or order_type == OrderType.TAKE_PROFIT_MARKET:
            if trigger_price is None:
                raise ValueError('trigger_price is required for conditional orders')
            return calculate_subticks(trigger_price, atomic_resolution, quantum_conversion_exponent, subticks_per_tick)
        else:
            raise ValueError('order_type is invalid')

    def place_order_message(
        self,
        subaccount: Subaccount,
        market: str,
        type: OrderType,
        side: OrderSide,
        price: float,
        size: float,
        client_id: int,
        time_in_force: OrderTimeInForce,
        good_til_time_in_seconds: int,
        execution: OrderExecution,
        post_only: bool,
        reduce_only: bool,
        trigger_price: float = None,
    ) -> MsgPlaceOrder:
        markets_response = self.indexer_client.markets.get_perpetual_markets(market)
        market = markets_response.data['markets'][market]
        clob_pair_id = market['clobPairId']
        atomic_resolution = market['atomicResolution']
        step_base_quantums = market['stepBaseQuantums']
        quantum_conversion_exponent = market['quantumConversionExponent']
        subticks_per_tick = market['subticksPerTick']
        order_side = calculate_side(side)
        quantums = calculate_quantums(size, atomic_resolution, step_base_quantums)
        subticks = calculate_subticks(price, atomic_resolution, quantum_conversion_exponent, subticks_per_tick)
        order_flags = calculate_order_flags(type, time_in_force)
        time_in_force = calculate_time_in_force(type, time_in_force, execution, post_only)
        good_til_block = self.calculate_good_til_block() if order_flags == ORDER_FLAGS_SHORT_TERM else 0
        good_til_block_time = self.calculate_good_til_block_time(good_til_time_in_seconds) if (order_flags == ORDER_FLAGS_LONG_TERM or order_flags == ORDER_FLAGS_CONDITIONAL) else 0
        client_metadata = self.calculate_client_metadata(type)
        condition_type = self.calculate_condition_type(type)
        conditional_order_trigger_subticks = self.calculate_conditional_order_trigger_subticks(
            type, 
            atomic_resolution, 
            quantum_conversion_exponent, 
            subticks_per_tick, 
            trigger_price
            )
        return self.validator_client.post.composer.compose_msg_place_order(
            address=subaccount.address,
            subaccount_number=subaccount.subaccount_number,
            client_id=client_id,
            clob_pair_id=clob_pair_id,
            order_flags=order_flags,
            good_til_block=good_til_block,
            good_til_block_time=good_til_block_time,
            side=order_side,
            quantums=quantums,
            subticks=subticks,
            time_in_force=time_in_force,
            reduce_only=reduce_only,
            client_metadata=client_metadata,
            condition_type=condition_type,
            conditional_order_trigger_subticks=conditional_order_trigger_subticks,
        )
    

    def cancel_order(
        self, 
        subaccount: Subaccount,
        client_id: int,
        clob_pair_id: int,
        order_flags: int,
        good_til_block: int,
        good_til_block_time: int,
    )  -> SubmittedTx:
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

        :returns: Tx information
        '''
        return self.validator_client.post.cancel_order(
            subaccount=subaccount,
            client_id=client_id,
            clob_pair_id=clob_pair_id,
            order_flags=order_flags,
            good_til_block=good_til_block,
            good_til_block_time=good_til_block_time,
        )


    def transfer_to_subaccount(
        self, 
        subaccount: Subaccount,
        recipient_address: str,
        recipient_subaccount_number: int,
        amount: float,
    )  -> SubmittedTx:
        '''
        Cancel order

        :param subaccount: required
        :type subaccount: Subaccount

        :param recipient_address: required
        :type recipient_address: str

        :param recipient_subaccount_number: required
        :type recipient_subaccount_number: int

        :param amount: required
        :type amount: float

        :returns: Tx information
        '''
        return self.validator_client.post.transfer(
            subaccount=subaccount,
            recipient_address=recipient_address,
            recipient_subaccount_number=recipient_subaccount_number,
            asset_id=0,
            amount=amount * 10**6,
        )
    
    def deposit_to_subaccount(
        self, 
        subaccount: Subaccount,
        amount: float,
    )  -> SubmittedTx:
        '''
        Cancel order

        :param subaccount: required
        :type subaccount: Subaccount

        :param amount: required
        :type amount: float

        :returns: Tx information
        '''
        return self.validator_client.post.deposit(
            subaccount=subaccount,
            asset_id=0,
            quantums=amount * 10 ** (- QUOTE_QUANTUMS_ATOMIC_RESOLUTION),
        )
    
    def withdraw_from_subaccount(
        self, 
        subaccount: Subaccount,
        amount: float,
    )  -> SubmittedTx:
        '''
        Cancel order

        :param subaccount: required
        :type subaccount: Subaccount

        :param amount: required
        :type amount: float

        :returns: Tx information
        '''
        return self.validator_client.post.withdraw(
            subaccount=subaccount,
            asset_id=0,
            quantums=amount * 10 ** (- QUOTE_QUANTUMS_ATOMIC_RESOLUTION),
        )