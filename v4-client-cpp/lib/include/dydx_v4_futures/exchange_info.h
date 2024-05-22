#pragma once

#include <cstdint>
#include <map>
#include <string>

#include <common/requests/base.h>
#include <common/streams/base.h>
#include <common/types.h>

#include <dydx_v4_futures/instrument_info.h>
#include <dydx_v4_futures/types.h>

namespace dydx_v4_client_lib {

struct ExchangeConfig {
    std::string chain_id;
    uint64_t fee_minimum_gas_price;
    std::string fee_denom;
    std::optional<common::RestConfig> node_grpc_gateway_rest_config = std::nullopt;
    std::optional<common::RestConfig> node_tendermint_rest_config = std::nullopt;
    std::optional<common::RestConfig> indexer_rest_config = std::nullopt;
    std::optional<common::WsConfig> indexer_ws_config = std::nullopt;
};

struct ExchangeInfo {
    static ExchangeInfo Retrieve(ExchangeConfig config);

    [[nodiscard]]
    uint64_t GetFeeMinimumGasPrice() const
    {
        return m_exchange_config.fee_minimum_gas_price;
    }

    [[nodiscard]]
    std::string GetFeeDenom() const
    {
        return m_exchange_config.fee_denom;
    }

    [[nodiscard]]
    const ExchangeConfig& GetExchangeConfig() const
    {
        return m_exchange_config;
    }

    [[nodiscard]]
    const std::string& GetChainId() const
    {
        return m_exchange_config.chain_id;
    }

    [[nodiscard]]
    const InstrumentInfo& GetInstrumentInfo(const common::Symbol& symbol) const
    {
        return m_instrument_info.at(symbol);
    }

    ExchangeConfig m_exchange_config;
    std::map<common::Symbol, InstrumentInfo> m_instrument_info = {};
};

}  // namespace dydx_v4_client_lib
