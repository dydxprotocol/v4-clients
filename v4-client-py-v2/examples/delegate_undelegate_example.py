import asyncio

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.wallet import Wallet
from tests.conftest import DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3


async def delegate_undelegate_example():
    node = await NodeClient.connect(TESTNET.node)
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC_3, TEST_ADDRESS_3)

    validator = await node.get_all_validators()
    assert validator is not None
    assert len(validator.validators) > 0
    undelgations = await node.get_delegator_unbonding_delegations(TEST_ADDRESS_3)
    assert undelgations is not None
    validator_to_num_of_undelegations = {
        v.operator_address: 0 for v in validator.validators
    }
    for u in undelgations.unbonding_responses:
        validator_to_num_of_undelegations[u.validator_address] += 1
    validator_address_with_least_undelegations = min(
        validator_to_num_of_undelegations.items(), key=lambda item: item[1]
    )[0]

    delegate_response = await node.delegate(
        wallet,
        TEST_ADDRESS_3,
        validator_address_with_least_undelegations,
        100000,
        "adv4tnt",
    )
    print(f"Delegation response: {delegate_response}")
    await asyncio.sleep(5)
    await node.query_transaction(delegate_response.tx_response.txhash)

    undelegate_response = await node.undelegate(
        wallet,
        TEST_ADDRESS_3,
        validator_address_with_least_undelegations,
        100000,
        "adv4tnt",
    )
    print(f"Undelegate response: {undelegate_response}")


asyncio.run(delegate_undelegate_example())
