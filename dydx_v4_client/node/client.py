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
from v4_proto.dydxprotocol.clob.order_pb2 import Order, OrderId
from v4_proto.dydxprotocol.clob.tx_pb2 import MsgCancelOrder, MsgPlaceOrder
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
        request = SimulateRequest(
            tx=transaction,
            tx_bytes=transaction.SerializeToString(),
        )

        return service_pb2_grpc.ServiceStub(self.channel).Sim(request)


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
