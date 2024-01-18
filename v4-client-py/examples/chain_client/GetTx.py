import asyncio
import logging

from v4_client_py.clients import ValidatorClient, Subaccount
from v4_client_py.clients.constants import Network

from tests.constants import DYDX_TEST_MNEMONIC

client = ValidatorClient(
    config=Network.testnet().validator_config,
)
subaccount = Subaccount.from_mnemonic(DYDX_TEST_MNEMONIC)
address = subaccount.address


async def main() -> None:
    tx_hash = "8247FEF19BB29BD93922803E9919620252DBC0BA4BE7D96E212D8F5EBC122B48"
    tx_logs = await client.get.tx(tx_hash=tx_hash)
    print(tx_logs)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.get_event_loop().run_until_complete(main())
