### Networks

This guide explains how to connect to different dYdX networks using the Python SDK.

#### Finding Network Endpoints

> **Important:** For the most up-to-date list of publicly available endpoints, refer to our [network resources documentation](https://docs.dydx.exchange/infrastructure_providers-network/resources#networks-repositories).

#### Connecting to Mainnet

To connect to the mainnet, use the `make_mainnet` function:

```python
from dydx_v4_client.network import make_mainnet

NETWORK = make_mainnet(
    node_url="NODE_URL",  # No 'https://' prefix
    rest_indexer="REST_INDEXER_URL",
    websocket_indexer="WEBSOCKET_INDEXER_URL"
)
```

> Note the above are just an example of the mainnet endpoints. Always use the most recent endpoints from our [network resources documentation](https://docs.dydx.exchange/infrastructure_providers-network/resources#indexer-endpoints).

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
     "dydx-testnet-4",
     secure_channel("test-dydx-grpc.kingnodes.com"),
     "adv4tnt",
     "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
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

#### Using Non-SSL Connections
The SDK supports both secure (SSL) and insecure (non-SSL) connections. By default, secure connections are used. However, for scenarios where you need to use a non-SSL node (e.g., local development), you can use the make_insecure function:

###### Create a secure version of the testnet configuration
```
from functools import partial

make_testnet_secure = partial(
    make_secure,
    testnet_node,
    rest_indexer="SECURE_REST_INDEXER_URL",
    websocket_indexer="SECURE_WEBSOCKET_INDEXER_URL",
    node_url="SECURE_NODE_URL",
)
TESTNET_SECURE = make_testnet_secure()
```

###### Create an insecure version of the testnet configuration
```
from functools import partial

make_testnet_insecure = partial(
    make_insecure,
    testnet_node,
    rest_indexer="INSECURE_REST_INDEXER_URL",
    websocket_indexer="INSECURE_WEBSOCKET_INDEXER_URL",
    node_url="INSECURE_NODE_URL",
)
TESTNET_INSECURE = make_testnet_insecure()
```
The difference between `make_secure` and `make_insecure` lies in the type of gRPC channel they use:

- `make_secure`: This function uses `secure_channel`, which creates an SSL-encrypted connection. It's suitable for production environments and when connecting to nodes over public networks.
- `make_insecure`: This function uses `insecure_channel`, which creates a non-SSL connection. It's typically used for local development or in trusted network environments where encryption isn't necessary.
