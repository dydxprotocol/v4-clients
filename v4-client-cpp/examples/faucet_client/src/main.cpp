#include <iostream>
#include <string>

#include <dydx_v4_futures/account_info.h>
#include <dydx_v4_futures/example_configs.h>
#include <dydx_v4_futures/requests/faucet.h>
#include <dydx_v4_futures/requests/indexer.h>

int main()
{
    auto local_account_info =
        dydx_v4_client_lib::LocalAccountInfo::FromMnemonic(dydx_v4_client_lib::EXAMPLE_DYDX_V4_MNEMONIC);
    dydx_v4_client_lib::IndexerRestClient indexer_rest_client(dydx_v4_client_lib::INDEXER_API_HOST_TESTNET);
    dydx_v4_client_lib::FaucetRestClient faucet(dydx_v4_client_lib::FAUCET_API_HOST_TESTNET);

    std::cout << "fill result: " << faucet.Fill(local_account_info.subaccount, 100).dump(2) << std::endl;

    std::cout << "subaccount info: " << indexer_rest_client.GetSubaccount(local_account_info.GetSubaccount()).dump(2)
              << std::endl;

    return 0;
}
