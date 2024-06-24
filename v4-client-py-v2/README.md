<img src="https://dydx.exchange/icon.svg" height="64px" align="right" />

# Python Client (async) for dYdX (v4 API)

## Quick links

<div align="center">

### 📘 [Documentation](https://docs.dydx.exchange) 
### 📦 [Other implementations](https://github.com/dydxprotocol/v4-clients)

</div>

## Install
Install from github:

```bash
pip install git+https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-py-v2
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

### Websocket indexer
Websocket indexer allows to subscribe to channels to obtain live updates:

https://github.com/dydxprotocol/v4-clients/blob/3330f67752d430f9e0a20b419da4dc9daf7f7be0/v4-client-py-v2/examples/websocket_example.py#L1-L24

### Networks

> **See [network resources](https://docs.dydx.exchange/infrastructure_providers-network/resources#networks-repositories) to find publicly available endpoints**

To connect to the mainnet you can use `make_mainnet` function:
```python
from dydx_v4_client.network import make_mainnet


NETWORK = make_mainnet(
    node_url=NODE_URL, 
    rest_indexer=REST_URL, 
    websocket_indexer=WEBSOCKET_URL
)
```

For local and testnet networks there is a set of predefined networks:

```python
from dydx_v4_client.network import TESTNET, LOCAL
```

If you want to use a custom API each network has its respective _make_ function:
```python
from dydx_v4_client.network import make_testnet, make_local
```

You can overwrite the default URL when calling the function:
```python
NETWORK = make_local(node_url="http://localhost:26657")
```

To create a custom network you can do it directly:
```python
from dydx_v4_client.network import Network, NodeConfig, secure_channel


CUSTOM_MAINNET = Network(
    "https://dydx-testnet.imperator.co",
    "wss://indexer.v4testnet.dydx.exchange/v4/ws",
    NodeConfig(
        "dydx-testnet-4",
        secure_channel("test-dydx-grpc.kingnodes.com"),
        "adv4tnt",
        "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
    ),
)
```
Or provide the URL directly to the client, e.g.:
```python
indexer = IndexerClient("https://dydx-testnet.imperator.co")
```
### Faucet
Faucet allows to obtain usdc on testnet. To use it create `FaucetClient`:
https://github.com/dydxprotocol/v4-clients/blob/3330f67752d430f9e0a20b419da4dc9daf7f7be0/v4-client-py-v2/examples/faucet_endpoint.py#L1-L15

### Placing order
To place order first you have to build the order.

To do this you can the direct interface:
```python
order(
    id,
    side,
    quantums,
    subticks,
    time_in_force,
    reduce_only,
    good_til_block,
    good_til_block_time
)
```

Or market based calculator:
```python
from dydx_v4_client.node.market import Market
from dydx_v4_client import MAX_CLIENT_ID, NodeClient, OrderFlags


MARKET_ID = "ETH-USD"
ADDRESS = "dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art"

async def get_order():
    indexer = IndexerClient(TESTNET.rest_indexer)

    market = Market(
        (await indexer.markets.get_perpetual_markets(MARKET_ID))["markets"][MARKET_ID]
    )

    order_id = market.order_id(
            ADDRESS, 0, random.randint(0, MAX_CLIENT_ID), OrderFlags.SHORT_TERM
        )
    return market.order(
        order_id,
        side,
        size,
        price,
        time_in_force,
        reduce_only,
        good_til_block,
        good_til_block_time
    )
```

The constructed order may then be provided to `NodeClient.place_order`:
```python
await node.place_order(
    wallet,
    order
)
```
### Examples
For more examples see [examples directory](/examples). Some examples may require installation of additional packages in order to work.

## Changes

### Migration

If you are transitioning from a previous version of the Python client, please note the following differences:

#### NodeClient

`ValidatorClient` is renamed to `NodeClient`.

All provided methods are asynchronous.

Methods are available directly, no methods `get` or `post` needed, since the client uses inheritance, and consists of three layers:

- `QueryNodeClient`, the basic layer that send queries to a node
- `MutatingNodeClient` - the extension on top of the query client, that support transation simulation and sending
- `NodeClient` the toppest layer that provides methods to control orders

For parameters raw types used.

For construcint order the `Market` builder is provided, that helps to calculate quantums and subticks values.

#### IndexerClient

The `IndexerClient` has the similar structure, but provides
asynchronous methods as well.

#### IndexerSocket

The `SocketClient` is replaced with the `IndexerSocket` that provides separate channels concept and allow to add per-channel processing.

### Key Improvements

The latest version of the Python async client for dYdX offers notable enhancements over previous iterations. These improvements make it a more efficient tool for trading and integration.

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

### Preparing development environment
Install git hooks:
```bash
pre-commit install
```

### Testing
To run tests use:

```bash
poetry run pytest
```

## Acknowledgements

Built by Nethermind: [@piwonskp](https://github.com/piwonskp), [@samtin0x](https://github.com/samtin0x),  [@therustmonk](https://github.com/therustmonk)

For more details about the grant see [link](https://www.dydxgrants.com/grants/python-trading-client).
