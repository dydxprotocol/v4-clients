import v4_proto
from v4_proto.cosmos.bank.v1beta1 import query_pb2 as bank_query


def is_successful(response):
    return response.tx_response.code == 0


def assert_successful_broadcast(response):
    assert type(response) == v4_proto.cosmos.tx.v1beta1.service_pb2.BroadcastTxResponse
    assert is_successful(response)


async def test_get_account_balances(node_client, test_address):
    result = await node_client.get_account_balances(test_address)
    assert type(result) == bank_query.QueryAllBalancesResponse


async def test_transfer(
    node,
    private_key,
    test_address,
    account,
    recipient,
):
    response = await node.broadcast().transfer(
        private_key,
        account.account_number,
        account.sequence,
        test_address,
        0,
        recipient,
        1,
        asset_id=0,
        amount=1,
    )

    assert_successful_broadcast(response)


async def test_deposit(node, private_key, test_address, account):
    response = await node.broadcast().deposit(
        private_key,
        account.account_number,
        account.sequence,
        test_address,
        test_address,
        0,
        asset_id=0,
        quantums=10000000,
    )
    print(response)

    assert_successful_broadcast(response)


async def test_withdraw(node, private_key, test_address, account):
    response = await node.broadcast().withdraw(
        private_key,
        account.account_number,
        account.sequence + 1,
        test_address,
        0,
        test_address,
        asset_id=0,
        quantums=10000000,
    )
    print(response)

    assert_successful_broadcast(response)


async def test_send_token(node, private_key, test_address, account, recipient, denom):
    response = await node.broadcast().send_token(
        private_key,
        account.account_number,
        account.sequence + 2,
        test_address,
        recipient,
        quantums=10000000,
    )
    print(response)

    assert_successful_broadcast(response)


async def test_order(node, test_order, test_order_id, account, private_key):
    placed = await node.broadcast().place_order(
async def test_order(node_client, test_order, test_order_id, account, private_key):
    placed = await node_client.broadcast().place_order(
        private_key,
        test_order,
        account.account_number,
        sequence=account.sequence + 3,
    )

    assert_successful_broadcast(placed)

    canceled = await node_client.broadcast().cancel_order(
        private_key,
        account.account_number,
        # May break potentially if 2 instances are using test account simultaneously.
        # `await node.get_account(test_address)` returns the wrong sequence (same as account.sequence) if called right after place order
        account.sequence + 4,
        test_order_id,
        good_til_block_time=test_order.good_til_block_time,
    )

    assert_successful_broadcast(canceled)
