# User guide to test mainnet examples

The examples present in this folder are meant to be used in the mainnet, thus, with real money. Use them at your own risk.

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
export PYTHONPATH='cd ~/.../v4-clients/v4-client-py'
```
4. Set in v4_client_py/clients/modules/post.py the mainnet network instead of testnet (lines 46 to 48)
```
# here to be selected testent or mainnet network
#network = NetworkConfig.fetch_dydx_testnet()
network = NetworkConfig.fetchai_mainnet()
```

Now you are ready to use the examples in this folder.