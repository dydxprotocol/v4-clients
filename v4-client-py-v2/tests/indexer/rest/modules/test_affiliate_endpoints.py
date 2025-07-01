import pytest

from tests.conftest import retry_on_forbidden


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_get_metadata(indexer_rest_client, test_address):
    response = await indexer_rest_client.affiliate.get_metadata(test_address)
    assert response is not None
    assert response['referralCode'] is not None
    assert response['referralCode'] == 'NoisyPlumPOX'

@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_get_address(indexer_rest_client, test_address):
    response = await indexer_rest_client.affiliate.get_address("NoisyPlumPOX")
    assert response is not None
    assert response['address'] is not None
    assert response['address'] == test_address



