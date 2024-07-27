import asyncio

from dydx_v4_client.indexer.candles_resolution import CandlesResolution
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET

# ------------ Markets ------------
MARKET_BTC_USD = "BTC-USD"


async def test():
    client = IndexerClient(TESTNET.rest_indexer)

    # Get perp markets
    try:
        response = await client.markets.get_perpetual_markets()
        print(response)
        print("markets")
        btc_market = response["markets"][MARKET_BTC_USD]
        btc_market_status = btc_market["status"]
        print(btc_market_status)
    except Exception as e:
        print(e)

    try:
        response = await client.markets.get_perpetual_markets(market=MARKET_BTC_USD)
        print(response)
        print("markets")
        btc_market = response["markets"][MARKET_BTC_USD]
        btc_market_status = btc_market["status"]
        print(btc_market_status)
    except Exception as e:
        print(e)

    # Get sparklines
    try:
        response = await client.markets.get_perpetual_market_sparklines()
        print(response)
        print("sparklines")
        btc_sparklines = response[MARKET_BTC_USD]
        print(btc_sparklines)
    except Exception as e:
        print(e)

    # Get perp market trades
    try:
        response = await client.markets.get_perpetual_market_trades(
            market=MARKET_BTC_USD
        )
        print(response)
        print("trades")
        trades = response["trades"]
        print(trades)
    except Exception as e:
        print(e)

    # Get perp market orderbook
    try:
        response = await client.markets.get_perpetual_market_orderbook(
            market=MARKET_BTC_USD
        )
        print(response)
        print("orderbook")
        asks = response["asks"]
        bids = response["bids"]
        if asks:
            asks0 = asks[0]
            asks0_price = asks0["price"]
            asks0_size = asks0["size"]
            print(asks0_price)
            print(asks0_size)
        if bids:
            bids0 = bids[0]
            bids0_price = bids0["price"]
            bids0_size = bids0["size"]
            print(bids0_price)
            print(bids0_size)
        trades = response["trades"]
        print(trades)
    except Exception as e:
        print(e)

    # Get perp market candles
    try:
        response = await client.markets.get_perpetual_market_candles(
            market=MARKET_BTC_USD, resolution=CandlesResolution.ONE_MINUTE
        )
        print(response)
        print("candles")
        candles = response["candles"]
        if candles:
            candles0 = candles[0]
            started_at = candles0["startedAt"]
            low = candles0["low"]
            high = candles0["high"]
            open_ = candles0["open"]
            close = candles0["close"]
            base_token_volume = candles0["baseTokenVolume"]
            usd_volume = candles0["usdVolume"]
            trades = candles0["trades"]
            print(started_at)
            print(low)
            print(high)
            print(open_)
            print(close)
            print(base_token_volume)
            print(usd_volume)
            print(trades)
    except Exception as e:
        print(e)

    # Get perp market historical funding rates
    try:
        response = await client.markets.get_perpetual_market_historical_funding(
            market=MARKET_BTC_USD
        )
        print(response)
        print("historical funding")
        historical_funding = response["historicalFunding"]
        if historical_funding:
            historical_funding0 = historical_funding[0]
            print(historical_funding0)
    except Exception as e:
        print(e)


async def main():
    await test()


asyncio.run(main())
