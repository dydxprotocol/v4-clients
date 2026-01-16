import asyncio
import random

from dydx_v4_client import MAX_CLIENT_ID, OrderFlags
from dydx_v4_client.indexer.rest.constants import OrderType
from dydx_v4_client.node.market import Market
from tests.conftest import TEST_ADDRESS_2, TEST_ADDRESS
from v4_proto.dydxprotocol.clob.order_pb2 import Order
from v4_proto.dydxprotocol.revshare import query_pb2 as revshare_query
import pytest


async def test_place_order_with_order_router_address(
    node_client, indexer_rest_client, test_order_id, test_address, wallet
):
    MARKET_ID = "ETH-USD"
    market = Market(
        (await indexer_rest_client.markets.get_perpetual_markets(MARKET_ID))["markets"][
            MARKET_ID
        ]
    )

    assert market is not None
    assert market.market is not None
    assert len(market.market) > 0

    order_id = market.order_id(
        TEST_ADDRESS, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
    )

    current_block = await node_client.latest_block_height()

    new_order = market.order(
        order_id=order_id,
        order_type=OrderType.MARKET,
        side=Order.Side.SIDE_SELL,
        size=0.0001,
        price=0,  # Recommend set to oracle price - 5% or lower for SELL, oracle price + 5% for BUY
        time_in_force=Order.TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        reduce_only=False,
        good_til_block=current_block + 10,
        order_router_address=TEST_ADDRESS_2,
    )

    transaction = await node_client.place_order(
        wallet=wallet,
        order=new_order,
    )

    await asyncio.sleep(5)

    fills = await indexer_rest_client.account.get_subaccount_fills(
        address=TEST_ADDRESS, subaccount_number=0, limit=1
    )

    assert fills is not None
    assert fills["fills"][0]["orderRouterAddress"] == TEST_ADDRESS_2


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
