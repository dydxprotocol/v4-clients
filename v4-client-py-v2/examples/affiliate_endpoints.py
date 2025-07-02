import asyncio

from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET
from tests.conftest import TEST_ADDRESS


async def test_affiliate():
    indexer = IndexerClient(TESTNET.rest_indexer)
    test_address = TEST_ADDRESS

    try:
        response = await indexer.affiliate.get_metadata(test_address)
        print(f"Referral code: {response['referralCode']}")
    except Exception as e:
        print(f"Error: {e}")

    try:
        response = await indexer.affiliate.get_address("NoisyPlumPOX")
        print(f"Address: {response['address']}")
    except Exception as e:
        print(f"Error: {e}")

    try:
        response = await indexer.affiliate.get_snapshot()
        print(f"snapshot: {response}")
    except Exception as e:
        print(f"Error: {e}")

    try:
        response = await indexer.affiliate.get_total_volume(test_address)
        print(f"Total volume: {response['totalVolume']}")
    except Exception as e:
        print(f"Error: {e}")


asyncio.run(test_affiliate())
