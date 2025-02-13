import json
import pytest
from dydx_v4_client.node.authenticators import Authenticator, AuthenticatorType

from dydx_v4_client.key_pair import KeyPair
from dydx_v4_client.wallet import Wallet

from v4_proto.dydxprotocol.accountplus.query_pb2 import GetAuthenticatorsResponse

from tests.conftest import DYDX_TEST_MNEMONIC_2
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

    auth_txt = json.dumps(authenticator.encode())
    assert (
        auth_txt
        == '{"type": "SignatureVerification", "config": [' + EXPECTED_KEY_BYTES + "]}"
    )


@pytest.mark.asyncio
async def test_get_authenticators(node_client, test_address):
    authenticators = await node_client.get_authenticators(test_address)
    assert isinstance(authenticators, GetAuthenticatorsResponse)


@pytest.mark.asyncio
async def test_add_authenticator(node_client, wallet):
    add_response = await node_client.add_authenticator(
        wallet,
        Authenticator.message_filter("/dydxprotocol.clob.MsgPlaceOrder"),
    )
    assert_successful_broadcast(add_response)
