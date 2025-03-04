import json
import pytest
from dydx_v4_client.node.authenticators import (
    Authenticator,
    AuthenticatorType,
    validate_authenticator,
)

from dydx_v4_client.key_pair import KeyPair
from dydx_v4_client.wallet import Wallet

from v4_proto.dydxprotocol.accountplus.query_pb2 import GetAuthenticatorsResponse

from tests.conftest import DYDX_TEST_MNEMONIC_2, get_wallet
from tests.test_mutating_node_client import assert_successful_broadcast


def test_signature_verification():
    wallet = Wallet(KeyPair.from_mnemonic(DYDX_TEST_MNEMONIC_2), 0, 0)

    EXPECTED_KEY_BYTES = wallet.public_key.key
    EXPECTED_MESSAGE = Authenticator(
        type=AuthenticatorType.SignatureVerification,
        config=EXPECTED_KEY_BYTES,
    )

    authenticator = Authenticator.signature_verification(wallet.public_key.key)

    assert authenticator == EXPECTED_MESSAGE


def test_authenticator_is_serializable():
    wallet = Wallet(KeyPair.from_mnemonic(DYDX_TEST_MNEMONIC_2), 0, 0)
    pub_key = wallet.public_key.key
    authenticator = Authenticator.signature_verification(pub_key)

    EXPECTED_KEY_BYTES = ", ".join(map(str, pub_key))

    auth_txt = json.dumps(authenticator.todict())
    assert (
        auth_txt
        == '{"type": "SignatureVerification", "config": [' + EXPECTED_KEY_BYTES + "]}"
    )


@pytest.mark.asyncio
async def test_get_authenticators(node_client, test_address):
    authenticators = await node_client.get_authenticators(test_address)
    assert isinstance(authenticators, GetAuthenticatorsResponse)


@pytest.mark.asyncio
async def test_auth_validation_top_level_anyof():
    auth = Authenticator.compose(
        AuthenticatorType.AnyOf,
        [
            Authenticator.signature_verification(b"pubkey1"),
            Authenticator.signature_verification(b"pubkey2"),
        ],
    )
    assert validate_authenticator(auth) == True


@pytest.mark.asyncio
async def test_auth_validation_top_level_anyof_with_nonsignature_nested_authenticator():
    auth = Authenticator.compose(
        AuthenticatorType.AnyOf,
        [
            Authenticator.signature_verification(b"pubkey1"),
            Authenticator.message_filter("/dydxprotocol"),
        ],
    )
    assert validate_authenticator(auth) == False


@pytest.mark.asyncio
async def test_auth_validation_top_level_allof():
    auth = Authenticator.compose(
        AuthenticatorType.AllOf,
        [
            Authenticator.signature_verification(b"pubkey1"),
            Authenticator.message_filter("/dydxprotocol"),
        ],
    )
    assert validate_authenticator(auth) == True


@pytest.mark.asyncio
async def test_auth_validation_top_level_allof_without_signature_authenticator():
    auth = Authenticator.compose(
        AuthenticatorType.AllOf,
        [
            Authenticator.message_filter("/dydxprotocol"),
            Authenticator.message_filter("/dydxprotocol"),
        ],
    )
    assert validate_authenticator(auth) == False


@pytest.mark.asyncio
async def test_auth_validation_nested_anyof():
    sig_auth = Authenticator.signature_verification(b"pubkey1")
    anyof_auth = Authenticator.compose(
        AuthenticatorType.AnyOf,
        [
            Authenticator.signature_verification(b"pubkey1"),
            Authenticator.signature_verification(b"pubkey1"),
        ],
    )

    auth = Authenticator.compose(
        AuthenticatorType.AllOf,
        [
            sig_auth,
            anyof_auth,
        ],
    )
    assert validate_authenticator(auth) == True


@pytest.mark.asyncio
async def test_auth_validation_nested_allof():
    sig_auth = Authenticator.signature_verification(b"pubkey1")
    anyof_auth = Authenticator.compose(
        AuthenticatorType.AllOf,
        [
            Authenticator.message_filter("/dydxprotocol"),
            Authenticator.message_filter("/dydxprotocol"),
        ],
    )

    auth = Authenticator.compose(
        AuthenticatorType.AllOf,
        [
            sig_auth,
            anyof_auth,
        ],
    )
    assert validate_authenticator(auth) == True


@pytest.mark.asyncio
async def test_auth_validation_nested_anyof_signature_verification():
    msg_auth = Authenticator.message_filter("/dydxprotocol")
    anyof_auth = Authenticator.compose(
        AuthenticatorType.AnyOf,
        [
            Authenticator.message_filter("/dydxprotocol"),
            Authenticator.signature_verification(b"pubkey1"),
        ],
    )

    auth = Authenticator.compose(
        AuthenticatorType.AllOf,
        [
            msg_auth,
            anyof_auth,
        ],
    )
    assert validate_authenticator(auth) == False


@pytest.mark.asyncio
async def test_auth_validation_nested_anyof_authenticators():
    msg_auth = Authenticator.message_filter("/dydxprotocol")
    anyof_auth = Authenticator.compose(
        AuthenticatorType.AnyOf,
        [
            Authenticator.message_filter("/dydxprotocol"),
            Authenticator.signature_verification(b"pubkey1"),
        ],
    )

    auth = Authenticator.compose(
        AuthenticatorType.AnyOf,
        [
            msg_auth,
            anyof_auth,
        ],
    )
    assert validate_authenticator(auth) == False
