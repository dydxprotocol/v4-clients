import asyncio

import pytest

from dydx_v4_client.node.subaccount import SubaccountInfo


@pytest.mark.asyncio
async def test_deposit(node_client, megavault, wallet, test_address):
    subaccount = SubaccountInfo.for_wallet(wallet, 0)
    response = await megavault.deposit(subaccount, test_address, 0, 1)
    assert response is not None
    assert response.tx_response is not None
    await asyncio.sleep(5)
    query_response = await node_client.query_transaction(response.tx_response.txhash)
    assert query_response is not None


@pytest.mark.asyncio
async def test_withdraw(node_client, megavault, wallet, test_address):
    subaccount = SubaccountInfo.for_wallet(wallet, 0)
    response = await megavault.withdraw(subaccount, test_address, 0, 0, 1)
    assert response is not None
    assert response.tx_response is not None
    await asyncio.sleep(5)
    query_response = await node_client.query_transaction(response.tx_response.txhash)
    assert query_response is not None


@pytest.mark.asyncio
async def test_get_owner_shares(megavault, test_address):
    response = await megavault.get_owner_shares(test_address)
    assert response is not None
    assert response.address == test_address


@pytest.mark.asyncio
async def test_get_withdrawal_info(megavault):
    response = await megavault.get_withdrawal_info(1)
    assert response is not None
    assert response.shares_to_withdraw is not None
    assert len(response.shares_to_withdraw.num_shares) > 1
    assert (
        int.from_bytes(
            response.shares_to_withdraw.num_shares[1:], byteorder="big", signed=False
        )
        == 1
    )
