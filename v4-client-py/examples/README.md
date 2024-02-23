# User guide to test examples

1. Go to your repository location for the Python client
```
cd ~/.../v4-clients/v4-client-py
```
2. Create a virtual environment for the DyDx client, activate it and install requirements
```
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```
3. Export PYTHONPATH for your current location
```
export PYTHONPATH='~/.../v4-clients/v4-client-py'
```

Now you are ready to use the examples in this folder.

# Set up your configurations in constants.py 
~/.../v4-clients/v4-client-py/v4_client_py/clients/constants.py

```
VALIDATOR_GRPC_ENDPOINT = <>
AERIAL_CONFIG_URL = <>
AERIAL_GRPC_OR_REST_PREFIX = <>
INDEXER_REST_ENDPOINT = <>
INDEXER_WS_ENDPOINT = <>
CHAIN_ID = <>
ENV = <>
```

