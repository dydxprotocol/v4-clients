import pytest


@pytest.mark.asyncio
async def test_fill(rest_client, test_address):
    response = await rest_client.fill(test_address, 0, 2000)
    assert response.status_code == 202
