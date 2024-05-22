#include <iostream>
#include <string>

#include <nlohmann/json.hpp>

#include <common/streams/base.h>

#include <dydx_v4_futures/account_info.h>
#include <dydx_v4_futures/enums.h>
#include <dydx_v4_futures/example_configs.h>
#include <dydx_v4_futures/streams/indexer.h>

int main()
{
    auto local_account_info =
        dydx_v4_client_lib::LocalAccountInfo::FromMnemonic(dydx_v4_client_lib::EXAMPLE_DYDX_V4_MNEMONIC);

    dydx_v4_client_lib::IndexerWsClient ws_client =
        dydx_v4_client_lib::IndexerWsClient(dydx_v4_client_lib::INDEXER_WS_HOST_TESTNET);

    ws_client.SetMessageCallback([&ws_client, &local_account_info](const std::string& message) {
        auto parsed = nlohmann::json::parse(message);
        if (parsed["type"] == "connected") {
            ws_client.SubscribeToOrderbook("ETH-USD");
            ws_client.SubscribeToCandles("BTC-USD", dydx_v4_client_lib::CandlesResolution::ONE_MINUTE);
            ws_client.SubscribeToSubaccount(local_account_info.GetSubaccount());
        }
        std::cout << parsed.dump(2) << std::endl;
    });

    ws_client.Run();

    return 0;
}
