import pytest

from tests.conftest import retry_on_forbidden

@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_get_megavault_historical_pnl(indexer_rest_client):
    response = await indexer_rest_client.megavault.get_megavault_historical_pnl("hour")
    assert response["megavaultPnl"] is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_get_vault_historical_pnl(indexer_rest_client):
    response = await indexer_rest_client.megavault.get_vaults_historical_pnl("hour")
    assert response['vaultsPnl'] is not None

@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_get_megavault_positions(indexer_rest_client):
    response = await indexer_rest_client.megavault.get_megavault_positions()
    assert response['positions'] is not None
