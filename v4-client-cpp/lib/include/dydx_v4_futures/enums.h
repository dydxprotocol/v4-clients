#pragma once

#include <cstdint>
#include <optional>
#include <string>

#include <fmt/core.h>
#include <nlohmann/json.hpp>

#include <common/encoding/base64.h>
#include <common/requests/base.h>
#include <common/requests/util.h>

#include <dydx_v4_futures/account_info.h>
#include <dydx_v4_futures/types.h>

namespace dydx_v4_client_lib {

enum class BroadcastMode {
    BROADCAST_MODE_ASYNC,
    BROADCAST_MODE_SYNC,
};

inline std::string to_string(BroadcastMode broadcast_mode)
{
    switch (broadcast_mode) {
        case BroadcastMode::BROADCAST_MODE_ASYNC:
            return "BROADCAST_MODE_ASYNC";
        case BroadcastMode::BROADCAST_MODE_SYNC:
            return "BROADCAST_MODE_SYNC";
    }
    assert(false);
}

inline std::ostream& operator<<(std::ostream& os, const BroadcastMode& broadcast_mode)
{
    return os << to_string(broadcast_mode);
}

enum class ValidatorStatus {
    BOND_STATUS_BONDED,
    BOND_STATUS_UNBONDED,
};

inline std::string to_string(ValidatorStatus validator_status)
{
    switch (validator_status) {
        case ValidatorStatus::BOND_STATUS_BONDED:
            return "BOND_STATUS_BONDED";
        case ValidatorStatus::BOND_STATUS_UNBONDED:
            return "BOND_STATUS_UNBONDED";
    }
    assert(false);
}

inline std::ostream& operator<<(std::ostream& os, const ValidatorStatus& validator_status)
{
    return os << to_string(validator_status);
}

enum class OrderType {
    LIMIT,
    MARKET,
    STOP_LIMIT,
    TAKE_PROFIT_LIMIT,
    STOP_MARKET,
    TAKE_PROFIT_MARKET,
};

inline std::string to_string(OrderType order_type)
{
    switch (order_type) {
        case OrderType::LIMIT:
            return "LIMIT";
        case OrderType::MARKET:
            return "MARKET";
        case OrderType::STOP_LIMIT:
            return "STOP_LIMIT";
        case OrderType::TAKE_PROFIT_LIMIT:
            return "TAKE_PROFIT_LIMIT";
        case OrderType::STOP_MARKET:
            return "STOP_MARKET";
        case OrderType::TAKE_PROFIT_MARKET:
            return "TAKE_PROFIT_MARKET";
    }
    assert(false);
}

inline std::ostream& operator<<(std::ostream& os, const OrderType& order_type)
{
    return os << to_string(order_type);
}

enum class OrderSide {
    BUY,
    SELL,
};

inline std::string to_string(OrderSide order_side)
{
    switch (order_side) {
        case OrderSide::BUY:
            return "BUY";
        case OrderSide::SELL:
            return "SELL";
    }
    assert(false);
}

inline std::ostream& operator<<(std::ostream& os, const OrderSide& order_side)
{
    return os << to_string(order_side);
}

enum class OrderTimeInForce {
    GTT,
    IOC,
    FOK,
};

inline std::string to_string(OrderTimeInForce order_time_in_force)
{
    switch (order_time_in_force) {
        case OrderTimeInForce::GTT:
            return "GTT";
        case OrderTimeInForce::IOC:
            return "IOC";
        case OrderTimeInForce::FOK:
            return "FOK";
    }
    assert(false);
}

inline std::ostream& operator<<(std::ostream& os, const OrderTimeInForce& order_time_in_force)
{
    return os << to_string(order_time_in_force);
}

enum class OrderExecution {
    DEFAULT,
    IOC,
    FOK,
    POST_ONLY,
};

inline std::string to_string(OrderExecution order_execution)
{
    switch (order_execution) {
        case OrderExecution::DEFAULT:
            return "DEFAULT";
        case OrderExecution::IOC:
            return "IOC";
        case OrderExecution::FOK:
            return "FOK";
        case OrderExecution::POST_ONLY:
            return "POST_ONLY";
    }
    assert(false);
}

inline std::ostream& operator<<(std::ostream& os, const OrderExecution& order_execution)
{
    return os << to_string(order_execution);
}

enum class OrderStatus {
    BEST_EFFORT_OPENED,
    OPEN,
    BEST_EFFORT_CANCELED,
    CANCELED,
    FILLED,
};

inline std::string to_string(OrderStatus order_status)
{
    switch (order_status) {
        case OrderStatus::BEST_EFFORT_OPENED:
            return "BEST_EFFORT_OPENED";
        case OrderStatus::OPEN:
            return "OPEN";
        case OrderStatus::BEST_EFFORT_CANCELED:
            return "BEST_EFFORT_CANCELED";
        case OrderStatus::CANCELED:
            return "CANCELED";
        case OrderStatus::FILLED:
            return "FILLED";
    }
    assert(false);
}

inline std::ostream& operator<<(std::ostream& os, const OrderStatus& order_status)
{
    return os << to_string(order_status);
}

enum class TickerType {
    PERPETUAL,  // Only PERPETUAL is supported right now
};

inline std::string to_string(TickerType ticker_type)
{
    switch (ticker_type) {
        case TickerType::PERPETUAL:
            return "PERPETUAL";
    }
    assert(false);
}

inline std::ostream& operator<<(std::ostream& os, const TickerType& ticker_type)
{
    return os << to_string(ticker_type);
}

enum class PositionStatus {
    OPEN,
    CLOSED,
    LIQUIDATED,
};

inline std::string to_string(PositionStatus position_status)
{
    switch (position_status) {
        case PositionStatus::OPEN:
            return "OPEN";
        case PositionStatus::CLOSED:
            return "CLOSED";
        case PositionStatus::LIQUIDATED:
            return "LIQUIDATED";
    }
    assert(false);
}

inline std::ostream& operator<<(std::ostream& os, const PositionStatus& position_status)
{
    return os << to_string(position_status);
}

enum class TimePeriod {
    ONE_DAY,
    SEVEN_DAYS,
};

inline std::string to_string(TimePeriod time_period)
{
    switch (time_period) {
        case TimePeriod::ONE_DAY:
            return "ONE_DAY";
        case TimePeriod::SEVEN_DAYS:
            return "SEVEN_DAYS";
    }
    assert(false);
}

inline std::ostream& operator<<(std::ostream& os, const TimePeriod& time_period)
{
    return os << to_string(time_period);
}

enum class CandlesResolution {
    ONE_MINUTE,
    FIVE_MINUTES,
    FIFTEEN_MINUTES,
    THIRTY_MINUTES,
    ONE_HOUR,
    FOUR_HOURS,
    ONE_DAY,
};

inline std::string to_string(CandlesResolution candles_resolution)
{
    switch (candles_resolution) {
        case CandlesResolution::ONE_MINUTE:
            return "1MIN";
        case CandlesResolution::FIVE_MINUTES:
            return "5MINS";
        case CandlesResolution::FIFTEEN_MINUTES:
            return "15MINS";
        case CandlesResolution::THIRTY_MINUTES:
            return "30MINS";
        case CandlesResolution::ONE_HOUR:
            return "1HOUR";
        case CandlesResolution::FOUR_HOURS:
            return "4HOURS";
        case CandlesResolution::ONE_DAY:
            return "1DAY";
    }
    assert(false);
}

inline std::ostream& operator<<(std::ostream& os, const CandlesResolution& candles_resolution)
{
    return os << to_string(candles_resolution);
}

}  // namespace dydx_v4_client_lib
