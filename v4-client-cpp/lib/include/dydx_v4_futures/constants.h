#pragma once

#include <cstdint>
#include <string>

#include <dydx_v4_futures/types.h>

namespace dydx_v4_client_lib {

constexpr uint32_t LONG_TERM_TIME_TO_LIVE_SECONDS = 24 * 60 * 60;
constexpr BlockNumber SHORT_TERM_TIME_TO_LIVE_BLOCKS = 15;
constexpr AssetId ASSET_USDC = 0;
inline const std::string BECH32_PREFIX = "dydx";
inline const std::string BIP44_DERIVATION_PATH = "m/44'/118'/0'/0/0";

}  // namespace dydx_v4_client_lib
