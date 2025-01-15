import pytest

from dydx_v4_client.node.fee import Coin, Fee


@pytest.mark.asyncio
async def test_is_connected(noble_client):
    assert noble_client.is_connected


@pytest.mark.asyncio
async def test_get_address(noble_client):
    address = noble_client.wallet.address

    assert isinstance(address, str)
    assert len(address) == 43
    assert address.startswith("dydx")


@pytest.mark.asyncio
@pytest.mark.skip(reason="NobleClient testnet is not available")
async def test_get_account_balances(noble_client):
    balances = await noble_client.get_account_balances()

    assert isinstance(balances, list)
    assert len(balances) > 0
    assert all(isinstance(coin, Coin) for coin in balances)

    # Check if there's a balance for the native token (uusdc)
    uusdc_balance = next((coin for coin in balances if coin.denom == "uusdc"), None)
    assert uusdc_balance is not None
    assert int(uusdc_balance.amount) > 0


@pytest.mark.asyncio
@pytest.mark.skip(reason="NobleClient testnet is not available")
async def test_simulate_transfer_native_token(noble_client, test_address):
    amount = "1000000"  # 1 USDC (assuming 6 decimal places)
    recipient = "dydx15ndn9c895f8ntck25qughtuck9spv2d9svw5qx"

    fee = await noble_client.simulate_transfer_native_token(amount, recipient)

    assert isinstance(fee, Fee)
    assert len(fee.amount) > 0
    assert fee.gas_limit > 0

    fee_amount = sum(int(coin.amount) for coin in fee.amount)
    assert fee_amount < int(amount) * 0.01


@pytest.mark.asyncio
@pytest.mark.skip(reason="NobleClient testnet is not available")
async def test_transfer_native_token(noble_client):
    amount = "1000000"  # 1 USDC (6 decimal places)
    recipient = "dydx15ndn9c895f8ntck25qughtuck9spv2d9svw5qx"

    tx_hash = await noble_client.transfer_native(amount, recipient)

    assert isinstance(tx_hash, str)
    assert len(tx_hash) == 64
