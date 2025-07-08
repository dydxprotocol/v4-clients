import asyncio

import pytest
import time

from dydx_v4_client.node.message import send_token

REQUEST_PROCESSING_TIME = 2


@pytest.fixture(autouse=True)
def sleep_after_test(request):
    """
    Applies 5 seconds sleep to all tests in this file.
    It gives the testnet the time to process the request.
    Otherwise tests would throw incorrect sequence errors.
    """
    yield
    time.sleep(REQUEST_PROCESSING_TIME)


@pytest.mark.asyncio
async def test_create_transaction(node_client, test_address, wallet, recipient):
    send_token_msg = send_token(test_address, recipient, 10000000, "adv4tnt")
    tx = await node_client.create_transaction(wallet, send_token_msg)
    assert tx is not None
    assert tx.body is not None
    assert tx.auth_info is not None
    assert tx.signatures is not None


@pytest.mark.asyncio
async def test_query_transaction(node_client, wallet, test_address, recipient):
    send_token_msg = send_token(test_address, recipient, 10000000, "adv4tnt")
    tx = await node_client.create_transaction(wallet, send_token_msg)
    broadcast_response = await node_client.broadcast(tx)
    await asyncio.sleep(5)
    response_tx = await node_client.query_transaction(
        broadcast_response.tx_response.txhash
    )
    assert tx == response_tx


@pytest.mark.asyncio
async def test_query_address(node_client, test_address):
    response = await node_client.query_address(test_address)
    assert response is not None
    assert isinstance(response, tuple)


@pytest.mark.asyncio
async def test_create_market_permissionless(node_client, wallet, test_address):
    ticker = "ETH-USD"
    try:
        response = await node_client.create_market_permissionless(
            wallet, ticker, test_address, 0
        )
        assert response is not None
        assert response.tx_response is not None
        assert response.tx_response.txhash is not None
    except Exception as e:
        assert f"{ticker}: Market params pair already exists" in str(e)


@pytest.mark.asyncio
async def test_undelegate(node_client, wallet, test_address):
    validator = await node_client.get_all_validators()
    assert validator is not None
    assert len(validator.validators) > 0
    response = await node_client.undelegate(
        wallet,
        test_address,
        validator.validators[0].operator_address,
        100000,
        "adv4tnt",
    )
    assert response is not None
    assert response.tx_response is not None
    assert response.tx_response.txhash is not None


@pytest.mark.asyncio
async def test_delegate(node_client, wallet, test_address):
    validator = await node_client.get_all_validators()
    assert validator is not None
    assert len(validator.validators) > 0
    response = await node_client.delegate(
        wallet,
        test_address,
        validator.validators[0].operator_address,
        100000,
        "adv4tnt",
    )
    assert response is not None
    assert response.tx_response is not None
    assert response.tx_response.txhash is not None


@pytest.mark.asyncio
async def test_withdraw_delegate_reward(node_client, wallet, test_address):
    validator = await node_client.get_all_validators()
    assert validator is not None
    assert len(validator.validators) > 0
    response = await node_client.withdraw_delegate_reward(
        wallet, test_address, validator.validators[0].operator_address
    )
    assert response is not None
    assert response.tx_response is not None
    assert response.tx_response.txhash is not None


@pytest.mark.asyncio
async def test_register_affiliate(node_client, wallet, test_address, recipient):
    try:
        response = await node_client.register_affiliate(wallet, test_address, recipient)
        assert response is not None
        assert response.tx_response is not None
        assert response.tx_response.txhash is not None
    except Exception as e:
        assert "Affiliate already exists for referee" in str(e)
