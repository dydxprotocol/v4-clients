from tests.conftest import TEST_ADDRESS_2
from v4_proto.dydxprotocol.revshare import query_pb2 as revshare_query
import pytest


@pytest.mark.asyncio
async def test_get_market_mapper_revenue_share_param(node_client):
    response = await node_client.get_market_mapper_revenue_share_param()
    assert response is not None
    assert isinstance(
        response, revshare_query.QueryMarketMapperRevenueShareParamsResponse
    )


@pytest.mark.asyncio
async def test_get_market_mapper_revenue_share_details(node_client):
    response = await node_client.get_market_mapper_revenue_share_details(1)
    assert response is not None
    assert isinstance(response, revshare_query.QueryMarketMapperRevShareDetailsResponse)


@pytest.mark.asyncio
async def test_get_unconditional_revenue_sharing_config(node_client):
    response = await node_client.get_unconditional_revenue_sharing_config()
    assert response is not None
    assert isinstance(response, revshare_query.QueryUnconditionalRevShareConfigResponse)


@pytest.mark.asyncio
async def test_get_order_router_revenue_share(node_client):
    response = await node_client.get_order_router_revenue_share(address=TEST_ADDRESS_2)
    assert response is not None
    assert isinstance(response, revshare_query.QueryOrderRouterRevShareResponse)
