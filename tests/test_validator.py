from v4_proto.cosmos.bank.v1beta1 import query_pb2 as bank_query


async def test_get_account_balances(validator, test_address):
    result = await validator.get_account_balances(test_address)
    assert type(result) == bank_query.QueryAllBalancesResponse
