# Getting Price Quotes and Market Data

This guide demonstrates how to fetch price quotes and other market data using the dYdX Python SDK.

## Setting Up

First, import the necessary modules and set up the client:

```python
import asyncio
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET

async def setup_client():
    return IndexerClient(TESTNET.rest_indexer)

client = asyncio.run(setup_client())
```


### Getting Market Data

To get information about all markets:
```python
async def get_all_markets():
    response = await client.markets.get_perpetual_markets()
    print(response)

asyncio.run(get_all_markets())
```

### Getting a Specific Market's Data

To get data for a specific market (e.g., BTC-USD):
```python
MARKET_BTC_USD = "BTC-USD"

async def get_specific_market():
    response = await client.markets.get_perpetual_markets(market=MARKET_BTC_USD)
    btc_market = response["markets"][MARKET_BTC_USD]
    btc_market_status = btc_market["status"]
    print(btc_market_status)

asyncio.run(get_specific_market())
```

### Getting orderbook

To get the current orderbook for a market:
```python
async def get_orderbook():
    response = await client.markets.get_perpetual_market_orderbook(market=MARKET_BTC_USD)
    asks = response["asks"]
    bids = response["bids"]
    if asks:
        asks0 = asks[0]
        asks0_price = asks0["price"]
        asks0_size = asks0["size"]
        print(f"Best ask: Price {asks0_price}, Size {asks0_size}")
    if bids:
        bids0 = bids[0]
        bids0_price = bids0["price"]
        bids0_size = bids0["size"]
        print(f"Best bid: Price {bids0_price}, Size {bids0_size}")

asyncio.run(get_orderbook())
```

### Getting Candles (Price History)

To get historical price data:
```python
async def get_candles():
    response = await client.markets.get_perpetual_market_candles(
        market=MARKET_BTC_USD, resolution="1MIN"
    )
    candles = response["candles"]
    if candles:
        latest_candle = candles[0]
        print(f"Latest candle: Open {latest_candle['open']}, Close {latest_candle['close']}, High {latest_candle['high']}, Low {latest_candle['low']}")

asyncio.run(get_candles())
```
These methods provide various ways to get price quotes and market data.

Continue reading how to [place orders](./placing_orders.md) using the dYdX Python SDK.

