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
