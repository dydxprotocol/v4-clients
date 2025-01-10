import hashlib
from typing import Tuple

from ecdsa import SigningKey, SECP256k1
from ecdsa.util import sigencode_string_canonize


from dydx_v4_client.key_pair import KeyPair
from dydx_v4_client.wallet import (
    Wallet,
)

from tests.conftest import (
    DYDX_TEST_MNEMONIC as test_mnemonic,
    DYDX_TEST_PRIVATE_KEY as test_private_key,
)


def ecdsa_key_from_hex(hex_key: str) -> SigningKey:
    return SigningKey.from_string(
        bytes.fromhex(hex_key),
        curve=SECP256k1,
        hashfunc=hashlib.sha256,
    )


def ecdsa_sign_raw(message: bytes, priv_key: SigningKey) -> Tuple[int, int]:
    no_encode = lambda r, s, _: (r, s)
    return priv_key.sign_deterministic(message, sigencode=no_encode)


def ecdsa_sign(message: bytes, priv_key: SigningKey) -> bytes:
    return priv_key.sign(message, sigencode=sigencode_string_canonize)


def test_address_derivation(test_address):
    wallet = Wallet(KeyPair.from_mnemonic(test_mnemonic), 0, 0)
    assert wallet.address == test_address


def test_address_derivation2(test_address):
    wallet = Wallet(KeyPair.from_hex(test_private_key), 0, 0)
    assert wallet.address == test_address


def test_assert_public_key_compressed_format(test_public_key):
    key = KeyPair.from_hex(test_private_key)
    assert key.public_key_bytes.hex() == test_public_key


def test_assert_public_key(test_public_key):
    wallet = Wallet(KeyPair.from_hex(test_private_key), 0, 0)
    assert wallet.public_key.key.hex() == test_public_key


def test_assert_public_key2(test_public_key):
    wallet = Wallet(KeyPair.from_hex(test_private_key), 0, 0)
    assert wallet.public_key.key.hex() == test_public_key


def test_key_serialization():
    key = KeyPair.from_hex(test_private_key)
    assert key.key.to_hex() == test_private_key


def test_message_signing_ecdsa():
    key = ecdsa_key_from_hex(test_private_key)
    message = b"hello, world!"
    signature = ecdsa_sign(message, key)

    assert key.get_verifying_key().verify(signature, message)

    # key assertion
    key_repr = key.get_verifying_key().__repr__()
    assert key_repr.startswith("VerifyingKey.from_string(")
    assert "SECP256k1" in key_repr
    assert "sha256" in key_repr

    # signature encoding assertions
    assert len(signature) == 64


def test_message_signing():
    key = KeyPair.from_hex(test_private_key)
    message = b"hello, world!"

    signature = key.sign(message)
    assert len(signature) == 64

    # signature verification
    # NOTE: Because our signature is encoded in 64-bytes canonical format,
    # we need to use `ecdsa` library to verify it.
    # This verification is for test purposes only, production code does not need it.
    old_key = ecdsa_key_from_hex(test_private_key)
    assert old_key.get_verifying_key().verify(signature, message)
