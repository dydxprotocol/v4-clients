#include <iostream>

#include <nlohmann/json.hpp>

#include <common/requests/base.h>

#include <dydx_v4_futures/account_info.h>
#include <dydx_v4_futures/example_configs.h>
#include <dydx_v4_futures/exchange_info.h>
#include <dydx_v4_futures/requests/node_grpc_gateway.h>

int main()
{
    dydx_v4_client_lib::ExchangeConfig const exchange_config =
        dydx_v4_client_lib::EXCHANGE_CONFIG_LOCAL_PLAINTEXT_NODE_TESTNET;
    auto exchange_info = dydx_v4_client_lib::ExchangeInfo::Retrieve(exchange_config);
    auto local_account_info =
        dydx_v4_client_lib::LocalAccountInfo::FromMnemonic(dydx_v4_client_lib::EXAMPLE_DYDX_V4_MNEMONIC);
    auto account_info = dydx_v4_client_lib::AccountInfo::Retrieve(exchange_config, local_account_info);

    dydx_v4_client_lib::NodeGrpcGatewayRestClient node_client(exchange_config);

    auto pagination = dydx_v4_client_lib::Pagination {.limit = 1, .count_total = false, .reverse = true};

    std::cout << "account: " << node_client.GetAccount(local_account_info.GetAccountAddress()) << std::endl;
    std::cout << "latest block: " << node_client.GetLatestBlock() << std::endl;
    std::cout << "latest block height: " << node_client.GetLatestBlockHeight() << std::endl;
    std::cout << "fee tiers: " << node_client.GetFeeTiers() << std::endl;
    std::cout << "user fee tier: " << node_client.GetUserFeeTier(local_account_info.GetAccountAddress()) << std::endl;
    std::cout << "user stats: " << node_client.GetUserStats(local_account_info.GetAccountAddress()) << std::endl;
    std::cout << "subaccounts: " << node_client.GetSubaccounts(pagination) << std::endl;

    std::cout << "bonded validators: "
              << node_client.GetAllValidators(dydx_v4_client_lib::ValidatorStatus::BOND_STATUS_BONDED) << std::endl;

    return 0;
}
