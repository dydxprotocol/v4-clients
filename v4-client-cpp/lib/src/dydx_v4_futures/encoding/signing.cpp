#include "dydx_v4_futures/encoding/signing.h"

#include <cstring>
#include <string>
#include <string_view>

#include <bip3x/bip3x_crypto.h>

namespace dydx_v4_client_lib {

std::string Sign(std::string_view message, const common::BytesVec& private_key)
{
    std::string result;
    result.resize(64);
    ecdsa_sign(
        &secp256k1,
        HASHER_SHA2,
        private_key.data(),
        reinterpret_cast<const uint8_t*>(message.data()),
        message.size(),
        reinterpret_cast<uint8_t*>(result.data()),
        nullptr,
        nullptr
    );
    return result;
}

}  // namespace dydx_v4_client_lib
