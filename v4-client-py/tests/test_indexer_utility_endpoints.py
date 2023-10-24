
from v4_client_py.clients import IndexerClient, Subaccount
from v4_client_py.clients.constants import Network

from tests.constants import DYDX_TEST_MNEMONIC

subaccount = Subaccount.from_mnemonic(DYDX_TEST_MNEMONIC)
address = subaccount.address

client = IndexerClient(
    config=Network.testnet().indexer_config,
)

def test_get_time():
    try:
        time_response = client.utility.get_time()
        print(time_response.data)
        time_iso = time_response.data['iso']
        time_epoch = time_response.data['epoch']
        assert time_iso != None
        assert time_epoch != None
    except:
        print('failed to get time')
        assert False
        
def test_get_height():
    # Get indexer height
    try:
        height_response = client.utility.get_height()
        print(height_response.data)
        height = height_response.data['height']
        height_time = height_response.data['time']
        assert height != None
        assert height_time != None
    except:
        print('failed to get height')
        assert False

def test_screen():
    try:
        screen_response = client.utility.screen(address)
        print(screen_response.data)
        restricted = screen_response.data['restricted']
        assert restricted != None
    except:
        print('failed to screen address')
        assert False

