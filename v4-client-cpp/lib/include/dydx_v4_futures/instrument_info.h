#pragma once

#include <cstdint>

#include <dydx_v4_futures/types.h>

namespace dydx_v4_client_lib {

struct InstrumentInfo {
    ClobPairId clob_pair_id;
    int32_t atomic_resolution;
    int32_t quantum_conversion_exponent;
    uint64_t step_base_quantums;
    uint64_t subticks_per_tick;
};

}  // namespace dydx_v4_client_lib
