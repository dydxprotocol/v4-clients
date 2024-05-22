#pragma once

#include <cstdint>
#include <string>

namespace dydx_v4_client_lib {

using Address = std::string;
using BlockNumber = uint32_t;
using ClobPairId = uint32_t;
using AssetId = uint32_t;
using OrderId = std::string;
using OrderCid = uint32_t;
using AccountNumber = uint32_t;
using SubaccountNumber = uint32_t;
using Quantums = uint64_t;
using Subticks = uint64_t;

}  // namespace dydx_v4_client_lib
