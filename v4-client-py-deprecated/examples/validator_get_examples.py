import asyncio
import logging

from v4_client_py.clients.dydx_validator_client import ValidatorClient
from v4_client_py.clients.constants import Network

from tests.constants import DYDX_TEST_ADDRESS


async def main() -> None:
    network = Network.config_network()
    client = ValidatorClient(network.validator_config)
    address = DYDX_TEST_ADDRESS
    try:
        acc = client.get.account(address=address)
        print("account:")
        print(acc)
    except Exception as e:
        print("failed to get account")
        print(e)

    try:
        bank_balances = client.get.bank_balances(address)
        print("bank balances:")
        print(bank_balances)
    except Exception as e:
        print("failed to get bank balances")
        print(e)

    try:
        bank_balance = client.get.bank_balance(
            address, "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5"
        )
        print("bank balance:")
        print(bank_balance)
    except Exception as e:
        print("failed to get bank balances")
        print(e)

    try:
        all_subaccounts = client.get.subaccounts()
        print("subaccounts:")
        print(all_subaccounts)
    except Exception as e:
        print("failed to get all subaccounts")
        print(e)

    try:
        subaccount = client.get.subaccount(address, 0)
        print("subaccount:")
        print(subaccount)
    except Exception as e:
        print("failed to get subaccount")
        print(e)

    try:
        clob_pairs = client.get.clob_pairs()
        print("clob pairs:")
        print(clob_pairs)
    except Exception as e:
        print("failed to get all clob pairs")
        print(e)

    try:
        clob_pair = client.get.clob_pair(1)
        print("clob pair:")
        print(clob_pair)
    except Exception as e:
        print("failed to get clob pair")
        print(e)

    try:
        prices = client.get.prices()
        print("prices:")
        print(prices)
    except Exception as e:
        print("failed to get all prices")
        print(e)

    try:
        price = client.get.price(1)
        print("price:")
        print(price)
    except Exception as e:
        print("failed to get price")
        print(e)

    try:
        config = client.get.equity_tier_limit_config()
        print("equity_tier_limit_configuration:")
        print(config)
    except Exception as e:
        print("failed to get equity_tier_limit_configuration")
        print(e)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.get_event_loop().run_until_complete(main())
