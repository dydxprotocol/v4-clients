#include "common/encoding/base64.h"

#include <cassert>
#include <stdexcept>

#include <openssl/evp.h>

namespace common {

class CtxRaiiWrapper {
public:
    CtxRaiiWrapper()
        : m_ctx(EVP_ENCODE_CTX_new())
    {}
    ~CtxRaiiWrapper()
    {
        if (m_ctx) {
            EVP_ENCODE_CTX_free(m_ctx);
            m_ctx = nullptr;
        }
    }

    EVP_ENCODE_CTX* GetCtx()
    {
        return m_ctx;
    }

private:
    EVP_ENCODE_CTX* m_ctx = nullptr;
};

std::string base64_encode(std::string_view view)
{
    int predicted_len = 4 * ((view.size() + 2) / 3);
    std::string output;
    output.resize(predicted_len + 1);  // +1 for NUL which EVP_EncodeBlock adds
    const auto output_len = EVP_EncodeBlock(
        reinterpret_cast<unsigned char*>(output.data()),
        reinterpret_cast<const unsigned char*>(view.data()),
        view.size()
    );
    assert(predicted_len == output_len);
    output.resize(output.size() - 1);  // remove trailing NUL
    return output;
}

std::string base64_decode(std::string_view view)
{
    CtxRaiiWrapper ctx_raii_wrapper {};
    EVP_ENCODE_CTX* ctx = ctx_raii_wrapper.GetCtx();

    assert(view.size() % 4 == 0);
    int predicted_len = 3 * view.size() / 4;
    std::string output;
    output.resize(predicted_len);
    EVP_DecodeInit(ctx);
    int len;
    int ret = EVP_DecodeUpdate(
        ctx,
        reinterpret_cast<unsigned char*>(output.data()),
        &len,
        reinterpret_cast<const unsigned char*>(view.data()),
        view.size()
    );
    if (ret < 0) {
        throw std::runtime_error("Could not decode base64");
    }
    assert(len <= predicted_len);
    assert(len + 2 >= predicted_len);
    int len_dummy;
    EVP_DecodeFinal(ctx, reinterpret_cast<unsigned char*>(output.data()), &len_dummy);
    assert(len_dummy == 0);
    output.resize(len);
    return output;
}

}  // namespace common
