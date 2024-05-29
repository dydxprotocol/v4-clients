#include "common/streams/base.h"

#include <cstdlib>
#include <functional>
#include <iostream>
#include <memory>
#include <string>

#include <boost/asio/buffer.hpp>
#include <boost/asio/spawn.hpp>
#include <boost/beast/core.hpp>
#include <boost/beast/core/stream_traits.hpp>
#include <boost/beast/ssl.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/beast/websocket/ssl.hpp>

namespace common {

namespace beast = boost::beast;          // from <boost/beast.hpp>
namespace http = beast::http;            // from <boost/beast/http.hpp>
namespace websocket = beast::websocket;  // from <boost/beast/websocket.hpp>
namespace net = boost::asio;             // from <boost/asio.hpp>
namespace ssl = boost::asio::ssl;        // from <boost/asio/ssl.hpp>
using tcp = boost::asio::ip::tcp;        // from <boost/asio/ip/tcp.hpp>

// Report a failure
void fail(beast::error_code ec, char const* what)
{
    std::cerr << what << ": " << ec.message() << "\n";
}

WsClient::WsClient(WsConfig config)
    : m_config(std::move(config)), m_ws(m_ioc, m_ctx)
{
    m_ctx.set_verify_mode(ssl::verify_none);
}

void WsClient::SetMessageCallback(MessageCallback callback)
{
    if (m_callback) {
        throw std::runtime_error("WS message callback already set");
    }
    m_callback = std::move(callback);
}

void WsClient::Run()
{
    // Launch the asynchronous operation
    boost::asio::spawn(
        m_ioc,
        [this](net::yield_context yield) { this->RunSession(yield); },
        // on completion, spawn will call this function
        [](std::exception_ptr ex) {
            // if an exception occurred in the coroutine,
            // it's something critical, e.g. out of memory
            // we capture normal errors in the ec
            // so we just rethrow the exception here,
            // which will cause `ioc.run()` to throw
            if (ex) {
                std::rethrow_exception(ex);
            }
        }
    );

    // Run the I/O service. The call will return when
    // the socket is closed.
    m_ioc.run();
}

void WsClient::RunSession(net::yield_context yield)
{
    beast::error_code ec;

    // These objects perform our I/O
    tcp::resolver resolver(m_ioc);

    // Look up the domain name
    auto const results = resolver.async_resolve(m_config.host, std::to_string(m_config.port), yield[ec]);
    if (ec) {
        return fail(ec, "resolve");
    }

    // Set a timeout on the operation
    beast::get_lowest_layer(m_ws).expires_after(std::chrono::seconds(30));

    // Make the connection on the IP address we get from a lookup
    auto ep = beast::get_lowest_layer(m_ws).async_connect(results, yield[ec]);
    if (ec) {
        return fail(ec, "connect");
    }

    // Set SNI Hostname (many hosts need this to handshake successfully)
    if (!SSL_set_tlsext_host_name(m_ws.next_layer().native_handle(), m_config.host.c_str())) {
        ec = beast::error_code(static_cast<int>(::ERR_get_error()), net::error::get_ssl_category());
        return fail(ec, "connect");
    }

    // Set a timeout on the operation
    beast::get_lowest_layer(m_ws).expires_after(std::chrono::seconds(30));

    // Set a decorator to change the User-Agent of the handshake
    m_ws.set_option(websocket::stream_base::decorator([](websocket::request_type& req) {
        req.set(http::field::user_agent, std::string(BOOST_BEAST_VERSION_STRING) + " websocket-client-coro");
    }));

    // Perform the SSL handshake
    m_ws.next_layer().async_handshake(ssl::stream_base::client, yield[ec]);
    if (ec) {
        return fail(ec, "ssl_handshake");
    }

    // Turn off the timeout on the tcp_stream, because
    // the websocket stream has its own timeout system.
    beast::get_lowest_layer(m_ws).expires_never();

    // Set suggested timeout settings for the websocket
    m_ws.set_option(websocket::stream_base::timeout::suggested(beast::role_type::client));

    // Perform the websocket handshake
    m_ws.async_handshake(m_config.host + ':' + std::to_string(ep.port()), m_config.path, yield[ec]);
    if (ec) {
        return fail(ec, "handshake");
    }

    // This buffer will hold the incoming message
    beast::flat_buffer buffer;

    while (true) {
        // Read a message into our buffer
        m_ws.async_read(buffer, yield[ec]);
        if (m_callback) {
            m_callback(beast::buffers_to_string(buffer.data()));
        }
        buffer.clear();
        if (ec) {
            return fail(ec, "read");
        }
    }

    // Close the WebSocket connection
    m_ws.async_close(websocket::close_code::normal, yield[ec]);
    if (ec) {
        return fail(ec, "close");
    }
}

void WsClient::SendMessage(std::string message)
{
    m_write_strand
        .dispatch([this, message = std::move(message)]() { m_ws.write(net::buffer(message)); }, std::allocator<void>());
}

}  // namespace common
