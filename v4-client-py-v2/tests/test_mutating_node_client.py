import time

import grpc
import pytest
import v4_proto

from dydx_v4_client.node.message import subaccount
from tests.conftest import get_wallet

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


def is_successful(response):
    return response.tx_response.code == 0


def assert_successful_broadcast(response):
    assert type(response) == v4_proto.cosmos.tx.v1beta1.service_pb2.BroadcastTxResponse
    assert is_successful(response)


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
    node_client, test_order, test_order_id, test_address, private_key, wallet
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
        time.sleep(1.5)

        wallet = await get_wallet(node_client, private_key, test_address)

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
