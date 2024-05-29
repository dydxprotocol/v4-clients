#include <iostream>
#include <string>

#include <nlohmann/json.hpp>

#include <dydx_v4_futures/account_info.h>
#include <dydx_v4_futures/composite_client.h>
#include <dydx_v4_futures/encoding/proto.h>
#include <dydx_v4_futures/example_configs.h>
#include <dydx_v4_futures/exchange_info.h>

int main()
{
    dydx_v4_client_lib::ExchangeConfig const exchange_config =
        dydx_v4_client_lib::EXCHANGE_CONFIG_LOCAL_PLAINTEXT_NODE_TESTNET;
    auto exchange_info = dydx_v4_client_lib::ExchangeInfo::Retrieve(exchange_config);
    auto local_account_info =
        dydx_v4_client_lib::LocalAccountInfo::FromMnemonic(dydx_v4_client_lib::EXAMPLE_DYDX_V4_MNEMONIC);
    auto account_info = dydx_v4_client_lib::AccountInfo::Retrieve(exchange_config, local_account_info);

    dydx_v4_client_lib::CompositeClient client(exchange_config);

    std::cout << client.indexer_rest_client->GetSubaccount(account_info.GetSubaccount()) << std::endl;
    std::cout << client.PlaceOrder(
                     exchange_info,
                     account_info,
                     dydx_v4_client_lib::PlaceLongTermOrderParams {
                         .symbol = "ETH-USD",
                         .side = dydx_v4_client_lib::OrderSide::BUY,
                         .order_cid = 2,
                         .price = 2200,
                         .size = 0.01,
                     }
                 )
              << std::endl;

    std::cout << client.CancelOrder(
                     exchange_info,
                     account_info,
                     dydx_v4_client_lib::CancelLongTermOrderParams {
                         .symbol = "ETH-USD",
                         .order_cid = 2,
                         .conditional = false,
                     }
                 )
              << std::endl;

    std::cout << client.PlaceOrder(
                     exchange_info,
                     account_info,
                     dydx_v4_client_lib::PlaceShortTermOrderParams {
                         .symbol = "ETH-USD",
                         .side = dydx_v4_client_lib::OrderSide::BUY,
                         .order_cid = 3,
                         .price = 2200,
                         .size = 0.01,
                     }
                 )
              << std::endl;

    std::cout << client.CancelOrder(
                     exchange_info,
                     account_info,
                     dydx_v4_client_lib::CancelShortTermOrderParams {
                         .symbol = "ETH-USD",
                         .order_cid = 3,
                     }
                 )
              << std::endl;

    return 0;
}
