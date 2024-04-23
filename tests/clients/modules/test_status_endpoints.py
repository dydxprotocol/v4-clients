import pytest

from tests.conftest import DYDX_TEST_ADDRESS


@pytest.mark.asyncio
async def test_get_time(indexer_client):
    response = await indexer_client.utility.get_time()
    iso = response["iso"]
    assert iso is not None


@pytest.mark.asyncio
async def test_get_height(indexer_client):
    response = await indexer_client.utility.get_height()
    height = response["height"]
    time = response["time"]
    assert height is not None
    assert time is not None


@pytest.mark.asyncio
async def test_screen_address(indexer_client):
    response = await indexer_client.utility.screen(DYDX_TEST_ADDRESS)
    restricted = response.get("restricted")
    assert restricted is not None
