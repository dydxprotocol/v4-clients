import pytest
import v4_proto
from v4_proto.cosmos.bank.v1beta1 import query_pb2 as bank_query

from dydx_v4_client.node.message import subaccount
from dydx_v4_client.wallet import Wallet


def is_successful(response):
    return response.tx_response.code == 0


def assert_successful_broadcast(response):
    assert type(response) == v4_proto.cosmos.tx.v1beta1.service_pb2.BroadcastTxResponse
    assert is_successful(response)


async def test_get_account_balances(node_client, test_address):
    result = await node_client.get_account_balances(test_address)
    assert type(result) == bank_query.QueryAllBalancesResponse


@pytest.mark.skip
async def test_transfer(node, test_address, recipient, wallet):
    response = await node.transfer(
        wallet,
        subaccount(test_address, 0),
        subaccount(recipient, 1),
        asset_id=0,
        amount=1,
    )
    wallet.sequence += 1

    assert_successful_broadcast(response)


async def test_deposit(node, test_address, wallet):
    response = await node.deposit(
        wallet,
        test_address,
        subaccount(test_address, 0),
        asset_id=0,
        quantums=10000000,
    )
    print(response)

    assert_successful_broadcast(response)


async def test_withdraw(node, wallet, test_address):
    wallet.sequence += 1
    response = await node.withdraw(
        wallet,
        subaccount(test_address, 0),
        test_address,
        asset_id=0,
        quantums=10000000,
    )

    assert_successful_broadcast(response)


async def test_send_token(node, wallet, test_address, recipient):
    wallet.sequence += 2
    response = await node.send_token(
        wallet, test_address, recipient, 10000000, "adv4tnt"
    )

    assert_successful_broadcast(response)


async def test_order(node, test_order, test_order_id, wallet):
    placed = await node.place_order(wallet, test_order)

    assert_successful_broadcast(placed)

    wallet.sequence += 1
    canceled = await node.cancel_order(
        # May break potentially if 2 instances are using test account simultaneously.
        # `await node.get_account(test_address)` returns the wrong sequence (same as account.sequence) if called right after place order
        wallet,
        test_order_id,
        good_til_block_time=test_order.good_til_block_time,
    )

    assert_successful_broadcast(canceled)
