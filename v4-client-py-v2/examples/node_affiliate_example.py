import asyncio

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.wallet import Wallet
from tests.conftest import (
    DYDX_TEST_MNEMONIC,
    TEST_ADDRESS,
    DYDX_TEST_MNEMONIC_2,
    TEST_ADDRESS_2,
)


async def affiliate_examples():
    node = await NodeClient.connect(TESTNET.node)
    referee_wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)
    affiliate_wallet = await Wallet.from_mnemonic(
        node, DYDX_TEST_MNEMONIC_2, TEST_ADDRESS_2
    )
    try:
        response = await node.register_affiliate(
            referee_wallet, referee_wallet.address, affiliate_wallet.address
        )
        print(response)
    except Exception as e:
        if "Affiliate already exists for referee" in str(e):
            print("Affiliate already exists for referee")
        else:
            print(f"Error: {e}")
    validators = await node.get_all_validators()
    wd_response = await node.withdraw_delegate_reward(
        referee_wallet, TEST_ADDRESS, validators.validators[0].operator_address
    )
    print(f"Withdraw delegate reward: {wd_response}")
    await asyncio.sleep(5)
    delegate_response = await node.delegate(
        referee_wallet,
        TEST_ADDRESS,
        validators.validators[-1].operator_address,
        100000,
        "adv4tnt",
    )
    print(f"Delegate response: {delegate_response}")
    await asyncio.sleep(5)
    undelegate_response = await node.undelegate(
        referee_wallet,
        TEST_ADDRESS,
        validators.validators[-1].operator_address,
        100000,
        "adv4tnt",
    )
    print(f"Undelegate response: {undelegate_response}")


asyncio.run(affiliate_examples())
