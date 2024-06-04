#pragma once

#include <fmt/core.h>

#include <common/streams/base.h>

#include <dydx_v4_futures/enums.h>

namespace dydx_v4_client_lib {

class IndexerWsClient : public common::WsClient {
public:
    explicit IndexerWsClient(common::WsConfig config)
        : common::WsClient(config)
    {
        common::WsClient::SetMessageCallback([this](const std::string& message) {
            if (message == "PING") {
                SendMessage("PONG");
                return;
            }
            if (m_user_callback) {
                m_user_callback(message);
            }
        });
    }

    explicit IndexerWsClient(const ExchangeConfig& config)
        : IndexerWsClient(*config.indexer_ws_config)
    {}

    IndexerWsClient(IndexerWsClient&&) = delete;
    IndexerWsClient(const IndexerWsClient&) = delete;
    IndexerWsClient& operator=(IndexerWsClient&&) = delete;
    IndexerWsClient& operator=(const IndexerWsClient&) = delete;

    void SetMessageCallback(MessageCallback callback) override
    {
        if (m_user_callback) {
            throw std::runtime_error("Message callback already set");
        }
        m_user_callback = std::move(callback);
    }

    void Subscribe(std::string channel, std::optional<std::string> id = std::nullopt, bool batched = false)
    {
        SendMessage(fmt::format(
            R"({{"type":"subscribe","channel":"{}"{}{}}})",
            channel,
            id ? fmt::format(R"(,"id":"{}")", *id) : "",
            batched ? ",\"batched\":true" : ""
        ));
    }

    void Unsubscribe(std::string channel, std::optional<std::string> id = std::nullopt)
    {
        SendMessage(fmt::format(
            R"({{"type":"unsubscribe","channel":"{}"{}}})", channel, id ? fmt::format(R"(,"id":"{}")", *id) : ""
        ));
    }

    void SubscribeToMarkets()
    {
        Subscribe("v4_markets");
    }

    void UnsubscribeFromMarkets()
    {
        Unsubscribe("v4_markets");
    }

    void SubscribeToTrades(std::string market, bool batched = true)
    {
        Subscribe("v4_trades", /*id=*/market, /*batched=*/batched);
    }

    void UnsubscribeFromTrades(std::string market)
    {
        Unsubscribe("v4_trades", /*id=*/market);
    }

    void SubscribeToOrderbook(std::string market, bool batched = true)
    {
        Subscribe("v4_orderbook", /*id=*/market, /*batched=*/batched);
    }

    void UnsubscribeFromOrderbook(std::string market)
    {
        Unsubscribe("v4_orderbook", /*id=*/market);
    }

    void SubscribeToCandles(std::string market, CandlesResolution resolution)
    {
        auto id = market + "/" + to_string(resolution);
        Subscribe("v4_candles", /*id=*/id, /*batched=*/true);
    }

    void UnsubscribeFromCandles(std::string market, CandlesResolution resolution)
    {
        auto id = market + "/" + to_string(resolution);
        Unsubscribe("v4_candles", /*id=*/id);
    }

    void SubscribeToSubaccount(const Subaccount& subaccount)
    {
        auto id = subaccount.account_address + "/" + std::to_string(subaccount.subaccount_number);
        Subscribe("v4_subaccounts", /*id=*/id);
    }

    void UnsubscribeFromSubaccount(const Subaccount& subaccount)
    {
        auto id = subaccount.account_address + "/" + std::to_string(subaccount.subaccount_number);
        Unsubscribe("v4_subaccounts", /*id=*/id);
    }

private:
    MessageCallback m_user_callback;
};

}  // namespace dydx_v4_client_lib
