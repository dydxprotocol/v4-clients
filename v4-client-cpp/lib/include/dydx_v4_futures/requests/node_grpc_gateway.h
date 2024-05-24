#pragma once

#include <cstdint>
#include <optional>
#include <string>
#include <string_view>

#include <fmt/core.h>
#include <nlohmann/json.hpp>

#include <common/encoding/base64.h>
#include <common/requests/base.h>
#include <common/requests/util.h>

#include <dydx_v4_futures/account_info.h>
#include <dydx_v4_futures/enums.h>
#include <dydx_v4_futures/types.h>

namespace dydx_v4_client_lib {

struct Pagination {
    // key is a value returned in PageResponse.next_key to begin
    // querying the next page most efficiently. Only one of offset or key
    // should be set.
    std::optional<std::string> key = std::nullopt;

    // offset is a numeric offset that can be used when key is unavailable.
    // It is less efficient than using key. Only one of offset or key should
    // be set.
    std::optional<uint64_t> offset = std::nullopt;

    // limit is the total number of results to be returned in the result page.
    // If left empty it will default to a value to be set by each app.
    std::optional<uint64_t> limit = std::nullopt;

    // count_total is set to true  to indicate that the result set should include
    // a count of the total number of items available for pagination in UIs.
    // count_total is only respected when offset is used. It is ignored when key
    // is set.
    std::optional<bool> count_total = std::nullopt;

    // reverse is set to true if results are to be returned in the descending order.
    //
    // Since: cosmos-sdk 0.43
    std::optional<bool> reverse = std::nullopt;
};

inline common::UrlPath UrlPathWithPagination(std::string_view base_path, const Pagination& pagination)
{
    return common::UrlPath(base_path)
        .AddArg("pagination.key", pagination.key)
        .AddArg("pagination.offset", pagination.offset)
        .AddArg("pagination.limit", pagination.limit)
        .AddArg("pagination.count_total", pagination.count_total)
        .AddArg("pagination.reverse", pagination.reverse);
}

class NodeGrpcGatewayRestClient : public common::RestClient {
public:
    using common::RestClient::RestClient;

    explicit NodeGrpcGatewayRestClient(const ExchangeConfig& config)
        : NodeGrpcGatewayRestClient(*config.node_grpc_gateway_rest_config)
    {}

    nlohmann::json BroadcastTransaction(
        std::string transaction_bytes, BroadcastMode broadcast_mode = BroadcastMode::BROADCAST_MODE_SYNC
    )
    {
        auto body = fmt::format(
            R"({{"txBytes":"{}","mode":"{}"}})", common::base64_encode(transaction_bytes), to_string(broadcast_mode)
        );
        return Post("/cosmos/tx/v1beta1/txs", body);
    }

    nlohmann::json Simulate(std::string transaction_bytes)
    {
        auto body = fmt::format(R"({{"txBytes":"{}"}})", common::base64_encode(transaction_bytes));
        return Post("/cosmos/tx/v1beta1/simulate", body);
    }

    nlohmann::json GetTransactionStatus(std::string tx_hash_hex)
    {
        return Get(fmt::format("/cosmos/tx/v1beta1/txs/{}", tx_hash_hex));
    }

    nlohmann::json GetBlockByHeight(BlockNumber height)
    {
        return Get(fmt::format("/cosmos/base/tendermint/v1beta1/blocks/{}", height));
    }

    /**
     * @description Get latest block
     *
     * @returns last block
     */
    nlohmann::json GetLatestBlock()
    {
        return Get("/cosmos/base/tendermint/v1beta1/blocks/latest")["block"];
    }

    /**
     * @description Get latest block
     *
     * @returns last block
     */
    BlockNumber GetLatestBlockHeight()
    {
        auto block = GetLatestBlock();
        return static_cast<BlockNumber>(std::stoul(block["header"]["height"].get<std::string>()));
    }

    /**
     * @description Get all fee tier params.
     *
     * @returns All fee tier params.
     */
    nlohmann::json GetFeeTiers()
    {
        return Get("/dydxprotocol/v4/feetiers/perpetual_fee_params");
    }

    /**
     * @description Get fee tier the user belongs to
     *
     * @returns the fee tier user belongs to.
     */
    nlohmann::json GetUserFeeTier(Address address)
    {
        return Get(fmt::format("/dydxprotocol/v4/feetiers/user_fee_tier?user={}", address));
    }

    /**
     * @description Get get trading stats
     *
     * @returns the user's taker and maker volume
     */
    nlohmann::json GetUserStats(Address address)
    {
        return Get(fmt::format("/dydxprotocol/v4/stats/user_stats?user={}", address));
    }

    /**
     * @description Get all balances for an account.
     *
     * @returns Array of Coin balances for all tokens held by an account.
     */
    nlohmann::json GetAccountBalances(Address address)
    {
        return Get(fmt::format("/cosmos/bank/v1beta1/balances/{}", address));
    }

    /**
     * @description Get balances of one denom for an account.
     *
     * @returns Coin balance for denom tokens held by an account.
     */
    nlohmann::json GetAccountBalance(Address address)
    {
        return Get(fmt::format("/cosmos/bank/v1beta1/balances/{}/by_denom", address));
    }

    /**
     * @description Get all subaccounts
     *
     * @returns All subaccounts
     */
    nlohmann::json GetSubaccounts(const Pagination& pagination = {})
    {
        return Get(UrlPathWithPagination("/dydxprotocol/subaccounts/subaccount", pagination).Get());
    }

    /**
     * @description Get a specific subaccount for an account.
     *
     * @returns Subaccount for account with given accountNumber or default subaccount if none exists.
     */
    nlohmann::json GetSubaccount(Subaccount subaccount)
    {
        return Get(fmt::format(
            "/dydxprotocol/subaccounts/subaccount/{}/{}", subaccount.account_address, subaccount.subaccount_number
        ));
    }

    /**
     * @description Get the params for the rewards module.
     *
     * @returns Params for the rewards module.
     */
    nlohmann::json GetRewardsParams()
    {
        return Get("/dydxprotocol/v4/rewards/params");
    }

    /**
     * @description Get all Clob Pairs.
     *
     * @returns Information on all Clob Pairs.
     */
    nlohmann::json GetAllClobPairs(const Pagination& pagination = {})
    {
        return Get(UrlPathWithPagination("/dydxprotocol/clob/clob_pair", pagination).Get());
    }

    /**
     * @description Get Clob Pair for an Id or the promise is rejected if no pair exists.
     *
     * @returns Clob Pair for a given Clob Pair Id.
     */
    nlohmann::json GetClobPair(ClobPairId id)
    {
        return Get(fmt::format("/dydxprotocol/clob/clob_pair/{}", id));
    }

    /**
     * @description Get all Prices across markets.
     *
     * @returns Prices across all markets.
     */
    nlohmann::json GetAllPrices(const Pagination& pagination = {})
    {
        return Get(UrlPathWithPagination("/dydxprotocol/prices/market", pagination).Get());
    }

    /**
     * @description Get Price for a clob Id or the promise is rejected if none exists.
     *
     * @returns Price for a given Market Id.
     */
    nlohmann::json GetPrice(uint32_t market_id)
    {
        return Get(fmt::format("/dydxprotocol/prices/market/{}", market_id));
    }

    /**
     * @description Get all Perpetuals.
     *
     * @returns Information on all Perpetual pairs.
     */
    nlohmann::json GetAllPerpetuals(const Pagination& pagination = {})
    {
        return Get(UrlPathWithPagination("/dydxprotocol/perpetuals/perpetual", pagination).Get());
    }

    /**
     * @description Get Perpetual for an Id or the promise is rejected if none exists.
     *
     * @returns The Perpetual for a given Perpetual Id.
     */
    nlohmann::json GetPerpetual(uint32_t perpetual_id)
    {
        return Get(fmt::format("/dydxprotocol/perpetuals/perpetual/{}", perpetual_id));
    }

    /**
     * @description Get Account for an address or the promise is rejected if the account
     * does not exist on-chain.
     *
     * @returns An account for a given address.
     */
    nlohmann::json GetAccount(Address address)
    {
        return Get(fmt::format("/cosmos/auth/v1beta1/accounts/{}", address));
    }

    /**
     * @description Get equity tier limit configuration.
     *
     * @returns Information on all equity tiers that are configured.
     */
    nlohmann::json GetEquityTierLimitConfiguration()
    {
        return Get("/dydxprotocol/clob/equity_tier");
    }

    /**
     * @description Get all delegations from a delegator.
     *
     * @returns All delegations from a delegator.
     */
    nlohmann::json GetDelegatorDelegations(std::string delegator_address, const Pagination& pagination = {})
    {
        return Get(
            UrlPathWithPagination(fmt::format("/cosmos/staking/v1beta1/delegations/{}", delegator_address), pagination)
                .Get()
        );
    }

    /**
     * @description Get all unbonding delegations from a delegator.
     *
     * @returns All unbonding delegations from a delegator.
     */
    nlohmann::json GetDelegatorUnbondingDelegations(std::string delegator_address, const Pagination& pagination = {})
    {
        return Get(UrlPathWithPagination(
                       fmt::format("/cosmos/staking/v1beta1/delegators/{}/unbonding_delegations", delegator_address),
                       pagination
        )
                       .Get());
    }

    /**
     * @description Get all validators of a status.
     *
     * @returns all validators of a status.
     */
    nlohmann::json GetAllValidators(
        std::optional<ValidatorStatus> status = std::nullopt, const Pagination& pagination = {}
    )
    {
        return Get(
            UrlPathWithPagination("/cosmos/staking/v1beta1/validators", pagination).AddArg("status", status).Get()
        );
    }
};

}  // namespace dydx_v4_client_lib
