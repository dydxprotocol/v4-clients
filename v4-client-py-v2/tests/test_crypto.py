import hashlib
from typing import Tuple


from dydx_v4_client.key_pair import KeyPair
from dydx_v4_client.wallet import (
    Wallet,
)

from tests.conftest import (
    DYDX_TEST_MNEMONIC as test_mnemonic,
    DYDX_TEST_PRIVATE_KEY as test_private_key,
)


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


def test_message_signing():
    key = KeyPair.from_hex(test_private_key)
    message = b"hello, world!"

    signature = key.sign(message)
    assert len(signature) == 64

    # signature verification
    # NOTE: Because our signature is encoded in 64-bytes canonical format,
    # we need to use `ecdsa` library to verify it.
    # Production code does not need signature verification so we could.
    # entirerly remove ecdsa dependency.
