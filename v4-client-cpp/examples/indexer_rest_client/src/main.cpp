#include <iostream>

#include <nlohmann/json.hpp>

#include <dydx_v4_futures/account_info.h>
#include <dydx_v4_futures/example_configs.h>
#include <dydx_v4_futures/requests/indexer.h>

int main()
{
    auto local_account_info =
        dydx_v4_client_lib::LocalAccountInfo::FromMnemonic(dydx_v4_client_lib::EXAMPLE_DYDX_V4_MNEMONIC);
    dydx_v4_client_lib::IndexerRestClient indexer_client(dydx_v4_client_lib::INDEXER_API_HOST_TESTNET);

    std::cout << "perpetual markets: " << indexer_client.GetPerpetualMarkets() << std::endl;

    std::cout << "BTC orderbook: " << indexer_client.GetPerpetualMarketOrderbook("BTC-USD") << std::endl;
    std::cout << "BTC trades: " << indexer_client.GetPerpetualMarketTrades({
                                       .market = "BTC-USD"
                                   }) << std::endl;

    std::cout << "all subaccounts: " << indexer_client.GetSubaccounts(local_account_info.GetAccountAddress())
              << std::endl;
    std::cout << "all subaccounts with limit: "
              << indexer_client.GetSubaccounts(local_account_info.GetAccountAddress(), 10) << std::endl;
    std::cout << "one subaccount: " << indexer_client.GetSubaccount(local_account_info.GetSubaccount()) << std::endl;

    std::cout << "height: " << indexer_client.GetHeight().height << std::endl;
    std::cout << "time: " << indexer_client.GetTime().epoch << std::endl;
    std::cout << "screen: " << indexer_client.Screen(local_account_info.GetAccountAddress()).restricted << std::endl;

    return 0;
}
