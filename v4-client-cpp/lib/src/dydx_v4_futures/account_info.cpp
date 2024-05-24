#include "dydx_v4_futures/account_info.h"

#include <cassert>
#include <cstdint>
#include <string>
#include <utility>
#include <vector>

#include <bip3x/bip3x_crypto.h>
#include <bip3x/bip3x_hdkey_encoder.h>
#include <bip3x/bip3x_mnemonic.h>
#include <bip3x/crypto/ripemd160.h>
#include <bip3x/crypto/sha2.hpp>
#include <bip3x/details/utils.h>

#include <common/encoding/bech32.h>

#include <dydx_v4_futures/constants.h>
#include <dydx_v4_futures/exchange_info.h>
#include <dydx_v4_futures/requests/node_grpc_gateway.h>
#include <dydx_v4_futures/types.h>

namespace dydx_v4_client_lib {

namespace {

common::BytesVec calc_fingerprint(bip3x::hdkey& key)
{
    common::BytesVec sha_digest(32);
    trezor::SHA256_CTX ctx;
    sha256_Init(&ctx);
    sha256_Update(&ctx, key.public_key.cdata(), 33);
    sha256_Final(&ctx, sha_digest.data());

    common::BytesVec final_digest(20);
    ripemd160(sha_digest.data(), 32, final_digest.data());
    return final_digest;
}

common::BytesVec to_5bits(const common::BytesVec& bytes)
{
    assert(bytes.size() % 5 == 0);
    constexpr int FROM_BITS = 8;
    constexpr int TO_BITS = 5;
    constexpr int MAX_VALUE = (1 << TO_BITS) - 1;
    constexpr int MAX_ACC = (1 << (FROM_BITS + TO_BITS - 1)) - 1;
    int acc = 0;
    int bits = 0;
    common::BytesVec result;
    for (uint8_t const by: bytes) {
        acc = ((acc << FROM_BITS) | by) & MAX_ACC;
        bits += FROM_BITS;
        while (bits >= TO_BITS) {
            bits -= TO_BITS;
            result.push_back((acc >> bits) & MAX_VALUE);
        }
    }
    return result;
}

}  // namespace

LocalAccountInfo LocalAccountInfo::FromMnemonic(std::string mnemonic, uint32_t subaccount_number)
{
    bip3x::bytes_64 const seed = bip3x::bip3x_hdkey_encoder::make_bip39_seed(mnemonic);
    bip3x::hdkey key = bip3x::bip3x_hdkey_encoder::make_bip32_root_key(seed);
    bip3x::bip3x_hdkey_encoder::extend_key(key, BIP44_DERIVATION_PATH);
    auto fingerprint = calc_fingerprint(key);
    auto address = bech32::Encode(bech32::Encoding::BECH32, BECH32_PREFIX, to_5bits(fingerprint));
    return LocalAccountInfo {
        .subaccount =
            Subaccount {
                .account_address = std::move(address),
                .subaccount_number = subaccount_number,
            },
        .mnemonic = std::move(mnemonic),
        .public_key = key.public_key.get(),
        .private_key = key.private_key.get(),
    };
}

AccountInfo AccountInfo::Retrieve(const ExchangeConfig& exchange_config, LocalAccountInfo local_account_info)
{
    auto account_info = NodeGrpcGatewayRestClient(exchange_config).GetAccount(local_account_info.GetAccountAddress());

    AccountNumber account_number = -1;
    uint64_t sequence = 0;
    if (!account_info.contains("code")) {
        account_number =
            static_cast<uint32_t>(std::stoul(account_info["account"]["account_number"].template get<std::string>()));
        sequence = std::stoull(account_info["account"]["sequence"].template get<std::string>());
    }

    return AccountInfo {
        .local_account_info = std::move(local_account_info),
        .account_number = account_number,
        .sequence = sequence,
    };
}

}  // namespace dydx_v4_client_lib
