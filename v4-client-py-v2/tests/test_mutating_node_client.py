import time
import grpc
import pytest
import asyncio

from dydx_v4_client.node.message import subaccount, send_token
from tests.conftest import get_wallet, assert_successful_broadcast


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


@pytest.mark.asyncio
async def test_deposit(node_client, test_address, wallet):
    response = await node_client.deposit(
        wallet,
        test_address,
        subaccount(test_address, 0),
        asset_id=0,
        quantums=10000000,
    )
    assert_successful_broadcast(response)


@pytest.mark.asyncio
async def test_withdraw(node_client, wallet, test_address):
    try:
        response = await node_client.withdraw(
            wallet,
            subaccount(test_address, 0),
            test_address,
            asset_id=0,
            quantums=10000000,
        )
        assert_successful_broadcast(response)
    except grpc.RpcError as e:
        if "StillUndercollateralized" in str(e.details()):
            pytest.xfail("Subaccount is undercollateralized. Skipping the test.")
        else:
            raise e


@pytest.mark.asyncio
async def test_send_token(node_client, wallet, test_address, recipient):
    response = await node_client.send_token(
        wallet,
        test_address,
        recipient,
        10000000,
        "adv4tnt",
    )
    assert_successful_broadcast(response)


@pytest.mark.asyncio
async def test_order(
    node_client, test_order, test_order_id, test_address, key_pair, wallet
):
    try:
        placed = await node_client.place_order(
            wallet,
            test_order,
        )
        assert_successful_broadcast(placed)

        # If the time is too short the result of cancel order is sequence error:
        # codespace: "sdk"\n  code: 32\n  raw_log: "account sequence mismatch, expected 1460, got 1459: incorrect account sequence"
        # If the time is too long the result is:
        # codespace: "clob"\n  code:...hj67cghhf9jypslcf9sh2n5k6art Number:0} ClientId:13850897 OrderFlags:64 ClobPairId:0}: Stateful order does not exist"
        time.sleep(2)

        wallet = await get_wallet(node_client, key_pair, test_address)

        canceled = await node_client.cancel_order(
            wallet,
            test_order_id,
            good_til_block_time=test_order.good_til_block_time,
        )
        assert_successful_broadcast(canceled)
    except Exception as e:
        if "StillUndercollateralized" in str(e) or "NewlyUndercollateralized" in str(e):
            pytest.skip("Account is undercollateralized. Skipping the test.")
        else:
            raise e


@pytest.mark.asyncio
async def test_order_cancel(
    node_client, test_order, test_order_id, test_address, key_pair, wallet
):
    try:
        placed = await node_client.place_order(
            wallet,
            test_order,
        )
        assert_successful_broadcast(placed)

        # If the time is too short the result of cancel order is sequence error:
        # codespace: "sdk"\n  code: 32\n  raw_log: "account sequence mismatch, expected 1460, got 1459: incorrect account sequence"
        # If the time is too long the result is:
        # codespace: "clob"\n  code:...hj67cghhf9jypslcf9sh2n5k6art Number:0} ClientId:13850897 OrderFlags:64 ClobPairId:0}: Stateful order does not exist"
        time.sleep(2)

        wallet = await get_wallet(node_client, key_pair, test_address)

        canceled = await node_client.cancel_order(
            wallet,
            test_order_id,
            good_til_block_time=test_order.good_til_block_time,
        )
        assert_successful_broadcast(canceled)
        # assert canceled.__repr__() == ""
    except Exception as e:
        if "StillUndercollateralized" in str(e) or "NewlyUndercollateralized" in str(e):
            pytest.skip("Account is undercollateralized. Skipping the test.")
        else:
            raise e


@pytest.mark.asyncio
async def test_transfer(node_client, wallet, test_address, recipient):
    try:
        response = await node_client.transfer(
            wallet,
            subaccount(test_address, 0),
            subaccount(recipient, 1),
            asset_id=0,
            amount=1,
        )
        assert_successful_broadcast(response)
    except grpc.RpcError as e:
        if "StillUndercollateralized" in str(e):
            pytest.skip("Subaccount is undercollateralized. Skipping the test.")
        else:
            raise e


@pytest.mark.asyncio
async def test_create_transaction_and_query_transaction(
    node_client, test_address, wallet, recipient
):
    send_token_msg = send_token(test_address, recipient, 10000000, "adv4tnt")
    tx = await node_client.create_transaction(wallet, send_token_msg)
    assert tx is not None
    assert tx.body is not None
    assert tx.auth_info is not None
    assert tx.signatures is not None
    broadcast_response = await node_client.broadcast(tx)
    assert broadcast_response is not None
    assert broadcast_response.tx_response is not None
    await asyncio.sleep(5)
    tx_send_message = await node_client.query_transaction(
        broadcast_response.tx_response.txhash
    )
    assert tx_send_message == tx


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
async def test_delegate_undelegate(node_client, wallet, test_address):
    validator = await node_client.get_all_validators()
    assert validator is not None
    assert len(validator.validators) > 0
    undelgations = await node_client.get_delegator_unbonding_delegations(test_address)
    assert undelgations is not None
    validator_to_num_of_undelegations = {
        v.operator_address: 0 for v in validator.validators
    }
    for u in undelgations.unbonding_responses:
        validator_to_num_of_undelegations[u.validator_address] += 1
    validator_address_with_least_undelegations = min(
        validator_to_num_of_undelegations.items(), key=lambda item: item[1]
    )[0]
    delegate_response = await node_client.delegate(
        wallet,
        test_address,
        validator_address_with_least_undelegations,
        100000,
        "adv4tnt",
    )
    await asyncio.sleep(5)
    await node_client.query_transaction(delegate_response.tx_response.txhash)

    undelegate_response = await node_client.undelegate(
        wallet,
        test_address,
        validator_address_with_least_undelegations,
        100000,
        "adv4tnt",
    )
    assert undelegate_response is not None
    assert undelegate_response.tx_response is not None
    await asyncio.sleep(5)
    await node_client.query_transaction(undelegate_response.tx_response.txhash)


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
    await asyncio.sleep(5)
    await node_client.query_transaction(response.tx_response.txhash)


@pytest.mark.asyncio
async def test_register_affiliate(node_client, wallet, test_address, recipient):
    try:
        response = await node_client.register_affiliate(wallet, test_address, recipient)
        assert response is not None
        assert response.tx_response is not None
        assert response.tx_response.txhash is not None
        await asyncio.sleep(5)
        await node_client.query_transaction(response.tx_response.txhash)
    except Exception as e:
        assert "Affiliate already exists for referee" in str(e)
