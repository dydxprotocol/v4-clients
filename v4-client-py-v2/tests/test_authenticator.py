import pytest
import time

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.authenticators import Authenticator, AuthenticatorType
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.wallet import Wallet
from tests.conftest import (
    DYDX_TEST_MNEMONIC_3,
    DYDX_TEST_MNEMONIC_2,
    TEST_ADDRESS_3,
    TEST_ADDRESS_2
)

REQUEST_PROCESSING_TIME = 5


@pytest.fixture(autouse=True)
def sleep_after_test(request):
    """
    Applies 5 seconds sleep to all tests in this file.
    It gives the testnet the time to process the request.
    Otherwise tests would throw incorrect sequence errors.
    """
    yield
    time.sleep(REQUEST_PROCESSING_TIME)


async def connection_setup():
    node = await NodeClient.connect(TESTNET.node)
    wallet = await Wallet.from_mnemonic(
        node,
        mnemonic=DYDX_TEST_MNEMONIC_3,
        address=TEST_ADDRESS_3,
    )
    trader_wallet = await Wallet.from_mnemonic(
        node,
        mnemonic=DYDX_TEST_MNEMONIC_2,
        address=TEST_ADDRESS_2,
    )
    return node, wallet, trader_wallet


@pytest.mark.asyncio
async def test_auth_add_single():
    node, wallet, trader_wallet = await connection_setup()

    # Authenticate the "trader" wallet
    place_order_auth = Authenticator.signature_verification(
        trader_wallet.public_key.key
    )

    response = await node.add_authenticator(wallet, place_order_auth)

    assert response.tx_response.code == 0, response


@pytest.mark.asyncio
async def test_auth_add_allof_anyof():
    node, wallet, trader_wallet = await connection_setup()

    # Authenticate the "trader" wallet to place orders
    place_order_auth = Authenticator.compose(
        AuthenticatorType.AllOf,
        [
            Authenticator.signature_verification(trader_wallet.public_key.key),
            Authenticator.compose(
                AuthenticatorType.AnyOf,
                [
                    Authenticator.message_filter("/dydxprotocol.clob.MsgPlaceOrder"),
                    Authenticator.message_filter("/dydxprotocol.clob.MsgCancelOrder"),
                ],
            ),
        ],
    )

    response = await node.add_authenticator(wallet, place_order_auth)

    assert response.tx_response.code == 0, response


@pytest.mark.asyncio
async def test_auth_add_allof_allof_anyof():
    node, wallet, trader_wallet = await connection_setup()

    # Authenticate the "trader" wallet to place orders under subaccount 0
    place_order_auth = Authenticator.compose(
        AuthenticatorType.AllOf,
        [
            Authenticator.signature_verification(trader_wallet.public_key.key),
            Authenticator.compose(
                AuthenticatorType.AllOf,
                [
                    Authenticator.subaccount_filter("0"),
                    Authenticator.compose(
                        AuthenticatorType.AnyOf,
                        [
                            Authenticator.message_filter(
                                "/dydxprotocol.clob.MsgPlaceOrder"
                            ),
                            Authenticator.message_filter(
                                "/dydxprotocol.clob.MsgCancelOrder"
                            ),
                        ],
                    ),
                ],
            ),
        ],
    )

    response = await node.add_authenticator(wallet, place_order_auth)

    assert response.tx_response.code == 0, response
