import pytest

from tests.conftest import retry_on_forbidden, TEST_MARKET_ID


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_markets(indexer_rest_client):
    response = await indexer_rest_client.markets.get_perpetual_markets()
    btc = response["markets"][TEST_MARKET_ID]
    status = btc["status"]
    assert status == "ACTIVE"


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_btc_market(indexer_rest_client):
    response = await indexer_rest_client.markets.get_perpetual_markets(TEST_MARKET_ID)
    btc = response["markets"][TEST_MARKET_ID]
    status = btc["status"]
    assert status == "ACTIVE"


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_btc_trades(indexer_rest_client):
    response = await indexer_rest_client.markets.get_perpetual_market_trades(
        TEST_MARKET_ID
    )
    trades = response["trades"]
    assert trades is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_btc_orderbook(indexer_rest_client):
    response = await indexer_rest_client.markets.get_perpetual_market_orderbook(
        TEST_MARKET_ID
    )
    asks = response["asks"]
    bids = response["bids"]
    assert asks is not None
    assert bids is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_btc_candles(indexer_rest_client):
    response = await indexer_rest_client.markets.get_perpetual_market_candles(
        TEST_MARKET_ID, "1MIN"
    )
    candles = response["candles"]
    assert candles is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_btc_historical_funding(indexer_rest_client):
    response = (
        await indexer_rest_client.markets.get_perpetual_market_historical_funding(
            TEST_MARKET_ID
        )
    )
    assert response is not None
    historical_funding = response["historicalFunding"]
    assert historical_funding is not None
    if len(historical_funding) > 0:
        historical_funding0 = historical_funding[0]
        assert historical_funding0 is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_sparklines(indexer_rest_client):
    response = await indexer_rest_client.markets.get_perpetual_market_sparklines()
    btc_sparklines = response[TEST_MARKET_ID]
    assert btc_sparklines is not None
