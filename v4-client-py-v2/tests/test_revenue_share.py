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


# @pytest.mark.asyncio
# async def test_set_order_router_revenue_share(node_client):
#     response = await node_client.set_order_router_revenue_share(
#         authority="authority", address=TEST_ADDRESS_2, share_ppm=500
#     )
#     assert response is not None
#     assert isinstance(response, revshare_tx_query.MsgSetOrderRouterRevShareResponse)


# @pytest.mark.asyncio
# async def test_set_market_mapper_revenue_share(node_client, test_address):
#     #
#     response = await node_client.set_market_mapper_revenue_share(
#         authority="authority",
#         address=test_address,
#         revenue_share_ppm=500,
#         valid_days=30,
#     )
#     assert response is not None
#     assert isinstance(
#         response, revshare_tx_query.MsgSetMarketMapperRevenueShareResponse
#     )
#
#
# @pytest.mark.asyncio
# async def test_set_market_mapper_revenue_share_details_for_market(
#     node_client, test_address
# ):
#     response = await node_client.set_market_mapper_revenue_share_details_for_market(
#         authority="authority", market_id=500, expiration_ts=30
#     )
#     assert response is not None
#     assert isinstance(
#         response, revshare_tx_query.MsgSetMarketMapperRevShareDetailsForMarketResponse
#     )
#
#
# @pytest.mark.asyncio
# async def test_update_unconditional_revenue_share_config(node_client, test_address):
#     response = await node_client.update_unconditional_revenue_share_config(
#         authority="authority", address=test_address, share_ppm=500
#     )
#     assert response is not None
#     assert isinstance(
#         response, revshare_tx_query.MsgUpdateUnconditionalRevShareConfigResponse
#     )
