import asyncio

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from tests.conftest import TEST_ADDRESS


async def test():
    node_client = await NodeClient.connect(TESTNET.node)

    try:
        response = await node_client.get_market_mapper_revenue_share_param()
        print(response)
    except Exception as e:
        print(f"Error during fetching get_market_mapper_revenue_share_param: {e}")

    try:
        response = await node_client.get_market_mapper_revenue_share_details(1)
        print(response)
    except Exception as e:
        print(f"Error during fetching get_market_mapper_revenue_share_details: {e}")

    try:
        response = await node_client.get_unconditional_revenue_sharing_config()
        print(response)
    except Exception as e:
        print(f"Error during fetching get_unconditional_revenue_sharing_config: {e}")

    try:
        response = await node_client.get_order_router_revenue_share(TEST_ADDRESS)
        print(response)
    except Exception as e:
        print(f"Error during fetching get_order_router_revenue_share: {e}")


asyncio.run(test())
