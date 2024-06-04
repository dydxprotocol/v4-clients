#pragma once

#include <optional>
#include <sstream>
#include <string>
#include <string_view>
#include <type_traits>
#include <utility>

namespace common {

template <typename T, typename Enable = void>
struct is_optional : std::false_type {};

template <typename T>
struct is_optional<std::optional<T>> : std::true_type {};

template <typename T>
constexpr bool is_optional_v = is_optional<T>::value;

struct UrlPath {
    UrlPath(std::string_view base_path)
    {
        ss << base_path;
    }

    template <typename T>
    UrlPath AddArg(std::string_view arg_name, const T& arg_value) &&
    {
        char const prefix = first ? '?' : '&';
        if constexpr (is_optional_v<std::decay_t<T>>) {
            if (arg_value) {
                ss << prefix << arg_name << '=' << *arg_value;
                first = false;
            }
        } else {
            ss << prefix << arg_name << '=' << arg_value;
            first = false;
        }
        return std::move(*this);
    }

    std::string Get() const
    {
        return ss.str();
    }

    bool first = true;
    std::stringstream ss;
};

}  // namespace common
