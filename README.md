<img src="https://dydx.exchange/icon.svg" height="64px" align="right" />

# Python Client (async) for dYdX (v4 API)

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

### Installation and Usage

#### Installation:

The package will be available on PyPI soon.

#### Getting Started:

The project employs [`poetry`](https://python-poetry.org/). To install dependencies, run:

```bash
poetry install
```

To execute tests:

```bash
poetry run pytest
```
