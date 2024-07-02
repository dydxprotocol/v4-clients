import hashlib
from dataclasses import dataclass
from functools import partial
from typing import TYPE_CHECKING

import bech32
import ecdsa
from Crypto.Hash import RIPEMD160
from bip_utils import Bip39SeedGenerator, Bip44, Bip44Coins
from v4_proto.cosmos.crypto.secp256k1.keys_pb2 import PubKey

if TYPE_CHECKING:
    from dydx_v4_client.node.client import NodeClient


from_string = partial(
    ecdsa.SigningKey.from_string, curve=ecdsa.SECP256k1, hashfunc=hashlib.sha256
)


def bytes_from_mnemonic(mnemonic: str) -> bytes:
    seed = Bip39SeedGenerator(mnemonic).Generate()
    return (
        Bip44.FromSeed(seed, Bip44Coins.COSMOS)
        .DeriveDefaultPath()
        .PrivateKey()
        .Raw()
        .ToBytes()
    )


def from_mnemonic(mnemonic: str) -> ecdsa.SigningKey:
    return from_string(bytes_from_mnemonic(mnemonic))


@dataclass
class Wallet:
    key: ecdsa.SigningKey
    account_number: int
    sequence: int

    @staticmethod
    async def from_mnemonic(node: "NodeClient", mnemonic: str, address: str):
        account = await node.get_account(address)
        return Wallet(from_mnemonic(mnemonic), account.account_number, account.sequence)

    @property
    def public_key(self) -> PubKey:
        return PubKey(key=self.key.get_verifying_key().to_string("compressed"))

    @property
    def address(self) -> str:
        public_key_bytes = self.public_key.key
        sha256_hash = hashlib.sha256(public_key_bytes).digest()
        ripemd160_hash = RIPEMD160.new(sha256_hash).digest()
        return bech32.bech32_encode("dydx", bech32.convertbits(ripemd160_hash, 8, 5))
