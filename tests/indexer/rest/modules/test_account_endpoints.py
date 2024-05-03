import pytest


@pytest.mark.asyncio
async def test_subaccounts(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_subaccounts(test_address)
    subaccounts = response["subaccounts"]
    assert subaccounts is not None
    assert len(subaccounts) > 0
    subaccount0 = subaccounts[0]
    subaccount_number = subaccount0["subaccountNumber"]
    assert subaccount_number is not None


@pytest.mark.asyncio
async def test_subaccount_0(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_subaccount(test_address, 0)
    subaccount = response["subaccount"]
    assert subaccount is not None
    subaccount_number = subaccount["subaccountNumber"]
    assert subaccount_number is not None


@pytest.mark.asyncio
async def test_asset_positions(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_subaccount_asset_positions(
        test_address, 0
    )
    assert response is not None
    positions = response["positions"]
    assert positions is not None
    if len(positions) > 0:
        position = positions[0]
        assert position is not None


@pytest.mark.asyncio
async def test_perpetual_positions(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_subaccount_perpetual_positions(
        test_address, 0
    )
    assert response is not None
    positions = response["positions"]
    assert positions is not None
    if len(positions) > 0:
        position = positions[0]
        assert position is not None


@pytest.mark.asyncio
async def test_transfers(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_subaccount_transfers(
        test_address, 0
    )
    assert response is not None
    transfers = response["transfers"]
    assert transfers is not None
    if len(transfers) > 0:
        transfer = transfers[0]
        assert transfer is not None


@pytest.mark.asyncio
async def test_orders(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_subaccount_orders(test_address, 0)
    assert response is not None
    orders = response
    assert orders is not None
    if len(orders) > 0:
        order = orders[0]
        assert order is not None


@pytest.mark.asyncio
async def test_fills(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_subaccount_fills(test_address, 0)
    assert response is not None
    fills = response["fills"]
    assert fills is not None
    if len(fills) > 0:
        fill = fills[0]
        assert fill is not None


@pytest.mark.asyncio
async def test_historical_pnl(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_subaccount_historical_pnls(
        test_address, 0
    )
    assert response is not None
    historical_pnl = response["historicalPnl"]
    assert historical_pnl is not None
    if len(historical_pnl) > 0:
        historical_pnl0 = historical_pnl[0]
        assert historical_pnl0 is not None
