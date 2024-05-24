#pragma once

#include <optional>
#include <string>
#include <vector>

#include <dydx_v4_futures/constants.h>
#include <dydx_v4_futures/encoding/proto.h>
#include <dydx_v4_futures/exchange_info.h>
#include <dydx_v4_futures/requests/indexer.h>
#include <dydx_v4_futures/requests/node_grpc_gateway.h>

namespace dydx_v4_client_lib {

struct PlaceShortTermOrderParams {
    common::Symbol symbol;
    OrderSide side;
    PlaceOrderTimeInForce time_in_force = PlaceOrderTimeInForce::UNSPECIFIED;
    OrderCid order_cid;
    common::Price price;
    common::Quantity size;
    std::optional<BlockNumber> good_till_block = std::nullopt;
    bool reduce_only = false;
    std::optional<uint32_t> client_metadata = std::nullopt;
};

struct PlaceLongTermOrderParams {
    common::Symbol symbol;
    OrderSide side;
    PlaceOrderTimeInForce time_in_force = PlaceOrderTimeInForce::UNSPECIFIED;
    OrderCid order_cid;
    common::Price price;
    common::Quantity size;
    std::optional<uint32_t> good_till_timestamp = std::nullopt;
    bool reduce_only = false;
    std::optional<ConditionalOrderParams> conditional_order_params = std::nullopt;
    std::optional<uint32_t> client_metadata = std::nullopt;
};

struct CancelShortTermOrderParams {
    common::Symbol symbol;
    OrderCid order_cid;
    std::optional<BlockNumber> good_till_block = std::nullopt;
};

struct CancelLongTermOrderParams {
    common::Symbol symbol;
    OrderCid order_cid;
    std::optional<uint32_t> good_till_timestamp = std::nullopt;
    bool conditional;
};

struct CompositeClient {
    CompositeClient(ExchangeConfig config, BroadcastMode broadcast_mode = BroadcastMode::BROADCAST_MODE_SYNC)
        : broadcast_mode(broadcast_mode)
    {
        if (config.indexer_rest_config) {
            indexer_rest_client = IndexerRestClient(config);
        }
        if (config.node_grpc_gateway_rest_config) {
            node_grpc_gateway_rest_client = NodeGrpcGatewayRestClient(config);
        }
    }

    // Transaction operations

    GasLimitEstimator GetGasLimitEstimator()
    {
        return [this](std::string message) {
            auto simulation_result = node_grpc_gateway_rest_client->Simulate(message);
            auto simulation_str = simulation_result.dump();
            auto gas_used_str = simulation_result["gas_info"]["gas_used"].get<std::string>();
            auto gas_used = stoull(gas_used_str);
            return static_cast<uint64_t>(gas_used * 1.65);
        };
    }

    nlohmann::json BroadcastTransaction(std::string transaction_bytes)
    {
        return node_grpc_gateway_rest_client->BroadcastTransaction(transaction_bytes, broadcast_mode);
    }

    nlohmann::json Simulate(std::string transaction_bytes)
    {
        return node_grpc_gateway_rest_client->Simulate(transaction_bytes);
    }

    nlohmann::json GetTransactionStatus(std::string tx_hash_hex)
    {
        return node_grpc_gateway_rest_client->GetTransactionStatus(tx_hash_hex);
    }

    // Filling order params

    template<typename Params_t>
    static uint32_t GetClientMetadata(const Params_t params) {
        switch (params.time_in_force) {
            case PlaceOrderTimeInForce::IOC:
            case PlaceOrderTimeInForce::FILL_OR_KILL:
                return 1;
            default:
                return 0;
        }
    }

    static uint32_t GetGoodTillTimestamp() {
        return static_cast<uint32_t>(std::time(0) + LONG_TERM_TIME_TO_LIVE_SECONDS);
    }

    BlockNumber GetGoodTillBlock() {
        return node_grpc_gateway_rest_client->GetLatestBlockHeight() + SHORT_TERM_TIME_TO_LIVE_BLOCKS;
    }

    LowLevelPlaceShortTermOrderParams ConvertToLowLevel(PlaceShortTermOrderParams params)
    {
        auto client_metadata = params.client_metadata ? *params.client_metadata : GetClientMetadata(params);
        return LowLevelPlaceShortTermOrderParams {
            .symbol = std::move(params.symbol),
            .side = params.side,
            .time_in_force = params.time_in_force,
            .order_cid = params.order_cid,
            .price = params.price,
            .size = params.size,
            .good_till_block = params.good_till_block ? *params.good_till_block : GetGoodTillBlock(),
            .reduce_only = params.reduce_only,
            .client_metadata = client_metadata,
        };
    }

    static LowLevelPlaceLongTermOrderParams ConvertToLowLevel(PlaceLongTermOrderParams params)
    {
        auto client_metadata = params.client_metadata ? *params.client_metadata : GetClientMetadata(params);
        return LowLevelPlaceLongTermOrderParams {
            .symbol = std::move(params.symbol),
            .side = params.side,
            .time_in_force = params.time_in_force,
            .order_cid = params.order_cid,
            .price = params.price,
            .size = params.size,
            .good_till_timestamp = params.good_till_timestamp ? *params.good_till_timestamp : GetGoodTillTimestamp(),
            .reduce_only = params.reduce_only,
            .conditional_order_params = params.conditional_order_params,
            .client_metadata = client_metadata,
        };
    }

    inline LowLevelCancelShortTermOrderParams ConvertToLowLevel(CancelShortTermOrderParams params)
    {
        return LowLevelCancelShortTermOrderParams {
            .symbol = std::move(params.symbol),
            .order_cid = params.order_cid,
            .good_till_block = params.good_till_block ? *params.good_till_block : GetGoodTillBlock(),
        };
    }

    static LowLevelCancelLongTermOrderParams ConvertToLowLevel(CancelLongTermOrderParams params)
    {
        return LowLevelCancelLongTermOrderParams {
            .symbol = std::move(params.symbol),
            .order_cid = params.order_cid,
            .good_till_timestamp = params.good_till_timestamp ? *params.good_till_timestamp : GetGoodTillTimestamp(),
            .conditional = params.conditional,
        };
    }

    // Placing and canceling orders

    nlohmann::json PlaceOrder(
        const ExchangeInfo& exchange_info, const AccountInfo& account_info, const PlaceShortTermOrderParams& params
    )
    {
        return BroadcastTransaction(CreatePlaceOrderMessage(exchange_info, account_info, ConvertToLowLevel(params)));
    }

    nlohmann::json PlaceOrder(
        const ExchangeInfo& exchange_info, AccountInfo& account_info, const PlaceLongTermOrderParams& params
    )
    {
        auto result =
            BroadcastTransaction(CreatePlaceOrderMessage(exchange_info, account_info, ConvertToLowLevel(params)));
        account_info.IncreaseSequence();
        return result;
    }

    nlohmann::json CancelOrder(
        const ExchangeInfo& exchange_info, const AccountInfo& account_info, const CancelShortTermOrderParams& params
    )
    {
        return BroadcastTransaction(CreateCancelOrderMessage(exchange_info, account_info, ConvertToLowLevel(params)));
    }

    nlohmann::json CancelOrder(
        const ExchangeInfo& exchange_info, AccountInfo& account_info, const CancelLongTermOrderParams& params
    )
    {
        auto result =
            BroadcastTransaction(CreateCancelOrderMessage(exchange_info, account_info, ConvertToLowLevel(params)));
        account_info.IncreaseSequence();
        return result;
    }

    // Balance operations

    nlohmann::json Transfer(
        const ExchangeInfo& exchange_info,
        AccountInfo& account_info,
        Subaccount recipient_subaccount,
        uint64_t amount,
        AssetId asset_id = ASSET_USDC
    )
    {
        auto result = BroadcastTransaction(CreateTransferMessage(
            exchange_info, account_info, GetGasLimitEstimator(), recipient_subaccount, amount, asset_id
        ));
        account_info.IncreaseSequence();
        return result;
    }

    nlohmann::json DepositToSubaccount(
        const ExchangeInfo& exchange_info, AccountInfo& account_info, Quantums quantums, AssetId asset_id = ASSET_USDC
    )
    {
        auto result = BroadcastTransaction(
            CreateDepositToSubaccountMessage(exchange_info, account_info, GetGasLimitEstimator(), quantums, asset_id)
        );
        account_info.IncreaseSequence();
        return result;
    }

    nlohmann::json WithdrawFromSubaccount(
        const ExchangeInfo& exchange_info, AccountInfo& account_info, Quantums quantums, AssetId asset_id = ASSET_USDC
    )
    {
        auto result = BroadcastTransaction(
            CreateWithdrawFromSubaccountMessage(exchange_info, account_info, GetGasLimitEstimator(), quantums, asset_id)
        );
        account_info.IncreaseSequence();
        return result;
    }

    BroadcastMode broadcast_mode;

    std::optional<IndexerRestClient> indexer_rest_client;
    std::optional<NodeGrpcGatewayRestClient> node_grpc_gateway_rest_client;
};

}  // namespace dydx_v4_client_lib
