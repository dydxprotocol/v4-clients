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
    all_bank_balances = await client.get.bank_balances(address=address)
    print(all_bank_balances)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.get_event_loop().run_until_complete(main())
