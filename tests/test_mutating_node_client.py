import pytest
import v4_proto

from dydx_v4_client.node.message import subaccount
from tests.conftest import retry_on_sequence_mismatch


def is_successful(response):
    return response.tx_response.code == 0


def assert_successful_broadcast(response):
    assert type(response) == v4_proto.cosmos.tx.v1beta1.service_pb2.BroadcastTxResponse
    assert is_successful(response)


@pytest.mark.order(1)
@pytest.mark.asyncio
async def test_deposit(node_client, test_address, wallet):
    response = await retry_on_sequence_mismatch(
        node_client.deposit,
        wallet,
        test_address,
        subaccount(test_address, 0),
        asset_id=0,
        quantums=10000000,
    )
    assert_successful_broadcast(response)


@pytest.mark.order(2)
@pytest.mark.asyncio
async def test_withdraw(node_client, wallet, test_address):
    response = await retry_on_sequence_mismatch(
        node_client.withdraw,
        wallet,
        subaccount(test_address, 0),
        test_address,
        asset_id=0,
        quantums=10000000,
    )
    assert_successful_broadcast(response)


@pytest.mark.order(3)
@pytest.mark.asyncio
async def test_send_token(node_client, wallet, test_address, recipient):
    response = await retry_on_sequence_mismatch(
        node_client.send_token,
        wallet,
        test_address,
        recipient,
        10000000,
        "adv4tnt",
    )
    assert_successful_broadcast(response)


@pytest.mark.order(4)
@pytest.mark.asyncio
async def test_order(node_client, test_order, test_order_id, wallet):
    wallet.sequence += 1

    placed = await retry_on_sequence_mismatch(
        node_client.place_order,
        wallet,
        test_order,
    )
    assert_successful_broadcast(placed)

    wallet.sequence += 1
    canceled = await retry_on_sequence_mismatch(
        node_client.cancel_order,
        wallet,
        test_order_id,
        good_til_block_time=test_order.good_til_block_time,
    )
    assert_successful_broadcast(canceled)
