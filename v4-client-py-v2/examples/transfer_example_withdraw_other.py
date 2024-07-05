import asyncio
from functools import partial

from dydx_v4_client import NodeClient
from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.message import subaccount, withdraw
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC, TEST_ADDRESS


async def test():
    node = await NodeClient.connect(TESTNET.node)

    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)

    message = partial(withdraw, subaccount(TEST_ADDRESS, 0), TEST_ADDRESS, 0)
    amount = 100_000_000

    simulated = node.builder.build(wallet, message(amount))

    simulation = await node.simulate(simulated)
    print("**Simulate**")
    print(simulation)

    fee = node.calculate_fee(simulation.gas_info.gas_used)
    print("**Total Fee**")
    print(fee)

    response = await node.broadcast(
        node.build(wallet, message(amount - fee.amount[0].amount), fee)
    )
    print("**Withdraw and Send**")
    print(response)


asyncio.run(test())
