import v4_proto
from v4_proto.cosmos.bank.v1beta1 import query_pb2 as bank_query


def is_successful(response):
    return response.tx_response.code == 0


async def test_get_account_balances(node, test_address):
    result = await node.get_account_balances(test_address)
    assert type(result) == bank_query.QueryAllBalancesResponse


async def test_place_order(node, test_order, account, private_key):
    result = await node.place_order(
        private_key,
        test_order,
        account.account_number,
        sequence=account.sequence,
    )

    assert type(result) == v4_proto.cosmos.tx.v1beta1.service_pb2.BroadcastTxResponse
    assert is_successful(result)
