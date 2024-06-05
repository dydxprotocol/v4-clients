import pytest

from tests.conftest import retry_on_forbidden

MARKET_BTC_USD: str = "BTC-USD"


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_markets(indexer_rest_client):
    response = await indexer_rest_client.markets.get_perpetual_markets()
    btc = response["markets"][MARKET_BTC_USD]
    status = btc["status"]
    assert status == "ACTIVE"


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_btc_market(indexer_rest_client):
    response = await indexer_rest_client.markets.get_perpetual_markets(MARKET_BTC_USD)
    btc = response["markets"][MARKET_BTC_USD]
    status = btc["status"]
    assert status == "ACTIVE"


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_btc_trades(indexer_rest_client):
    response = await indexer_rest_client.markets.get_perpetual_market_trades(
        MARKET_BTC_USD
    )
    trades = response["trades"]
    assert trades is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_btc_orderbook(indexer_rest_client):
    response = await indexer_rest_client.markets.get_perpetual_market_orderbook(
        MARKET_BTC_USD
    )
    asks = response["asks"]
    bids = response["bids"]
    assert asks is not None
    assert bids is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_btc_candles(indexer_rest_client):
    response = await indexer_rest_client.markets.get_perpetual_market_candles(
        MARKET_BTC_USD, "1MIN"
    )
    candles = response["candles"]
    assert candles is not None


@pytest.mark.asyncio
@retry_on_forbidden(max_retries=3, delay=1)
async def test_btc_historical_funding(indexer_rest_client):
    response = (
        await indexer_rest_client.markets.get_perpetual_market_historical_funding(
            MARKET_BTC_USD
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
    btc_sparklines = response[MARKET_BTC_USD]
    assert btc_sparklines is not None
