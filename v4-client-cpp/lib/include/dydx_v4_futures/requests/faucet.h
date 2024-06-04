#pragma once

#include <cstdint>

#include <fmt/core.h>
#include <nlohmann/json.hpp>
#include <nlohmann/json_fwd.hpp>

#include <common/requests/base.h>
#include <common/requests/util.h>
#include <common/types.h>

#include <dydx_v4_futures/account_info.h>

namespace dydx_v4_client_lib {

class FaucetRestClient : public common::RestClient {
public:
    using common::RestClient::RestClient;

    nlohmann::json Fill(Subaccount subaccount, common::Quantity amount)
    {
        return Post(
            "/faucet/tokens",
            fmt::format(
                R"({{"address":"{}","subaccountNumber":{},"amount":{}}})",
                subaccount.account_address,
                subaccount.subaccount_number,
                static_cast<uint64_t>(amount * 2'000'000)
            )
        );
    }
};

}  // namespace dydx_v4_client_lib
