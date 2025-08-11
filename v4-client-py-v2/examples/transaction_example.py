import asyncio

from dydx_v4_client.network import TESTNET
from dydx_v4_client.node.client import NodeClient
from dydx_v4_client.node.message import send_token
from dydx_v4_client.wallet import Wallet
from tests.conftest import TEST_ADDRESS, RECIPIENT, DYDX_TEST_MNEMONIC


async def transaction_examples():
    node = await NodeClient.connect(TESTNET.node)

    # Create a transaction
    send_token_msg = send_token(TEST_ADDRESS, RECIPIENT, 10000000, "adv4tnt")
    wallet = await Wallet.from_mnemonic(node, DYDX_TEST_MNEMONIC, TEST_ADDRESS)
    tx = await node.create_transaction(wallet, send_token_msg)
    print(tx)
    # broadcast it
    broadcast_response = await node.broadcast(tx)

    # Query a transaction
    await asyncio.sleep(5)
    query_response = await node.query_transaction(broadcast_response.tx_response.txhash)
    print(query_response)
    assert tx == query_response


asyncio.run(transaction_examples())
