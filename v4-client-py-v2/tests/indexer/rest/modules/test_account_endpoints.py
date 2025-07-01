import pytest

from dydx_v4_client.indexer.rest.constants import TradingRewardAggregationPeriod
from tests.conftest import retry_on_forbidden


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_subaccounts(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_subaccounts(test_address)
    subaccounts = response["subaccounts"]
    assert subaccounts is not None
    assert len(subaccounts) > 0
    subaccount0 = subaccounts[0]
    subaccount_number = subaccount0["subaccountNumber"]
    assert subaccount_number is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_parent_subaccounts(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_parent_subaccount(test_address, 0)
    assert response["subaccount"] is not None
    assert len(response["subaccount"]) > 0
    assert response["subaccount"]["address"] is not None
    assert response["subaccount"]["childSubaccounts"] is not None
    assert len(response["subaccount"]["childSubaccounts"]) > 0


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_subaccount_0(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_subaccount(test_address, 0)
    subaccount = response["subaccount"]
    assert subaccount is not None
    subaccount_number = subaccount["subaccountNumber"]
    assert subaccount_number is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
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
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_parent_subaccount_asset_positions(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_parent_subaccount_asset_positions(
        test_address, 0
    )
    assert response is not None
    positions = response["positions"]
    assert positions is not None
    if len(positions) > 0:
        position = positions[0]
        assert position is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
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
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_parent_subaccount_positions(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_parent_subaccount_positions(
        test_address, 0
    )
    assert response is not None
    positions = response["positions"]
    assert positions is not None
    if len(positions) > 0:
        position = positions[0]
        assert position is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
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
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_orders(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_subaccount_orders(test_address, 0)
    assert response is not None
    orders = response
    assert orders is not None
    if len(orders) > 0:
        order = orders[0]
        assert order is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_fills(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_subaccount_fills(test_address, 0)
    assert response is not None
    fills = response["fills"]
    assert fills is not None
    if len(fills) > 0:
        fill = fills[0]
        assert fill is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
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


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_historical_block_trading_rewards(indexer_rest_client, test_address):
    limit = 10
    response = await indexer_rest_client.account.get_historical_block_trading_rewards(
        test_address, limit
    )
    historical_rewards = response["rewards"]
    assert historical_rewards is not None
    assert isinstance(historical_rewards, list)
    assert len(historical_rewards) <= limit

    assert "createdAt" in historical_rewards[0]
    assert "createdAtHeight" in historical_rewards[0]
    assert "tradingReward" in historical_rewards[0]


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_historical_trading_rewards_aggregated(indexer_rest_client, test_address):
    period = TradingRewardAggregationPeriod.DAILY
    limit = 10
    response = (
        await indexer_rest_client.account.get_historical_trading_rewards_aggregated(
            test_address, period, limit
        )
    )
    aggregations = response["rewards"]
    assert aggregations is not None
    assert isinstance(aggregations, list)
    assert len(aggregations) <= limit

    for aggregation in aggregations:
        assert "period" in aggregation
        assert aggregation["period"] == period
        assert "tradingReward" in aggregation
        assert "startedAt" in aggregation
        assert "endedAt" in aggregation
        assert "startedAtHeight" in aggregation
        assert "endedAtHeight" in aggregation


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_get_transfer_between(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_transfer_between(
        test_address, 0, test_address, 1
    )
    assert response["transfersSubset"] is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_get_parent_transfers(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_parent_transfers(test_address, 0)
    assert response["transfers"] is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_list_parent_orders(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.list_parent_orders(test_address, 0)
    assert response is not None
    if len(response) > 0:
        assert response[0] is not None
        assert response[0]["id"] is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_parent_fills(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_parent_fills(test_address, 0)
    assert response is not None
    fills = response["fills"]
    assert fills is not None
    if len(fills) > 0:
        fill = fills[0]
        assert fill is not None
        assert fill["id"] is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_get_parent_historical_pnl(indexer_rest_client, test_address):
    response = await indexer_rest_client.account.get_parent_historical_pnls(
        test_address, 0
    )
    assert response is not None
    assert response["historicalPnl"] is not None
    if len(response["historicalPnl"]) > 0:
        assert response["historicalPnl"][0] is not None
        assert response["historicalPnl"][0]["equity"] is not None

@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1, skip=True)
async def test_search_traders(indexer_rest_client, test_address):
    address = "dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art"
    subaccount_id = "8586bcf6-1f58-5ec9-a0bc-e53db273e7b0"
    user_name = "NoisyPlumPOX"
    search_params = [address, user_name]
    for search_param in search_params:
        response = await indexer_rest_client.account.search_traders(search_param)
        assert response is not None
        assert response['result'] is not None
        assert response['result']['address'] is not None
        assert response['result']['address'] == address
        assert response['result']['subaccountId'] is not None
        assert response['result']['subaccountId'] == subaccount_id
        assert response['result']['username'] is not None
        assert response['result']['username'] == user_name
