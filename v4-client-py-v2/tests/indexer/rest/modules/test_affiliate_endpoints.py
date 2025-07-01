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

@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_get_snapshot(indexer_rest_client, test_address):
    addresses =[None, "dydx1s49hc95ggnl6fcq328rw35qmfx05a8zllp9wza", "dydx1s49hc95ggnl6fcq328rw35qmfx05a8zllp9wza,dydx13hmhafzju4r3z2pjtqzezha90fvy3ljhqyq49h"]
    sort_by_affiliate_earnings=[None, True]
    limits = [10, 20]
    for address in addresses:
        for sort_by_affiliate_earning in sort_by_affiliate_earnings:
            for limit in limits:
                response = await indexer_rest_client.affiliate.get_snapshot(address, sort_by_affiliate_earning, limit)
                assert response is not None
                assert response['affiliateList'] is not None
                assert len(response['affiliateList']) <= limit



