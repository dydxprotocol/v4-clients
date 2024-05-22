#include <string>
#include <string_view>

#include <catch2/catch_test_macros.hpp>

#include <common/encoding/base64.h>

#include <dydx_v4_futures/account_info.h>
#include <dydx_v4_futures/example_configs.h>

TEST_CASE("Account info", "[account_info]")
{
    auto local_account_info =
        dydx_v4_client_lib::LocalAccountInfo::FromMnemonic(dydx_v4_client_lib::EXAMPLE_DYDX_V4_MNEMONIC);

    SECTION("Correct dYdX v4 address")
    {
        REQUIRE(local_account_info.GetAccountAddress() == "dydx1cug6vurjx55mpeqxmvlqgp4y946echj2h7glc7");
    }

    SECTION("Correct private key")
    {
        auto key = local_account_info.GetPrivateKey();
        std::string_view const key_view {reinterpret_cast<char*>(key.data()), key.size()};
        REQUIRE(common::base64_encode(key_view) == "RoLvBYnuXrZFlS866PFQDuj7/gN6Z5/MbbxnT9hl3nc=");
    }

    SECTION("Correct public key")
    {
        auto key = local_account_info.GetPublicKey();
        std::string_view const key_view {reinterpret_cast<char*>(key.data()), key.size()};
        REQUIRE(common::base64_encode(key_view) == "At2YTpBmYsFIT026Vbw89yorCpfI4BeXKr9X3H9Vhh0l");
    }
}
