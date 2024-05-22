#pragma once

#include <cstdint>
#include <string>

#include <nlohmann/json.hpp>

namespace common {

struct RestConfig {
    std::string host;
    uint16_t port = 443;
    bool use_tls = true;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(RestConfig, host, port, use_tls)

class RestClient {
public:
    explicit RestClient(RestConfig config);

    [[nodiscard]]
    nlohmann::json Get(std::string path, std::string body = "");
    [[nodiscard]]
    nlohmann::json Post(std::string path, std::string body = "");

private:
    RestConfig m_config;
};

}  // namespace common
