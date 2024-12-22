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

Certainly! Here's the continued README section:

---

## Installation

### Install from PyPI:

To install the client from PyPI, run:

```bash
pip install dydx-v4-client
```

### Install from GitHub:

To install directly from the GitHub repository, run:

```bash
pip install git+https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-py-v2
```

### Common Installation Issue on Ubuntu

If you're using Ubuntu and encounter the following error when trying to install `dydx-v4-client`:

```
Failed building wheel for ed25519-blake2b
```

This error suggests there might be some compatibility issues or missing dependencies. The likely cause is that the `ed25519-blake2b` package requires Rust to be installed for building the necessary components. Here’s how you can fix this:

1. **Ensure Necessary Build Tools Are Installed:**

   First, update your package list and install the essential build tools:

   ```bash
   sudo apt-get update
   sudo apt-get install build-essential python3-dev
   ```

2. **Install Additional System Libraries:**

   Install the SSL development libraries:

   ```bash
   sudo apt-get install libssl-dev
   ```

3. **Install Rust Using rustup:**

   Rust is required to build certain packages. Install it using the following command:

   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

   Follow the prompts to complete the installation. After installation, you may need to restart your terminal or run:

   ```bash
   source $HOME/.cargo/env
   ```

   to update your PATH.

4. **Upgrade pip, setuptools, and wheel:**

   Ensure you have the latest versions of pip, setuptools, and wheel:

   ```bash
   pip install --upgrade pip setuptools wheel
   ```

5. **Install the ed25519-blake2b Package Separately:**

   To isolate the issue, try installing the `ed25519-blake2b` package first:

   ```bash
   pip install ed25519-blake2b
   ```

6. **Reattempt Installation of dydx-v4-client:**

   If the above steps succeed, try installing `dydx-v4-client` again:

   ```bash
   pip install dydx-v4-client
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
