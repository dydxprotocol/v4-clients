"""
This module implements ECDSA (Elliptic Curve Digital Signature Algorithm) key pair wrapper class. Initially `ecdsa.SigningKey` was directly used. However due to security concerns and to avoid direct dependency on specific implementation, `KeyPair class was introduced. This class provides a wrapper around the `coincurve.PrivateKey` and mimics how `ecdsa` was used before.
"""

from dataclasses import dataclass
from typing import Tuple

from bip_utils import Bip39SeedGenerator, Bip44, Bip44Coins
from coincurve import PrivateKey
from coincurve.utils import GROUP_ORDER_INT, int_to_bytes


def bytes_from_mnemonic(mnemonic: str) -> bytes:
    seed = Bip39SeedGenerator(mnemonic).Generate()
    return (
        Bip44.FromSeed(seed, Bip44Coins.COSMOS)
        .DeriveDefaultPath()
        .PrivateKey()
        .Raw()
        .ToBytes()
    )


@dataclass
class KeyPair:
    """
    Wrapper class around `coincurve.PrivateKey` to mimic `ecdsa.SigningKey` behavior.
    """

    key: PrivateKey

    @staticmethod
    def from_mnemonic(mnemonic: str) -> "KeyPair":
        """
        Creates a private key from a mnemonic.
        """
        return KeyPair(PrivateKey(bytes_from_mnemonic(mnemonic)))

    @staticmethod
    def from_hex(hex_key: str) -> "KeyPair":
        """
        Creates a private key from a hex string.
        """
        return KeyPair(PrivateKey.from_hex(hex_key))

    def sign(self, message: bytes) -> bytes:
        """
        Signs a message using the private key. Signature is encoded the same way as `ecdsa.util.sigencode_string_canonize`, to cointains 64-bytes.
        """
        signature = self.key.sign_recoverable(message)
        return coinsign_canonize(signature)

    @property
    def public_key_bytes(self) -> bytes:
        """
        Returns the public key bytes of the key pair in compressed format.
        """
        return self.key.public_key.format(compressed=True)


def coinsign_extract(signature: bytes) -> Tuple[int, int]:
    assert len(signature) == 65

    r = int.from_bytes(signature[:32], "big")
    s = int.from_bytes(signature[32:64], "big")

    return r, s


def coinsign_canonize(signature: bytes) -> bytes:
    r, s = coinsign_extract(signature)

    if s > GROUP_ORDER_INT // 2:
        s = GROUP_ORDER_INT - s

    r_bytes = int_to_bytes(r)
    s_bytes = int_to_bytes(s)
    return r_bytes.rjust(32, b"\x00") + s_bytes.rjust(32, b"\x00")
