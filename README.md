<img src="https://dydx.exchange/icon.svg" height="64px" align="right" />

# Python Client (async) for dYdX (v4 API)


## Install
Install from github:

```
pip install git+https://github.com/NethermindEth/dydx-v4-client
```

## Quickstart
The package allows asynchronous programming so any script using it has to be run using asyncio.run:

```python
import asyncio


async def main():
    pass


asyncio.run(main())
```

### Node

`NodeClient` allows to send transactions and fetch node state. E.g. you can deposit funds using the `deposit` method:

https://github.com/NethermindEth/dydx-v4-client/blob/f8be7bf9165fb052e831fcafb8086d14e5af13aa/examples/transfer_example_deposit.py#L1-L24

**Note:** It's possible to create a read only node client which doesn't allow to send transactions:
```python
from dydx_v4_client import QueryNodeClient


node = await QueryNodeClient.connect("https://dydx-ops-rpc.kingnodes.com:443")
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

### Websocket indexer
Websocket indexer allows to subscribe to channels to obtain live updates:

https://github.com/NethermindEth/dydx-v4-client/blob/8003032c303cf238097fb3fcb30e2acb50787d03/examples/websocket_example.py

### Networks
A set of predefined networks may be imported:

```python
from dydx_v4_client.network import TESTNET, MAINNET, LOCAL
```

If you want to use a custom API you can create a network directly:
```python
from dydx_v4_client.network import Network

CUSTOM_MAINNET = Network(
    NodeConfig(
        "dydx-mainnet-1",
        "https://dydx-ops-rpc.kingnodes.com:443",
        "adydx",
        "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
    ),
    "https://indexer.dydx.trade",
    "wss://indexer.dydx.trade/v4/ws",
)
```
Or provide the URL directly to the client, e.g.:
```python
indexer = IndexerClient("https://indexer.dydx.trade")
```
### Faucet
Faucet allows to obtain usdc on testnet
https://github.com/NethermindEth/dydx-v4-client/blob/8003032c303cf238097fb3fcb30e2acb50787d03/examples/faucet_endpoint.py

### Examples
For more examples see [examples directory](/examples). Some examples may require installation of additional packages in order to work.

## Changes
[Differences Comparison](./DIFF.md)

The latest version of the Python async client for dYdX offers notable enhancements over previous iterations. These improvements make it a more efficient tool for trading and integration.

### Key Improvements

#### Asynchronous Execution

The methods leverage Python's async features, allowing you to fully harness concurrency benefits. This approach optimizes resource usage, minimizes unnecessary threads, and reduces latency.

#### Enhanced Type Hints

Expanded type hint coverage enhances code readability and provides better tooling support. Additionally, it helps detect errors early during development.

#### API Reflection

The client closely mirrors the dYdX API, enabling seamless access to the exchange's features and parameters. This makes integrating the client with your applications intuitive and straightforward.

#### Lightweight Implementation
The client is built using pure Python libraries and maintains a thin, transparent layer that follows the Principle of Least Astonishment (POLA). This ensures explicit behavior and gives you greater control.

#### MIT License
Licensed under the permissive MIT license, the client can be easily integrated into your software projects without restrictive legal hurdles.

## Development
The project is divided into three main parts:
* node - contains the `NodeClient`, transaction builder and other utilities
* indexer - contains rest api indexer client and websocket indexer client
* faucet - contains faucet client

### Installing from source
The project employs [`poetry`](https://python-poetry.org/). To install dependencies, run:

```bash
poetry install
```

### Testing
To run tests use:

```bash
poetry run pytest
```
