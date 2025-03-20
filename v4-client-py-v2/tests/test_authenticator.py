import pytest

from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.authenticators import Authenticator, AuthenticatorType
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.wallet import Wallet
from tests.conftest import (
    DYDX_TEST_MNEMONIC,
    DYDX_TEST_MNEMONIC_2,
    TEST_ADDRESS,
    TEST_ADDRESS_2,
)


MARKET_ID = "ETH-USD"


@pytest.mark.asyncio
async def test_authenticator():
    node = await NodeClient.connect(TESTNET.node)
    indexer = IndexerClient(TESTNET.rest_indexer)

    # Set up the primary wallet for which we want to add authenticator
    wallet = await Wallet.from_mnemonic(
        node,
        mnemonic=DYDX_TEST_MNEMONIC,
        address=TEST_ADDRESS,
    )

    # Set up the "trader" wallet
    trader_wallet = await Wallet.from_mnemonic(
        node,
        mnemonic=DYDX_TEST_MNEMONIC_2,
        address=TEST_ADDRESS_2,
    )

    # Authenticate the "trader" wallet to place orders
    place_order_auth = Authenticator.compose(
        AuthenticatorType.AllOf,
        [
            Authenticator.signature_verification(trader_wallet.public_key.key),
            Authenticator.message_filter("/dydxprotocol.clob.MsgPlaceOrder"),
            Authenticator.compose(
                AuthenticatorType.AllOf,
                [
                    Authenticator.signature_verification(trader_wallet.public_key.key),
                    Authenticator.message_filter("/dydxprotocol.clob.MsgPlaceOrder"),
                ],
            ),
        ],
    )

    response = await node.add_authenticator(wallet, place_order_auth)

    assert response.tx_response.code == 0, response
