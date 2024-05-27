import hashlib
from dataclasses import dataclass
from functools import partial

import ecdsa
from bip_utils import Bip39SeedGenerator, Bip44, Bip44Coins
from v4_proto.cosmos.crypto.secp256k1.keys_pb2 import PubKey

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

    @property
    def public_key(self) -> PubKey:
        return PubKey(key=self.key.get_verifying_key().to_string("compressed"))
