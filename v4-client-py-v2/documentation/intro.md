# dYdX Python SDK Quickstart Guide

This guide will help you get started with the dYdX Python SDK, which allows for asynchronous programming and interaction with the dYdX protocol.

## Table of Contents
1. [Asynchronous Programming](#asynchronous-programming)
2. [Node Client](#node-client)
3. [REST Indexer](#rest-indexer)
4. [Faucet](#faucet)

#### Asynchronous Programming

The dYdX Python SDK uses asynchronous programming. Any script using this package must be run using `asyncio.run()`:

```python
import asyncio

async def main():
    # Your async code here
    pass

asyncio.run(main())
```

### Node client
`NodeClient` allows to send transactions and fetch node state. E.g. you can deposit funds using the `deposit` method:

https://github.com/dydxprotocol/v4-clients/blob/3330f67752d430f9e0a20b419da4dc9daf7f7be0/v4-client-py-v2/examples/transfer_example_deposit.py#L1-L24

**Note:** It's possible to create a read only node client which doesn't allow to send transactions:
```python
from dydx_v4_client import QueryNodeClient
from dydx_v4_client.network import secure_channel


node = await QueryNodeClient(secure_channel("test-dydx-grpc.kingnodes.com"))
```

### REST Indexer
`IndexerClient` allows to fetch data from indexer:

```python
import asyncio

from dydx_v4_client.indexer.rest import IndexerClient
from dydx_v4_client.network import TESTNET


async def test_account():
    indexer = IndexerClient(TESTNET.rest_indexer)

    print(await indexer.account.get_subaccounts("dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art"))
```

### Websockets
Websockets allow to subscribe to live updates from the indexer. Learn more in the [WebSocket Guide](./using_websockets.md).

### Faucet
Faucet allows to obtain usdc on testnet. To use it create `FaucetClient`:
https://github.com/dydxprotocol/v4-clients/blob/3330f67752d430f9e0a20b419da4dc9daf7f7be0/v4-client-py-v2/examples/faucet_endpoint.py#L1-L15

