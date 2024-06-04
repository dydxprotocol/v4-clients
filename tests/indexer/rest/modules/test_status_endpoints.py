import pytest

from tests.conftest import retry_on_forbidden


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_get_time(indexer_rest_client):
    response = await indexer_rest_client.utility.get_time()
    iso = response["iso"]
    assert iso is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_get_height(indexer_rest_client):
    response = await indexer_rest_client.utility.get_height()
    height = response["height"]
    time = response["time"]
    assert height is not None
    assert time is not None


@pytest.mark.asyncio
@pytest.mark.skip(reason="Endpoint may have changed")
async def test_screen_address(indexer_rest_client, test_address):
    response = await indexer_rest_client.utility.screen(test_address)
    restricted = response.get("restricted")
    assert restricted is not None
