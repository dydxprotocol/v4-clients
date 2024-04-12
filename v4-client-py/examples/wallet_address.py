from v4_client_py.chain.aerial.wallet import LocalWallet
from v4_client_py.clients.constants import BECH32_PREFIX

from tests.constants import DYDX_TEST_ADDRESS, DYDX_TEST_PRIVATE_KEY, DYDX_TEST_MNEMONIC

# We recommend using comspy to derive address from mnemonic
wallet = LocalWallet.from_mnemonic(mnemonic=DYDX_TEST_MNEMONIC, prefix=BECH32_PREFIX)
private_key = wallet.signer().private_key_hex
assert private_key == DYDX_TEST_PRIVATE_KEY

public_key = wallet.public_key().public_key_hex
address = wallet.address()
print(f"public key:{public_key}, address:{address}")

assert address == DYDX_TEST_ADDRESS
