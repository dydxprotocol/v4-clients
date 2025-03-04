from dataclasses import dataclass
from typing import List, Optional

import google
from google.protobuf.message import Message
from v4_proto.cosmos.base.v1beta1.coin_pb2 import Coin
from v4_proto.cosmos.tx.signing.v1beta1.signing_pb2 import SignMode
from v4_proto.cosmos.tx.v1beta1.tx_pb2 import (
    AuthInfo,
    Fee,
    ModeInfo,
    SignDoc,
    SignerInfo,
    Tx,
    TxBody,
)

from dydx_v4_client.node.fee import calculate_fee, Denom
from dydx_v4_client.wallet import Wallet
from v4_proto.dydxprotocol.accountplus.tx_pb2 import TxExtension


def as_any(message: Message):
    packed = google.protobuf.any_pb2.Any()
    packed.Pack(message, type_url_prefix="/")
    return packed


def get_signer_info(public_key, sequence):
    return SignerInfo(
        public_key=as_any(public_key),
        mode_info=ModeInfo(single=ModeInfo.Single(mode=SignMode.SIGN_MODE_DIRECT)),
        sequence=sequence,
    )


def get_signature(key_pair, body, auth_info, account_number, chain_id):
    signdoc = SignDoc(
        body_bytes=body.SerializeToString(),
        auth_info_bytes=auth_info.SerializeToString(),
        account_number=account_number,
        chain_id=chain_id,
    )

    return key_pair.sign(signdoc.SerializeToString())


DEFAULT_FEE = Fee(
    amount=[],
    gas_limit=1000000,
)


@dataclass
class TxOptions:
    authenticators: List[int]
    sequence: int
    account_number: int


@dataclass
class Builder:
    chain_id: str
    denomination: str
    memo: str = "Client Example"

    def calculate_fee(self, gas_used) -> Fee:
        gas_limit, amount = calculate_fee(gas_used, Denom(self.denomination))
        return self.fee(gas_limit, self.coin(amount))

    def coin(self, amount: int) -> Coin:
        return Coin(amount=str(amount), denom=self.denomination)

    def fee(self, gas_limit: int, *amount: List[Coin]) -> Fee:
        return Fee(
            amount=amount,
            gas_limit=gas_limit,
        )

    def build_transaction(
        self,
        wallet: Wallet,
        messages: List[Message],
        fee: Fee,
        tx_options: Optional[TxOptions] = None,
    ) -> Tx:
        non_critical_extension_options = []
        if tx_options is not None:
            tx_extension = TxExtension(
                selected_authenticators=tx_options.authenticators,
            )
            non_critical_extension_options.append(as_any(tx_extension))
        body = TxBody(
            messages=messages,
            memo=self.memo,
            non_critical_extension_options=non_critical_extension_options,
        )
        auth_info = AuthInfo(
            signer_infos=[
                get_signer_info(
                    wallet.public_key,
                    tx_options.sequence if tx_options else wallet.sequence,
                )
            ],
            fee=fee,
        )
        signature = get_signature(
            wallet.key,
            body,
            auth_info,
            tx_options.account_number if tx_options else wallet.account_number,
            self.chain_id,
        )

        return Tx(body=body, auth_info=auth_info, signatures=[signature])

    def build(
        self,
        wallet: Wallet,
        message: Message,
        fee: Fee = DEFAULT_FEE,
        tx_options: Optional[dict] = None,
    ) -> Tx:
        return self.build_transaction(wallet, [as_any(message)], fee, tx_options)
