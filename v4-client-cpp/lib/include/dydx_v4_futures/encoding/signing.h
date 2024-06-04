#pragma once

#include <string>
#include <string_view>

#include <common/types.h>

namespace dydx_v4_client_lib {

std::string Sign(std::string_view message, const common::BytesVec& private_key);

}  // namespace dydx_v4_client_lib
