import hashlib
from functools import partial
from typing import List, Optional

import ecdsa
import grpc
from ecdsa.util import sigencode_string_canonize
from v4_proto.cosmos.auth.v1beta1 import query_pb2_grpc as auth
from v4_proto.cosmos.auth.v1beta1.auth_pb2 import BaseAccount
from v4_proto.cosmos.auth.v1beta1.query_pb2 import QueryAccountRequest
from v4_proto.cosmos.bank.v1beta1 import query_pb2 as bank_query
from v4_proto.cosmos.bank.v1beta1 import query_pb2_grpc as bank_query_grpc
from v4_proto.cosmos.base.abci.v1beta1.abci_pb2 import TxResponse
from v4_proto.cosmos.base.v1beta1.coin_pb2 import Coin
from v4_proto.cosmos.crypto.secp256k1.keys_pb2 import PubKey
from v4_proto.cosmos.tx.signing.v1beta1.signing_pb2 import SignMode
from v4_proto.cosmos.tx.v1beta1 import service_pb2_grpc
from v4_proto.cosmos.tx.v1beta1.service_pb2 import (
    BroadcastMode,
    BroadcastTxRequest,
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

from dydx_v4_client.indexer.rest.constants import GAS_MULTIPLIER
from dydx_v4_client.node.client import as_any
from dydx_v4_client.wallet import from_mnemonic

from_string = partial(
    ecdsa.SigningKey.from_string, curve=ecdsa.SECP256k1, hashfunc=hashlib.sha256
)


class NobleClient:
    def __init__(self, rest_endpoint: str, default_client_memo: Optional[str] = None):
        self.rest_endpoint = rest_endpoint
        self.default_client_memo = default_client_memo
        self.wallet = None
        self.channel = None

    @property
    def is_connected(self) -> bool:
        return self.channel is not None

    async def connect(self, mnemonic: str):
        if not mnemonic:
            raise ValueError("Mnemonic not provided")
        private_key = from_mnemonic(mnemonic)
        self.wallet = private_key
        self.channel = grpc.secure_channel(
            self.rest_endpoint,
            grpc.ssl_channel_credentials(),
        )

    async def get_account_balances(
        self, address: str
    ) -> bank_query.QueryAllBalancesResponse:
        if self.channel is None:
            raise ValueError("NobleClient channel not initialized")
        stub = bank_query_grpc.QueryStub(self.channel)
        return stub.AllBalances(bank_query.QueryAllBalancesRequest(address=address))

    async def get_account_balance(
        self, address: str, denom: str
    ) -> bank_query.QueryBalanceResponse:
        if self.channel is None:
            raise ValueError("NobleClient channel not initialized")
        stub = bank_query_grpc.QueryStub(self.channel)
        return stub.Balance(
            bank_query.QueryBalanceRequest(address=address, denom=denom)
        )

    async def get_account(self, address: str) -> BaseAccount:
        if self.channel is None:
            raise ValueError("NobleClient channel not initialized")
        account = BaseAccount()
        response = auth.QueryStub(self.channel).Account(
            QueryAccountRequest(address=address)
        )
        if not response.account.Unpack(account):
            raise Exception("Failed to unpack account")
        return account

    async def send(
        self,
        messages: List[dict],
        gas_price: str = "0.025uusdc",
        memo: Optional[str] = None,
    ) -> TxResponse:
        if self.channel is None:
            raise ValueError("NobleClient channel not initialized")
        if self.wallet is None:
            raise ValueError("NobleClient wallet not initialized")

        # Simulate to get the gas estimate
        fee = await self.simulate_transaction(
            messages, gas_price, memo or self.default_client_memo
        )

        # Sign and broadcast the transaction
        signer_info = SignerInfo(
            public_key=as_any(
                PubKey(key=self.wallet.get_verifying_key().to_string("compressed"))
            ),
            mode_info=ModeInfo(single=ModeInfo.Single(mode=SignMode.SIGN_MODE_DIRECT)),
            sequence=self.get_account(
                self.wallet.get_verifying_key().to_string()
            ).sequence,
        )
        body = TxBody(messages=messages, memo=memo or self.default_client_memo)
        auth_info = AuthInfo(signer_infos=[signer_info], fee=fee)
        signature = self.wallet.sign(
            SignDoc(
                body_bytes=body.SerializeToString(),
                auth_info_bytes=auth_info.SerializeToString(),
                account_number=self.get_account(
                    self.wallet.get_verifying_key().to_string()
                ).account_number,
                chain_id=self.chain_id,
            ).SerializeToString(),
            sigencode=sigencode_string_canonize,
        )

        tx = Tx(body=body, auth_info=auth_info, signatures=[signature])
        request = BroadcastTxRequest(
            tx_bytes=tx.SerializeToString(), mode=BroadcastMode.BROADCAST_MODE_SYNC
        )
        return service_pb2_grpc.ServiceStub(self.channel).BroadcastTx(request)

    async def simulate_transaction(
        self,
        messages: List[dict],
        gas_price: str = "0.025uusdc",
        memo: Optional[str] = None,
    ) -> Fee:
        if self.channel is None:
            raise ValueError("NobleClient channel not initialized")
        if self.wallet is None:
            raise ValueError("NobleClient wallet not initialized")

        # Get simulated response
        signer_info = SignerInfo(
            public_key=as_any(
                PubKey(key=self.wallet.get_verifying_key().to_string("compressed"))
            ),
            mode_info=ModeInfo(single=ModeInfo.Single(mode=SignMode.SIGN_MODE_DIRECT)),
            sequence=self.get_account(
                self.wallet.get_verifying_key().to_string()
            ).sequence,
        )
        body = TxBody(messages=messages, memo=memo or self.default_client_memo)
        auth_info = AuthInfo(signer_infos=[signer_info], fee=Fee(gas_limit=0))
        request = SimulateRequest(
            tx=Tx(body=body, auth_info=auth_info),
        )
        response = service_pb2_grpc.ServiceStub(self.channel).Simulate(request)

        # Calculate and return the fee
        gas_limit = int(response.gas_info.gas_used * GAS_MULTIPLIER)
        return Fee(
            amount=[
                Coin(
                    amount=str(int(gas_limit * float(gas_price.split("u")[0]))),
                    denom=gas_price.split("u")[1],
                )
            ],
            gas_limit=gas_limit,
        )
