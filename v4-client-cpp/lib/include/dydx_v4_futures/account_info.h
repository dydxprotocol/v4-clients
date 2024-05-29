#pragma once

#include <cstdint>
#include <string>
#include <utility>

#include <nlohmann/json.hpp>

#include <common/types.h>

#include <dydx_v4_futures/exchange_info.h>
#include <dydx_v4_futures/types.h>

namespace dydx_v4_client_lib {

struct Subaccount {
    std::string account_address;
    SubaccountNumber subaccount_number = 0;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(Subaccount, account_address, subaccount_number)

struct LocalAccountInfo {
    static LocalAccountInfo FromMnemonic(std::string mnemonic, SubaccountNumber subaccount_number = 0);

    [[nodiscard]]
    const Subaccount& GetSubaccount() const
    {
        return subaccount;
    }

    [[nodiscard]]
    const std::string& GetMnemonic() const
    {
        return mnemonic;
    }

    [[nodiscard]]
    SubaccountNumber GetSubaccountNumber() const
    {
        return subaccount.subaccount_number;
    }

    [[nodiscard]]
    const common::BytesVec& GetPublicKey() const
    {
        return public_key;
    }

    [[nodiscard]]
    const common::BytesVec& GetPrivateKey() const
    {
        return private_key;
    }

    [[nodiscard]]
    const std::string& GetAccountAddress() const
    {
        return subaccount.account_address;
    }

    Subaccount subaccount;
    std::string mnemonic;
    common::BytesVec public_key;
    common::BytesVec private_key;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(LocalAccountInfo, subaccount, mnemonic, public_key, private_key)

struct AccountInfo {
    static AccountInfo Retrieve(const ExchangeConfig& exchange_config, LocalAccountInfo info);

    [[nodiscard]]
    const Subaccount& GetSubaccount() const
    {
        return local_account_info.subaccount;
    }

    [[nodiscard]]
    const LocalAccountInfo& GetLocalAccountInfo() const
    {
        return local_account_info;
    }

    [[nodiscard]]
    const std::string& GetMnemonic() const
    {
        return local_account_info.GetMnemonic();
    }

    [[nodiscard]]
    SubaccountNumber GetSubaccountNumber() const
    {
        return local_account_info.GetSubaccountNumber();
    }

    [[nodiscard]]
    const common::BytesVec& GetPublicKey() const
    {
        return local_account_info.GetPublicKey();
    }

    [[nodiscard]]
    const common::BytesVec& GetPrivateKey() const
    {
        return local_account_info.GetPrivateKey();
    }

    [[nodiscard]]
    const std::string& GetAccountAddress() const
    {
        return local_account_info.GetAccountAddress();
    }

    [[nodiscard]]
    AccountNumber GetAccountNumber() const
    {
        return account_number;
    }

    [[nodiscard]]
    uint64_t GetSequence() const
    {
        return sequence;
    }

    void IncreaseSequence()
    {
        ++sequence;
    }

    LocalAccountInfo local_account_info;
    AccountNumber account_number;
    uint64_t sequence;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(AccountInfo, local_account_info, account_number)

}  // namespace dydx_v4_client_lib
