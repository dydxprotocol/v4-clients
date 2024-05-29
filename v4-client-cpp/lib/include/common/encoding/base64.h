#pragma once

#include <string>
#include <string_view>

namespace common {

std::string base64_encode(std::string_view view);

std::string base64_decode(std::string_view view);

}  // namespace common
