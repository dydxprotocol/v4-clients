C++ client for dYdX (v4 API).

---

This client was originally developed and open-sourced through a grant by the dYdX Grants Trust — an unaffiliated and independent third-party from dYdX Trading Inc.

---

## Development

Install dependencies, on Ubuntu the command is:

```
sudo apt install libprotobuf-dev protobuf-compiler
```

The project uses CMake. To build the library and examples run

```
mkdir build
cd build
cmake ..
make
```

Note that running CMake will take a while because it downloads all the other dependencies.

## Getting Started

Sample code is located in `examples` folder.

`composite_client` shows how to place and cancel orders

`faucet_client` shows how to get testnet money

`indexer_rest_client` shows how to get account and market data trough requests

`indexer_ws_client` shows how to track account and market data in real time

`node_client` shows some requests which can be made to a node

## Running examples

Build the corresponding target in CMake and run the binary, e.g.

```
cd build
make dydx_v4_indexer_rest_client_example
./examples/indexer_rest_client/dydx_v4_indexer_rest_client_example
```

## Example account

There is an example testnet account info in `lib/include/dydx_v4_futures/example_configs.h`.
It's possible to add this account to e.g. MetaMask and then to 
log into it at https://v4.testnet.dydx.exchange/, but keep in mind that
this account is publicly available, and it might be out of money. You can always create a
personal testnet account.

## Placing and canceling orders

You can look at `composite_client`, but here is a gist

```c++
// Get exchange config
dydx_v4_client_lib::ExchangeConfig const exchange_config =
    dydx_v4_client_lib::EXCHANGE_CONFIG_LOCAL_PLAINTEXT_NODE_TESTNET;
// Retrieve exchange data about instruments
auto exchange_info = dydx_v4_client_lib::ExchangeInfo::Retrieve(exchange_config);
// Generate account info from mnemonic
auto local_account_info =
    dydx_v4_client_lib::LocalAccountInfo::FromMnemonic(dydx_v4_client_lib::EXAMPLE_DYDX_V4_MNEMONIC);
// Retrieve additional account info
auto account_info = dydx_v4_client_lib::AccountInfo::Retrieve(exchange_config, local_account_info);

// Initialize a client
dydx_v4_client_lib::CompositeClient client(exchange_config);

// Place long-term order
client.PlaceOrder(
    exchange_info,
    account_info,
    dydx_v4_client_lib::PlaceLongTermOrderParams {
        .symbol = "ETH-USD",
        .side = dydx_v4_client_lib::OrderSide::BUY,
        .order_cid = 2,
        .price = 2200,
        .size = 0.01,
        .good_till_timestamp = static_cast<uint32_t>(std::time(0) + 1000),
    }
);

// Cancel long-term order
client.CancelOrder(
    exchange_info,
    account_info,
    dydx_v4_client_lib::CancelLongTermOrderParams {
        .symbol = "ETH-USD",
        .order_cid = 2,
        .good_till_timestamp = static_cast<uint32_t>(std::time(0) + 1000),
    }
);
   
// Place short-term order
client.PlaceOrder(
    exchange_info,
    account_info,
    dydx_v4_client_lib::PlaceShortTermOrderParams {
        .symbol = "ETH-USD",
        .side = dydx_v4_client_lib::OrderSide::BUY,
        .order_cid = 3,
        .price = 2200,
        .size = 0.01,
        .good_till_block = client.node_grpc_gateway_rest_client->GetLatestBlockHeight() + 15,
    }
);
   
// Cancel short-term order
client.CancelOrder(
    exchange_info,
    account_info,
    dydx_v4_client_lib::CancelShortTermOrderParams {
        .symbol = "ETH-USD",
        .order_cid = 3,
        .good_till_block = client.node_grpc_gateway_rest_client->GetLatestBlockHeight() + 15,
    }
);

```

## Running tests

```
cd build
make test
```
