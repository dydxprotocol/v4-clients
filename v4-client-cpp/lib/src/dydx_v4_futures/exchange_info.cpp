#include "dydx_v4_futures/exchange_info.h"

#include <iostream>

#include <dydx_v4_futures/requests/indexer.h>

namespace dydx_v4_client_lib {

ExchangeInfo ExchangeInfo::Retrieve(ExchangeConfig exchange_config)
{
    auto markets = IndexerRestClient(exchange_config).GetPerpetualMarkets();

    auto exchange_info = ExchangeInfo {.m_exchange_config = std::move(exchange_config)};

    for (const auto& market: markets["markets"].items()) {
        exchange_info.m_instrument_info[market.key()] = InstrumentInfo {
            .clob_pair_id =
                static_cast<ClobPairId>(std::stoul(market.value()["clobPairId"].template get<std::string>())),
            .atomic_resolution = market.value()["atomicResolution"].template get<int32_t>(),
            .quantum_conversion_exponent = market.value()["quantumConversionExponent"].template get<int32_t>(),
            .step_base_quantums = market.value()["stepBaseQuantums"].template get<uint64_t>(),
            .subticks_per_tick = market.value()["subticksPerTick"].template get<uint64_t>(),
        };
    }

    return exchange_info;
}

}  // namespace dydx_v4_client_lib
