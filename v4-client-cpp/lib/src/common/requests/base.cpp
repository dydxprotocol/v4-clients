#include "common/requests/base.h"

#include <string>
#include <utility>

#include <boost/asio/connect.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/asio/ssl/error.hpp>
#include <boost/asio/ssl/stream.hpp>
#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/beast/ssl.hpp>
#include <boost/beast/version.hpp>

namespace common {

RestClient::RestClient(RestConfig config)
    : m_config(std::move(config))
{}

std::string request(const RestConfig& config, boost::beast::http::verb verb, std::string path, std::string body)
{
    namespace beast = boost::beast;  // from <boost/beast.hpp>
    namespace http = beast::http;    // from <boost/beast/http.hpp>
    namespace net = boost::asio;     // from <boost/asio.hpp>
    namespace ssl = net::ssl;        // from <boost/asio/ssl.hpp>
    using tcp = net::ip::tcp;        // from <boost/asio/ip/tcp.hpp>

    // The io_context is required for all I/O
    net::io_context ioc;

    // These objects perform our I/O
    tcp::resolver resolver(ioc);

    // Set up request
    http::request<http::string_body> req {verb, path, 11, body};
    req.set(http::field::host, config.host);
    req.set(http::field::user_agent, BOOST_BEAST_VERSION_STRING);
    req.set(http::field::accept, "application/json");
    if (!body.empty()) {
        req.set(http::field::content_type, "application/json");
        req.prepare_payload();
    }

    // Look up the domain name
    auto const results = resolver.resolve(config.host, std::to_string(config.port));

    // This buffer is used for reading and must be persisted
    beast::flat_buffer buffer;

    // Declare a container to hold the response
    http::response<http::string_body> res;

    if (config.use_tls) {
        // The SSL context is required, and holds certificates
        ssl::context ctx(ssl::context::tlsv12_client);

        // NB: we do not verify remote server's certificate
        // ctx.set_verify_mode(ssl::verify_peer);
        ctx.set_verify_mode(ssl::verify_none);

        beast::ssl_stream<beast::tcp_stream> stream(ioc, ctx);

        // Set SNI Hostname (many hosts need this to handshake successfully)
        if (!SSL_set_tlsext_host_name(stream.native_handle(), config.host.c_str())) {
            beast::error_code ec {static_cast<int>(::ERR_get_error()), net::error::get_ssl_category()};
            throw beast::system_error {ec};
        }

        // Make the connection on the IP address we get from a lookup
        beast::get_lowest_layer(stream).connect(results);

        // Perform the SSL handshake
        stream.handshake(ssl::stream_base::client);

        // Send the HTTP request to the remote host
        http::write(stream, req);

        // Receive the HTTP response
        http::read(stream, buffer, res);

        // Gracefully close the stream
        beast::error_code ec;
        stream.shutdown(ec);
        if (ec == net::error::eof) {
            // Rationale:
            // http://stackoverflow.com/questions/25587403/boost-asio-ssl-async-shutdown-always-finishes-with-an-error
            ec = {};
        }
        if (ec == ssl::error::stream_truncated) {
            // Rationale:
            // https://github.com/boostorg/beast/issues/824
            ec = {};
        }
        if (ec) {
            throw beast::system_error {ec};
        }

        return res.body();
    } else {
        beast::tcp_stream stream(ioc);

        // Make the connection on the IP address we get from a lookup
        stream.connect(results);

        // Send the HTTP request to the remote host
        http::write(stream, req);

        // Receive the HTTP response
        http::read(stream, buffer, res);

        // Gracefully close the socket
        beast::error_code ec;
        stream.socket().shutdown(tcp::socket::shutdown_both, ec);

        // not_connected happens sometimes
        // so don't bother reporting it.
        //
        if (ec && ec != beast::errc::not_connected) {
            throw beast::system_error {ec};
        }

        return res.body();
    }
}

nlohmann::json RestClient::Get(std::string path, std::string body)
{
    auto response = request(m_config, boost::beast::http::verb::get, std::move(path), std::move(body));
    if (response.empty()) {
        return nullptr;
    }
    return nlohmann::json::parse(response);
}

nlohmann::json RestClient::Post(std::string path, std::string body)
{
    auto response = request(m_config, boost::beast::http::verb::post, std::move(path), std::move(body));
    if (response.empty()) {
        return nullptr;
    }
    return nlohmann::json::parse(response);
}

}  // namespace common
