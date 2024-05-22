#pragma once

#include <fmt/core.h>
#include <nlohmann/json.hpp>

#include <common/requests/base.h>
#include <common/requests/util.h>

#include <dydx_v4_futures/account_info.h>
#include <dydx_v4_futures/exchange_info.h>
#include <dydx_v4_futures/enums.h>

namespace dydx_v4_client_lib {

class IndexerRestClient : public common::RestClient {
public:
    using common::RestClient::RestClient;

    explicit IndexerRestClient(const ExchangeConfig& config)
        : IndexerRestClient(*config.indexer_rest_config)
    {}

    // Subaccounts

    nlohmann::json GetSubaccounts(Address address, std::optional<int> limit = std::nullopt)
    {
        return Get(common::UrlPath(fmt::format("/v4/addresses/{}", address)).AddArg("limit", limit).Get());
    }

    nlohmann::json GetSubaccount(Subaccount subaccount)
    {
        return Get(fmt::format(
            "/v4/addresses/{}/subaccountNumber/{}", subaccount.account_address, subaccount.subaccount_number
        ));
    }

    struct GetSubaccountPerpetualPositionsArgs {
        Subaccount subaccount;
        std::optional<std::string> status = std::nullopt;
        std::optional<int> limit = std::nullopt;
        std::optional<int> createdBeforeOrAtHeight = std::nullopt;
        std::optional<std::string> createdBeforeOrAt = std::nullopt;
    };

    nlohmann::json GetSubaccountPerpetualPositions(const GetSubaccountPerpetualPositionsArgs& args)
    {
        return Get(common::UrlPath("/v4/perpetualPositions")
                       .AddArg("address", args.subaccount.account_address)
                       .AddArg("subaccountNumber", args.subaccount.subaccount_number)
                       .AddArg("status", args.status)
                       .AddArg("limit", args.limit)
                       .AddArg("createdBeforeOrAtHeight", args.createdBeforeOrAtHeight)
                       .AddArg("createdBeforeOrAt", args.createdBeforeOrAt)
                       .Get());
    }

    struct GetSubaccountAssetPositionsArgs {
        Subaccount subaccount;
        std::optional<std::string> status = std::nullopt;
        std::optional<int> limit = std::nullopt;
        std::optional<int> createdBeforeOrAtHeight = std::nullopt;
        std::optional<std::string> createdBeforeOrAt = std::nullopt;
    };

    nlohmann::json GetSubaccountAssetPositions(const GetSubaccountAssetPositionsArgs& args)
    {
        return Get(common::UrlPath("/v4/assetPositions")
                       .AddArg("address", args.subaccount.account_address)
                       .AddArg("subaccountNumber", args.subaccount.subaccount_number)
                       .AddArg("status", args.status)
                       .AddArg("limit", args.limit)
                       .AddArg("createdBeforeOrAtHeight", args.createdBeforeOrAtHeight)
                       .AddArg("createdBeforeOrAt", args.createdBeforeOrAt)
                       .Get());
    }

    struct GetSubaccountTransfersArgs {
        Subaccount subaccount;
        std::optional<int> limit = std::nullopt;
        std::optional<int> createdBeforeOrAtHeight = std::nullopt;
        std::optional<std::string> createdBeforeOrAt = std::nullopt;
    };

    nlohmann::json GetSubaccountTransfers(const GetSubaccountTransfersArgs& args)
    {
        return Get(common::UrlPath("/v4/transfers")
                       .AddArg("address", args.subaccount.account_address)
                       .AddArg("subaccountNumber", args.subaccount.subaccount_number)
                       .AddArg("limit", args.limit)
                       .AddArg("createdBeforeOrAtHeight", args.createdBeforeOrAtHeight)
                       .AddArg("createdBeforeOrAt", args.createdBeforeOrAt)
                       .Get());
    }

    struct GetSubaccountOrdersArgs {
        Subaccount subaccount;
        std::optional<std::string> ticker = std::nullopt;
        std::optional<TickerType> tickerType = TickerType::PERPETUAL;
        std::optional<OrderSide> side = std::nullopt;
        std::optional<OrderStatus> status = std::nullopt;
        std::optional<OrderType> type = std::nullopt;
        std::optional<int> limit = std::nullopt;
        std::optional<int> goodTilBlockBeforeOrAt = std::nullopt;
        std::optional<std::string> goodTilBlockTimeBeforeOrAt = std::nullopt;
        std::optional<bool> returnLatestOrders = std::nullopt;
    };

    nlohmann::json GetSubaccountOrders(const GetSubaccountOrdersArgs& args)
    {
        return Get(common::UrlPath("/v4/orders")
                       .AddArg("address", args.subaccount.account_address)
                       .AddArg("subaccountNumber", args.subaccount.subaccount_number)
                       .AddArg("ticker", args.ticker)
                       .AddArg("tickerType", args.tickerType)
                       .AddArg("side", args.side)
                       .AddArg("status", args.status)
                       .AddArg("type", args.type)
                       .AddArg("limit", args.limit)
                       .AddArg("goodTilBlockBeforeOrAt", args.goodTilBlockBeforeOrAt)
                       .AddArg("goodTilBlockTimeBeforeOrAt", args.goodTilBlockTimeBeforeOrAt)
                       .AddArg("returnLatestOrders", args.returnLatestOrders)
                       .Get());
    }

    nlohmann::json GetOrder(OrderId order_id)
    {
        return Get(fmt::format("/v4/orders/{}", order_id));
    }

    struct GetSubaccountFillsArgs {
        Subaccount subaccount;
        std::optional<std::string> ticker = std::nullopt;
        std::optional<TickerType> tickerType = TickerType::PERPETUAL;
        std::optional<int> limit = std::nullopt;
        std::optional<int> createdBeforeOrAtHeight = std::nullopt;
        std::optional<std::string> createdBeforeOrAt = std::nullopt;
    };

    nlohmann::json GetSubaccountFills(const GetSubaccountFillsArgs& args)
    {
        return Get(common::UrlPath("/v4/fills")
                       .AddArg("address", args.subaccount.account_address)
                       .AddArg("subaccountNumber", args.subaccount.subaccount_number)
                       .AddArg("ticker", args.ticker)
                       .AddArg("tickerType", args.tickerType)
                       .AddArg("limit", args.limit)
                       .AddArg("createdBeforeOrAtHeight", args.createdBeforeOrAtHeight)
                       .AddArg("createdBeforeOrAt", args.createdBeforeOrAt)
                       .Get());
    }

    struct GetSubaccountHistoricalPNLsArgs {
        Subaccount subaccount;
        std::optional<std::string> effectiveBeforeOrAt = std::nullopt;
        std::optional<std::string> effectiveAtOrAfter = std::nullopt;
    };

    nlohmann::json GetSubaccountHistoricalPNLs(const GetSubaccountHistoricalPNLsArgs& args)
    {
        return Get(common::UrlPath("/v4/historical-pnl")
                       .AddArg("address", args.subaccount.account_address)
                       .AddArg("subaccountNumber", args.subaccount.subaccount_number)
                       .AddArg("effectiveBeforeOrAt", args.effectiveBeforeOrAt)
                       .AddArg("effectiveAtOrAfter", args.effectiveAtOrAfter)
                       .Get());
    }

    // Market requests

    nlohmann::json GetPerpetualMarkets()
    {
        return Get(fmt::format("/v4/perpetualMarkets"));
    }

    nlohmann::json GetPerpetualMarketOrderbook(std::string market)
    {
        return Get(fmt::format("/v4/orderbooks/perpetualMarket/{}", market));
    }

    struct GetPerpetualMarketTradesArgs {
        std::string market;
        std::optional<int> startingBeforeOrAtHeight = std::nullopt;
        std::optional<int> limit = std::nullopt;
    };

    nlohmann::json GetPerpetualMarketTrades(const GetPerpetualMarketTradesArgs& args)
    {
        return Get(common::UrlPath(fmt::format("/v4/trades/perpetualMarket/{}", args.market))
                       .AddArg("startingBeforeOrAtHeight", args.startingBeforeOrAtHeight)
                       .AddArg("limit", args.limit)
                       .Get());
    }

    struct GetPerpetualMarketCandlesArgs {
        std::string market;
        std::string resolution;
        std::optional<std::string> fromISO = std::nullopt;
        std::optional<std::string> toISO = std::nullopt;
        std::optional<int> limit = std::nullopt;
    };

    nlohmann::json GetPerpetualMarketCandles(const GetPerpetualMarketCandlesArgs& args)
    {
        return Get(common::UrlPath(fmt::format("/v4/candles/perpetualMarket/{}", args.market))
                       .AddArg("resolution", args.resolution)
                       .AddArg("fromISO", args.fromISO)
                       .AddArg("toISO", args.toISO)
                       .AddArg("limit", args.limit)
                       .Get());
    }

    struct GetPerpetualMarketHistoricalFundingArgs {
        std::string market;
        std::optional<std::string> effectiveBeforeOrAt = std::nullopt;
        std::optional<int> effectiveBeforeOrAtHeight = std::nullopt;
        std::optional<int> limit = std::nullopt;
    };

    nlohmann::json GetPerpetualMarketHistoricalFunding(const GetPerpetualMarketHistoricalFundingArgs& args)
    {
        return Get(common::UrlPath(fmt::format("/v4/historicalFunding/{}", args.market))
                       .AddArg("effectiveBeforeOrAt", args.effectiveBeforeOrAt)
                       .AddArg("effectiveBeforeOrAtHeight", args.effectiveBeforeOrAtHeight)
                       .AddArg("limit", args.limit)
                       .Get());
    }

    nlohmann::json GetPerpetualMarketSparklines(TimePeriod time_period = TimePeriod::ONE_DAY)
    {
        return Get(common::UrlPath("/v4/sparklines").AddArg("time_period", time_period).Get());
    }

    // Utility

    struct TimeResponse {
        double epoch;
        std::string iso;
    };

    /**
     * @description Get the current time of the Indexer
     * @returns {TimeResponse} isoString and epoch
     */

    TimeResponse GetTime()
    {
        auto response = Get("/v4/time");
        return TimeResponse {
            .epoch = response["epoch"].get<double>(),
            .iso = response["iso"].get<std::string>(),
        };
    }

    struct HeightResponse {
        BlockNumber height;
        std::string time;
    };

    /**
     * @description Get the block height of the most recent block processed by the Indexer
     * @returns {HeightResponse} block height and time
     */
    HeightResponse GetHeight()
    {
        auto response = Get("/v4/height");
        return HeightResponse {
            .height = static_cast<BlockNumber>(std::stoul(response["height"].get<std::string>())),
            .time = response["time"].get<std::string>(),
        };
    }

    struct ComplianceResponse {
        bool restricted;
    };

    /**
     * @description Screen an address to see if it is restricted
     * @param {Address} address evm or dydx address
     * @returns {ComplianceResponse} whether the specified address is restricted
     */
    ComplianceResponse Screen(const Address& address)
    {
        auto response = Get(fmt::format("/v4/screen?address={}", address));
        return ComplianceResponse {.restricted = response["restricted"].get<bool>()};
    }
};

}  // namespace dydx_v4_client_lib
