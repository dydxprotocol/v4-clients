import hashlib
from dataclasses import dataclass
from typing import TYPE_CHECKING

import bech32
from Crypto.Hash import RIPEMD160

from v4_proto.cosmos.crypto.secp256k1.keys_pb2 import PubKey

from dydx_v4_client.key_pair import KeyPair

if TYPE_CHECKING:
    from dydx_v4_client.node.client import NodeClient


@dataclass
class Wallet:
    key: KeyPair
    account_number: int
    sequence: int

    @staticmethod
    async def from_mnemonic(node: "NodeClient", mnemonic: str, address: str):
        account = await node.get_account(address)
        return Wallet(
            KeyPair.from_mnemonic(mnemonic), account.account_number, account.sequence
        )

    @property
    def public_key(self) -> PubKey:
        return PubKey(key=self.key.public_key_bytes)

    @property
    def address(self) -> str:
        public_key_bytes = self.key.public_key_bytes
        sha256_hash = hashlib.sha256(public_key_bytes).digest()
        ripemd160_hash = RIPEMD160.new(sha256_hash).digest()
        return bech32.bech32_encode("dydx", bech32.convertbits(ripemd160_hash, 8, 5))
