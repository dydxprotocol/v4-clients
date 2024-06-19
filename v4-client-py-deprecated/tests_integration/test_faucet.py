
from v4_client_py.clients import FaucetClient, Subaccount
from v4_client_py.clients.constants import Network

from tests.constants import DYDX_TEST_MNEMONIC

client = FaucetClient(
    host=Network.testnet().faucet_endpoint,
)

subaccount = Subaccount.from_mnemonic(DYDX_TEST_MNEMONIC)
address = subaccount.address


def test_faucet():
    # Fill subaccount with 2000 USDC
    faucet_response = client.fill(address, 0, 2000)
    print(faucet_response.data)
    faucet_http_code = faucet_response.status_code
    print(faucet_http_code)
    assert faucet_http_code >= 200 and faucet_http_code < 300

def test_native_faucet():
    # Fill wallet with DV4TNT
    faucet_response = client.fill_native(address)
    print(faucet_response.data)
    faucet_http_code = faucet_response.status_code
    print(faucet_http_code)
    assert faucet_http_code >= 200 and faucet_http_code < 300

