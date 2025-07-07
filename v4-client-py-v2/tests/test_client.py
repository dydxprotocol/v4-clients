import pytest

from dydx_v4_client.node.message import send_token


@pytest.mark.asyncio
async def test_create_transaction(node_client, test_address, wallet, recipient):
    send_token_msg = send_token(test_address, recipient, 10000000, "adv4tnt")
    tx = await node_client.create_transaction(wallet, send_token_msg)
    assert tx is not None
    assert tx.body is not None
    assert tx.auth_info is not None
    assert tx.signatures is not None
