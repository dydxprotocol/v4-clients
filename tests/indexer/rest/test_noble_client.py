import pytest
from v4_proto.cosmos.base.abci.v1beta1.abci_pb2 import TxResponse


@pytest.mark.asyncio
async def test_is_connected(noble_client):
    assert noble_client.is_connected


@pytest.mark.asyncio
@pytest.mark.skip(reason="This test is not implemented")
async def test_ibc_transfer(node_client, noble_client):
    message = {
        "source_port": "transfer",
        "source_channel": "channel-0",
        "token": {"denom": "usdc", "amount": "1000"},
        "sender": noble_client.wallet.get_verifying_key().to_string(),
        "receiver": "cosmos1...",
        "timeout_height": 0,
        "timeout_timestamp": 0,
    }
    tx_response = await node_client.ibc_transfer([message])
    assert isinstance(tx_response, TxResponse)
    assert tx_response.code == 0


@pytest.mark.asyncio
@pytest.mark.skip(reason="This test is not implemented")
async def test_send(noble_client):
    message = {
        "depositor": noble_client.wallet.get_verifying_key().to_string(),
        "amount": {"denom": "usdc", "amount": "1000"},
    }
    tx_response = await noble_client.send([message])
    assert isinstance(tx_response, TxResponse)
    assert tx_response.code == 0


@pytest.mark.asyncio
@pytest.mark.skip(reason="This test is not implemented")
async def test_simulate_transaction(noble_client, node_client):
    message = {
        "depositor": noble_client.wallet.get_verifying_key().to_string(),
        "amount": {"denom": "usdc", "amount": "1000"},
    }
    fee = await noble_client.simulate_transaction([message])
    assert isinstance(fee, dict)
    assert fee["gas_limit"] > 0
    assert len(fee["amount"]) == 1
    assert "usdc" in fee["amount"][0]["denom"]
