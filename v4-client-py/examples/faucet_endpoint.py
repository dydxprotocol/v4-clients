"""Example for depositing with faucet.

Usage: python -m examples.faucet_endpoint
"""
from v4_client_py.clients import FaucetClient, Subaccount
from v4_client_py.clients.constants import Network

from tests.constants import DYDX_TEST_MNEMONIC

client = FaucetClient(
    host=Network.config_network().faucet_endpoint,
)

subaccount = Subaccount.from_mnemonic(DYDX_TEST_MNEMONIC)
address = subaccount.address


# fill subaccount with 2000 ETH
faucet_response = client.fill(address, 0, 2000)
print(faucet_response.data)
faucet_http_code = faucet_response.status_code
print(faucet_http_code)
