import httpx
import pytest


@pytest.mark.asyncio
async def test_fill(test_address, faucet_client):
    try:
        response = await faucet_client.fill(test_address, 0, 2000)
        assert response.status_code == 202
    except httpx.HTTPStatusError as e:
        assert e.response.status_code == 429


@pytest.mark.asyncio
async def test_fill_native(test_address, faucet_client):
    try:
        response = await faucet_client.fill_native(test_address)
        assert response.status_code == 202
    except httpx.HTTPStatusError as e:
        assert e.response.status_code == 429
