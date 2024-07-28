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
