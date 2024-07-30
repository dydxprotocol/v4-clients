<img src="https://dydx.exchange/icon.svg" height="64px" align="right" />

# Python Client (async) for dYdX (v4 API)
<div align="center">
    <a href='https://pypi.org/project/dydx-v4-client'>
    <img src='https://img.shields.io/pypi/v/dydx-v4-client.svg' alt='PyPI'/>
  </a>
  <a href='https://github.com/dydxprotocol/v4-clients/blob/main/LICENSE'>
    <img src='https://img.shields.io/badge/License-AGPL_v3-blue.svg' alt='License' />
  </a>
</div>

## Quick links

<div align="center">

### 📘 [Documentation](https://docs.dydx.exchange) 
### 📦 [Other implementations](https://github.com/dydxprotocol/v4-clients)

</div>

## Install
Install from PyPI:

```bash
pip install dydx-v4-client
```

Install from github:

```bash
pip install git+https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-py-v2
```

## Getting Started Guide

**dYdX Python SDK Trading Documentation**: go-to resource for starting trades on dYdX using the Python SDK. Follow this guide to learn the basics and begin trading.

### Table of Contents

1. [Introduction](./documentation/intro.md)
2. [Network Setup](./documentation/network_setup.md)
3. [Using the Testnet Faucet](./documentation/using_testnet_faucet.md)
4. [Account Details](./documentation/account_details.md)
5. [Getting Price Quotes](./documentation/getting_price_quotes.md)
6. [Placing Orders](./documentation/placing_orders.md)
7. [Placing Native Orders](./documentation/placing_native_orders.md)
8. [Using WebSockets](./documentation/using_websockets.md)

### Quick Start

To place an order, you first need to build the order. Here's a basic overview of the process:

1. Set up your network connection (see [Network Setup](./documentation/network_setup.md))
2. If using testnet, obtain funds from the faucet (see [Using the Testnet Faucet](./documentation/using_testnet_faucet.md))
3. Check your account details (see [Account Details](./documentation/account_details.md))
4. Get current market prices (see [Getting Price Quotes](./documentation/getting_price_quotes.md))
5. Build and place your order (see [Placing Orders](./placing_orders.md) or [Placing Native Orders](./documentation/placing_native_orders.md))
6. Optionally, set up WebSocket connections for real-time updates (see [Using WebSockets](./documentation/using_websockets.md))

For more detailed examples, see the [examples directory](/examples). Note that some examples may require installation of additional packages to work.

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
