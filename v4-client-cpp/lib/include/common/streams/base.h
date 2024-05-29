#pragma once

#include <cstdint>
#include <functional>
#include <string>

#include <boost/asio/spawn.hpp>
#include <boost/asio/ssl/context.hpp>
#include <boost/beast/core/tcp_stream.hpp>
#include <boost/beast/ssl/ssl_stream.hpp>
#include <boost/beast/websocket/stream.hpp>
#include <nlohmann/json.hpp>

namespace common {

struct WsConfig {
    std::string host;
    uint16_t port = 443;
    std::string path = "/v4/ws";
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(WsConfig, host, port, path)

class WsClient {
public:
    using MessageCallback = std::function<void(std::string)>;

    explicit WsClient(WsConfig config);
    WsClient(WsClient&&) = delete;
    WsClient(const WsClient&) = delete;
    WsClient& operator=(WsClient&&) = delete;
    WsClient& operator=(const WsClient&) = delete;

    virtual void SetMessageCallback(MessageCallback callback);

    void SendMessage(std::string message);

    void Run();

private:
    void RunSession(boost::asio::yield_context yield);

    WsConfig m_config;
    MessageCallback m_callback;

    boost::asio::io_context m_ioc;
    boost::asio::strand<boost::asio::io_context::executor_type> m_write_strand {boost::asio::make_strand(m_ioc)};

    // The SSL context is required, and holds certificates
    boost::asio::ssl::context m_ctx {boost::asio::ssl::context::tlsv12_client};

    boost::beast::websocket::stream<boost::beast::ssl_stream<boost::beast::tcp_stream>> m_ws;
};

}  // namespace common
