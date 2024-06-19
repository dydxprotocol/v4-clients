"""Example for getting Indexer server time and height.

Usage: python -m examples.utility_endpoints
"""

from v4_client_py.clients import IndexerClient
from v4_client_py.clients.constants import Network

client = IndexerClient(
    config=Network.config_network().indexer_config,
)

# Get indexer server time
try:
    time_response = client.utility.get_time()
    print(time_response.data)
    time_iso = time_response.data["iso"]
    time_epoch = time_response.data["epoch"]
except:
    print("failed to get time")

# Get indexer height
try:
    height_response = client.utility.get_height()
    print(height_response.data)
    height = height_response.data["height"]
    height_time = height_response.data["time"]
except:
    print("failed to get height")
