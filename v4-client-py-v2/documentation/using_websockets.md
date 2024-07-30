# WebSocket Guide

This guide demonstrates how to use WebSockets with the dYdX Python SDK, including a simple subscription example and a more advanced basic adder example 

## Setting Up

The websocket indexer allows to subscribe to channels to obtain live updates:
First, import the necessary modules:

```python
import asyncio
from dydx_v4_client.indexer.socket.websocket import IndexerSocket, CandlesResolution
from dydx_v4_client.network import TESTNET

# Replace with your actual address
TEST_ADDRESS = "your_address_here"
ETH_USD = "ETH-USD"
```


### Simple Subscription Example
Here's a simple example of how to subscribe to different channels:

```python
def handle_message(ws: IndexerSocket, message: dict):
    print("Received message:", message)

async def simple_subscription():
    async with IndexerSocket(TESTNET.websocket_indexer, on_message=handle_message) as ws:
        # Subscribe to markets
        await ws.markets.subscribe()
        
        # Subscribe to orderbook for ETH-USD
        await ws.order_book.subscribe(ETH_USD)
        
        # Subscribe to trades for ETH-USD
        await ws.trades.subscribe(ETH_USD)
        
        # Subscribe to 15-minute candles for ETH-USD
        await ws.candles.subscribe(ETH_USD, CandlesResolution.FIFTEEN_MINUTES)
        
        # Subscribe to a specific subaccount
        await ws.subaccounts.subscribe(TEST_ADDRESS, 0)
        
        # Keep the connection alive
        while True:
            await asyncio.sleep(1)

asyncio.run(simple_subscription())
```

### Advanced Example: Basic Adder
You can find a more advanced example in the [./examples/basic_adder.py](basic_adder.py) file.

