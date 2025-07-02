import asyncio
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from tests.conftest import TEST_ADDRESS


async def test_status():
    indexer = IndexerClient(TESTNET.rest_indexer)

    try:
        compliance_screen = await indexer.utility.compliance_screen(TEST_ADDRESS)
        print(f"compliance screen: {compliance_screen}")
        if compliance_screen is None:
            print("Compliance screen status is N/A")

    except Exception as e:
        print(f"Exception in compliance_screen: {e}")


asyncio.run(test_status())
