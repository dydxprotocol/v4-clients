### Networks

This guide explains how to connect to different dYdX networks using the Python SDK.

#### Finding Network Endpoints

> **Important:** For the most up-to-date list of publicly available endpoints, refer to our [network resources documentation](https://docs.dydx.exchange/infrastructure_providers-network/resources#networks-repositories).

#### Connecting to Mainnet

To connect to the mainnet, use the `make_mainnet` function:

```python
from dydx_v4_client.network import make_mainnet

NETWORK = make_mainnet(
    node_url="dydx-ops-grpc.kingnodes.com:443",  # No 'https://' prefix
    rest_indexer="https://indexer.v4.dydx.exchange",
    websocket_indexer="wss://indexer.v4.dydx.exchange/v4/ws"
)
```

Note the above are just an example of the mainnet endpoints. Always use the most recent endpoints from our [network resources documentation](https://docs.dydx.exchange/infrastructure_providers-network/resources#networks-repositories).

⚠️ **Important:** When specifying `node_url`, do not include the `https://` prefix. This is a common mistake that can cause connection issues.

#### Connecting to Testnet

For testnet, you can use the predefined `TESTNET` network:

```python
from dydx_v4_client.network import TESTNET

# Use TESTNET directly in your client initialization
```

To customize the testnet connection:

```python
from dydx_v4_client.network import make_testnet

CUSTOM_TESTNET = make_testnet(
    node_url="your-custom-testnet-node-url",
    rest_indexer="your-custom-testnet-rest-url",
    websocket_indexer="your-custom-testnet-websocket-url"
)
```

> Find the latest testnet endpoints in our [network resources documentation](https://docs.dydx.exchange/infrastructure_providers-network/resources#networks-repositories).

#### Local Development

For local development, use the predefined `LOCAL` network:

```python
from dydx_v4_client.network import LOCAL

# Use LOCAL directly in your client initialization
```

To customize the local network:

```python
from dydx_v4_client.network import make_local

CUSTOM_LOCAL = make_local(node_url="http://localhost:26657")
```

#### Creating a Custom Network

For advanced users who need to define a completely custom network:

```python
from dydx_v4_client.network import Network, NodeConfig, secure_channel

CUSTOM_NETWORK = Network(
    "https://your-custom-rest-url.com",
    "wss://your-custom-websocket-url.com/ws",
    NodeConfig(
        "your-chain-id",
        secure_channel("your-node-url.com:443"),
        "your-address-prefix",
        "your-denom",
    ),
)
```

#### Direct URL Usage

You can also provide URLs directly to specific clients:

```python
from dydx_v4_client import IndexerClient

indexer = IndexerClient("https://your-indexer-url.com")
```

Remember to always use the most recent endpoints from our [network resources documentation](https://docs.dydx.exchange/infrastructure_providers-network/resources#networks-repositories) when connecting to dYdX networks.

