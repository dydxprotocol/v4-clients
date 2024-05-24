import hashlib
from dataclasses import dataclass, field
from typing import Any, List, Optional, Self

import ecdsa
import google
import grpc
from ecdsa.util import sigencode_string_canonize
from google.protobuf.json_format import MessageToJson
from google.protobuf.message import Message
from v4_proto.cosmos.auth.v1beta1 import query_pb2_grpc as auth
from v4_proto.cosmos.auth.v1beta1.auth_pb2 import BaseAccount
from v4_proto.cosmos.auth.v1beta1.query_pb2 import QueryAccountRequest
from v4_proto.cosmos.bank.v1beta1 import query_pb2 as bank_query
from v4_proto.cosmos.bank.v1beta1 import query_pb2_grpc as bank_query_grpc
from v4_proto.cosmos.base.tendermint.v1beta1 import query_pb2 as tendermint_query
from v4_proto.cosmos.base.tendermint.v1beta1 import (
    query_pb2_grpc as tendermint_query_grpc,
)
from v4_proto.cosmos.base.v1beta1.coin_pb2 import Coin
from v4_proto.cosmos.crypto.secp256k1.keys_pb2 import PubKey
from v4_proto.cosmos.staking.v1beta1 import query_pb2 as staking_query
from v4_proto.cosmos.staking.v1beta1 import query_pb2_grpc as staking_query_grpc
from v4_proto.cosmos.tx.signing.v1beta1.signing_pb2 import SignMode
from v4_proto.cosmos.tx.v1beta1 import service_pb2_grpc
from v4_proto.cosmos.tx.v1beta1.service_pb2 import (
    BroadcastMode,
    BroadcastTxRequest,
    GetTxRequest,
    SimulateRequest,
)
from v4_proto.cosmos.tx.v1beta1.tx_pb2 import (
    AuthInfo,
    Fee,
    ModeInfo,
    SignDoc,
    SignerInfo,
    Tx,
    TxBody,
)
from v4_proto.dydxprotocol.bridge import query_pb2 as bridge_query
from v4_proto.dydxprotocol.bridge import query_pb2_grpc as bridge_query_grpc
from v4_proto.dydxprotocol.clob import clob_pair_pb2 as clob_pair_type
from v4_proto.dydxprotocol.clob import (
    equity_tier_limit_config_pb2 as equity_tier_limit_config_type,
)
from v4_proto.dydxprotocol.clob import query_pb2 as clob_query
from v4_proto.dydxprotocol.clob import query_pb2_grpc as clob_query_grpc
from v4_proto.dydxprotocol.clob.order_pb2 import Order, OrderId
from v4_proto.dydxprotocol.clob.query_pb2 import (
    QueryAllClobPairRequest,
    QueryClobPairAllResponse,
)
from v4_proto.dydxprotocol.clob.tx_pb2 import MsgCancelOrder, MsgPlaceOrder
from v4_proto.dydxprotocol.feetiers import query_pb2 as fee_tier_query
from v4_proto.dydxprotocol.feetiers import query_pb2_grpc as fee_tier_query_grpc
from v4_proto.dydxprotocol.perpetuals import query_pb2_grpc as perpetuals_query_grpc
from v4_proto.dydxprotocol.perpetuals.query_pb2 import (
    QueryAllPerpetualsRequest,
    QueryAllPerpetualsResponse,
    QueryPerpetualRequest,
    QueryPerpetualResponse,
)
from v4_proto.dydxprotocol.prices import market_price_pb2 as market_price_type
from v4_proto.dydxprotocol.prices import query_pb2_grpc as prices_query_grpc
from v4_proto.dydxprotocol.prices.query_pb2 import (
    QueryAllMarketPricesRequest,
    QueryAllMarketPricesResponse,
    QueryMarketPriceRequest,
)
from v4_proto.dydxprotocol.rewards import query_pb2 as rewards_query
from v4_proto.dydxprotocol.rewards import query_pb2_grpc as rewards_query_grpc
from v4_proto.dydxprotocol.stats import query_pb2 as stats_query
from v4_proto.dydxprotocol.stats import query_pb2_grpc as stats_query_grpc
from v4_proto.dydxprotocol.subaccounts import query_pb2_grpc as subaccounts_query_grpc
from v4_proto.dydxprotocol.subaccounts import subaccount_pb2 as subaccount_type
from v4_proto.dydxprotocol.subaccounts.query_pb2 import (
    QueryAllSubaccountRequest,
    QueryGetSubaccountRequest,
    QuerySubaccountAllResponse,
)
from v4_proto.dydxprotocol.subaccounts.subaccount_pb2 import SubaccountId

from dydx_v4_client.network import Network


def as_any(message: Message):
    packed = google.protobuf.any_pb2.Any()
    packed.Pack(message, type_url_prefix="/")
    return packed


def get_signer_info(private_key, sequence):
    return SignerInfo(
        public_key=as_any(
            PubKey(key=private_key.get_verifying_key().to_string("compressed"))
        ),
        mode_info=ModeInfo(single=ModeInfo.Single(mode=SignMode.SIGN_MODE_DIRECT)),
        sequence=sequence,
    )


def get_signature(private_key, body, auth_info, account_number, chain_id):
    signdoc = SignDoc(
        body_bytes=body.SerializeToString(),
        auth_info_bytes=auth_info.SerializeToString(),
        account_number=account_number,
        chain_id=chain_id,
    )

    return private_key.sign(
        signdoc.SerializeToString(), sigencode=sigencode_string_canonize
    )


@dataclass
class TransactionSender:
    chain_id: str
    channel: grpc.Channel

    def send(self, transaction: Tx):
        raise NotImplementedError()

    async def place_order(
        self, key: ecdsa.SigningKey, order: Order, account_number: int, sequence: int
    ):
        body = TxBody(
            messages=[as_any(MsgPlaceOrder(order=order))], memo="Client Example"
        )
        auth_info = AuthInfo(
            signer_infos=[get_signer_info(key, sequence)],
            fee=Fee(amount=[Coin(amount="0", denom="afet")]),
        )
        signature = get_signature(key, body, auth_info, account_number, self.chain_id)

        transaction = Tx(body=body, auth_info=auth_info, signatures=[signature])

        return self.send(transaction)

    async def cancel_order(
        self,
        key,
        account_number,
        sequence,
        order_id,
        good_til_block: int = 0,
        good_til_block_time: int = 0,
    ):
        message = MsgCancelOrder(
            order_id=order_id,
            good_til_block=good_til_block,
            good_til_block_time=good_til_block_time,
        )
        body = TxBody(messages=[as_any(message)], memo="Client Example")
        auth_info = AuthInfo(
            signer_infos=[get_signer_info(key, sequence)],
            fee=Fee(amount=[Coin(amount="0", denom="afet")]),
        )
        signature = get_signature(key, body, auth_info, account_number, self.chain_id)

        transaction = Tx(body=body, auth_info=auth_info, signatures=[signature])

        return self.send(transaction)


@dataclass
class Broadcast(TransactionSender):
    mode: BroadcastMode = field(default=BroadcastMode.BROADCAST_MODE_SYNC)

    def send(self, transaction: Tx):
        request = BroadcastTxRequest(
            tx_bytes=transaction.SerializeToString(), mode=self.mode
        )

        return service_pb2_grpc.ServiceStub(self.channel).BroadcastTx(request)


@dataclass
class NodeClient:
    chain_id: str
    channel: grpc.Channel

    @staticmethod
    async def connect(chain_id: str, url: str) -> Self:
        return NodeClient(
            chain_id,
            grpc.secure_channel(url, grpc.ssl_channel_credentials()),
        )

    def broadcast(self, mode=BroadcastMode.BROADCAST_MODE_SYNC) -> Broadcast:
        return Broadcast(self.chain_id, self.channel, mode)

    async def get_account_balances(
        self, address: str
    ) -> bank_query.QueryAllBalancesResponse:
        stub = bank_query_grpc.QueryStub(self.channel)
        return stub.AllBalances(bank_query.QueryAllBalancesRequest(address=address))

    async def get_account_balance(
        self, address: str, denom: str
    ) -> bank_query.QueryBalanceResponse:
        stub = bank_query_grpc.QueryStub(self.channel)
        return stub.Balance(
            bank_query.QueryBalanceRequest(address=address, denom=denom)
        )

    async def get_account(self, address: str) -> BaseAccount:
        account = BaseAccount()
        response = auth.QueryStub(self.channel).Account(
            QueryAccountRequest(address=address)
        )
        if not response.account.Unpack(account):
            raise Exception("Failed to unpack account")
        return account

    async def latest_block(self) -> tendermint_query.GetLatestBlockResponse:
        return tendermint_query_grpc.ServiceStub(self.channel).GetLatestBlock(
            tendermint_query.GetLatestBlockRequest()
        )

    async def latest_block_height(self) -> int:
        block = await self.latest_block()
        return block.block.header.height

    async def get_user_stats(self, address: str) -> stats_query.QueryUserStatsResponse:
        stub = stats_query_grpc.QueryStub(self.channel)
        return stub.UserStats(stats_query.QueryUserStatsRequest(user=address))

    async def get_all_validators(
        self, status: str = ""
    ) -> staking_query.QueryValidatorsResponse:
        stub = staking_query_grpc.QueryStub(self.channel)
        return stub.Validators(staking_query.QueryValidatorsRequest(status=status))

    async def get_subaccount(
        self, address: str, account_number: int
    ) -> Optional[subaccount_type.Subaccount]:
        stub = subaccounts_query_grpc.QueryStub(self.channel)
        response = stub.Subaccount(
            QueryGetSubaccountRequest(owner=address, number=account_number)
        )
        return response.subaccount

    async def get_subaccounts(self) -> QuerySubaccountAllResponse:
        stub = subaccounts_query_grpc.QueryStub(self.channel)
        return stub.SubaccountAll(QueryAllSubaccountRequest())

    async def get_clob_pair(self, pair_id: int) -> clob_pair_type.ClobPair:
        stub = clob_query_grpc.QueryStub(self.channel)
        response = stub.ClobPair(clob_query.QueryGetClobPairRequest(id=pair_id))
        return response.clob_pair

    async def get_clob_pairs(self) -> QueryClobPairAllResponse:
        stub = clob_query_grpc.QueryStub(self.channel)
        return stub.ClobPairAll(QueryAllClobPairRequest())

    async def get_price(self, market_id: int) -> market_price_type.MarketPrice:
        stub = prices_query_grpc.QueryStub(self.channel)
        response = stub.MarketPrice(QueryMarketPriceRequest(id=market_id))
        return response.market_price

    async def get_prices(self) -> QueryAllMarketPricesResponse:
        stub = prices_query_grpc.QueryStub(self.channel)
        return stub.AllMarketPrices(QueryAllMarketPricesRequest())

    async def get_perpetual(self, perpetual_id: int) -> QueryPerpetualResponse:
        stub = perpetuals_query_grpc.QueryStub(self.channel)
        return stub.Perpetual(QueryPerpetualRequest(id=perpetual_id))

    async def get_perpetuals(self) -> QueryAllPerpetualsResponse:
        stub = perpetuals_query_grpc.QueryStub(self.channel)
        return stub.AllPerpetuals(QueryAllPerpetualsRequest())

    async def get_equity_tier_limit_config(
        self,
    ) -> equity_tier_limit_config_type.EquityTierLimitConfiguration:
        stub = clob_query_grpc.QueryStub(self.channel)
        response = stub.EquityTierLimitConfiguration(
            clob_query.QueryEquityTierLimitConfigurationRequest()
        )
        return response.equity_tier_limit_config

    async def get_delegator_delegations(
        self, delegator_addr: str
    ) -> staking_query.QueryDelegatorDelegationsResponse:
        stub = staking_query_grpc.QueryStub(self.channel)
        return stub.DelegatorDelegations(
            staking_query.QueryDelegatorDelegationsRequest(
                delegator_addr=delegator_addr
            )
        )

    async def get_delegator_unbonding_delegations(
        self, delegator_addr: str
    ) -> staking_query.QueryDelegatorUnbondingDelegationsResponse:
        stub = staking_query_grpc.QueryStub(self.channel)
        return stub.DelegatorUnbondingDelegations(
            staking_query.QueryDelegatorUnbondingDelegationsRequest(
                delegator_addr=delegator_addr
            )
        )

    async def get_delayed_complete_bridge_messages(
        self, address: str = ""
    ) -> bridge_query.QueryDelayedCompleteBridgeMessagesResponse:
        stub = bridge_query_grpc.QueryStub(self.channel)
        return stub.DelayedCompleteBridgeMessages(
            bridge_query.QueryDelayedCompleteBridgeMessagesRequest(address=address)
        )

    async def get_fee_tiers(self) -> fee_tier_query.QueryPerpetualFeeParamsResponse:
        stub = fee_tier_query_grpc.QueryStub(self.channel)
        return stub.PerpetualFeeParams(fee_tier_query.QueryPerpetualFeeParamsRequest())

    async def get_user_fee_tier(
        self, address: str
    ) -> fee_tier_query.QueryUserFeeTierResponse:
        stub = fee_tier_query_grpc.QueryStub(self.channel)
        return stub.UserFeeTier(fee_tier_query.QueryUserFeeTierRequest(user=address))

    async def get_rewards_params(self) -> rewards_query.QueryParamsResponse:
        stub = rewards_query_grpc.QueryStub(self.channel)
        return stub.Params(rewards_query.QueryParamsRequest())
