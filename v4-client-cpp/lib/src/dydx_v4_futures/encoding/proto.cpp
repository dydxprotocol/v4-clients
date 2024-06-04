#include "dydx_v4_futures/encoding/proto.h"

#include <cassert>
#include <cstdint>
#include <string>

#include <cosmos/crypto/secp256k1/keys.pb.h>
#include <cosmos/tx/signing/v1beta1/signing.pb.h>
#include <cosmos/tx/v1beta1/tx.pb.h>
#include <dydxprotocol/clob/order.pb.h>

#include <dydx_v4_futures/constants.h>
#include <dydx_v4_futures/encoding/proto_constructors.h>
#include <dydx_v4_futures/encoding/signing.h>
#include <dydx_v4_futures/enums.h>

namespace dydx_v4_client_lib {

cosmos::tx::v1beta1::Tx SignMessageProto(
    const ExchangeInfo& exchange_info,
    const AccountInfo& account_info,
    const google::protobuf::Message& message,
    uint64_t gas_limit
)
{
    cosmos::tx::v1beta1::Tx tx;
    tx.mutable_body()->add_messages()->PackFrom(message, "/");
    tx.mutable_auth_info()->mutable_fee()->set_gas_limit(gas_limit);
    auto& amount = *tx.mutable_auth_info()->mutable_fee()->add_amount();
    uint64_t fee = std::ceil(gas_limit * exchange_info.GetFeeMinimumGasPrice());
    *amount.mutable_amount() = std::to_string(fee);
    *amount.mutable_denom() = exchange_info.GetFeeDenom();
    auto& signer_info = *tx.mutable_auth_info()->add_signer_infos();
    cosmos::crypto::secp256k1::PubKey pub_key;
    const auto& pub_key_bytes = account_info.GetPublicKey();
    std::string const pub_key_string(pub_key_bytes.data(), pub_key_bytes.data() + pub_key_bytes.size());
    *pub_key.mutable_key() = pub_key_string;
    signer_info.mutable_public_key()->PackFrom(pub_key, "/");
    signer_info.mutable_mode_info()->mutable_single()->set_mode(cosmos::tx::signing::v1beta1::SIGN_MODE_DIRECT);
    signer_info.set_sequence(account_info.GetSequence());

    cosmos::tx::v1beta1::SignDoc sign_doc;
    *sign_doc.mutable_body_bytes() = tx.body().SerializeAsString();
    *sign_doc.mutable_auth_info_bytes() = tx.auth_info().SerializeAsString();
    *sign_doc.mutable_chain_id() = exchange_info.GetChainId();
    sign_doc.set_account_number(account_info.GetAccountNumber());

    auto signature = Sign(sign_doc.SerializeAsString(), account_info.GetPrivateKey());
    tx.add_signatures(signature.data(), signature.size());

    return tx;
}

std::string SignMessage(
    const ExchangeInfo& exchange_info,
    const AccountInfo& account_info,
    const google::protobuf::Message& message,
    std::optional<uint64_t> gas_limit,
    GasLimitEstimator estimator
)
{
    if (!gas_limit) {
        gas_limit = estimator(SignMessage(exchange_info, account_info, message, 0));
    }
    auto tx = SignMessageProto(exchange_info, account_info, message, *gas_limit);
    std::string result;
    tx.SerializeToString(&result);
    return result;
}

dydxprotocol::clob::Order_Side ToProtoOrderSide(OrderSide side)
{
    switch (side) {
        case OrderSide::BUY:
            return dydxprotocol::clob::Order_Side_SIDE_BUY;
        case OrderSide::SELL:
            return dydxprotocol::clob::Order_Side_SIDE_SELL;
    }
    assert(false);
}

dydxprotocol::clob::Order_TimeInForce ToProtoTimeInForce(PlaceOrderTimeInForce time_in_force)
{
    switch (time_in_force) {
        case PlaceOrderTimeInForce::UNSPECIFIED:
            return dydxprotocol::clob::Order_TimeInForce_TIME_IN_FORCE_UNSPECIFIED;
        case PlaceOrderTimeInForce::IOC:
            return dydxprotocol::clob::Order_TimeInForce_TIME_IN_FORCE_IOC;
        case PlaceOrderTimeInForce::POST_ONLY:
            return dydxprotocol::clob::Order_TimeInForce_TIME_IN_FORCE_POST_ONLY;
        case PlaceOrderTimeInForce::FILL_OR_KILL:
            return dydxprotocol::clob::Order_TimeInForce_TIME_IN_FORCE_FILL_OR_KILL;
    }
    assert(false);
}

Quantums ToProtoQuantums(common::Quantity size, const InstrumentInfo& info)
{
    auto raw_quantums = size * std::pow(10, -1 * info.atomic_resolution);
    auto quantums = static_cast<uint64_t>(info.step_base_quantums * std::round(raw_quantums / info.step_base_quantums));
    return std::max(quantums, info.step_base_quantums);
}

Quantums ToProtoQuantumsUSDC(common::Quantity size)
{
    return static_cast<Quantums>(size * std::pow(10, -1 * QUOTE_QUANTUMS_ATOMIC_RESOLUTION));
}

Subticks ToProtoSubticks(common::Price price, const InstrumentInfo& info)
{
    auto exponent = info.atomic_resolution - info.quantum_conversion_exponent - QUOTE_QUANTUMS_ATOMIC_RESOLUTION;
    auto raw_subticks = price * std::pow(10, exponent);
    auto subticks = static_cast<uint64_t>(info.subticks_per_tick * std::round(raw_subticks / info.subticks_per_tick));
    return std::max(subticks, info.subticks_per_tick);
}

std::string CreatePlaceOrderMessage(
    const ExchangeInfo& exchange_info, const AccountInfo& account_info, const LowLevelPlaceShortTermOrderParams& params
)
{
    auto info = exchange_info.GetInstrumentInfo(params.symbol);

    return SignMessage(
        exchange_info,
        account_info,
        CreateProtoMsgPlaceOrder(
            account_info.GetAccountAddress(),
            account_info.GetSubaccountNumber(),
            params.order_cid,
            info.clob_pair_id,
            ToProtoOrderSide(params.side),
            ToProtoTimeInForce(params.time_in_force),
            ToProtoQuantums(params.size, info),
            ToProtoSubticks(params.price, info),
            params.good_till_block,
            dydxprotocol::clob::Order_ConditionType_CONDITION_TYPE_UNSPECIFIED,
            0,
            params.reduce_only,
            /*long_term=*/false,
            params.client_metadata
        ),
        /*gas_limit=*/0
    );
}

dydxprotocol::clob::Order_ConditionType ToProtoConditionType(ConditionType condition_type)
{
    switch (condition_type) {
        case ConditionType::STOP_LOSS:
            return dydxprotocol::clob::Order_ConditionType_CONDITION_TYPE_STOP_LOSS;
        case ConditionType::TAKE_PROFIT:
            return dydxprotocol::clob::Order_ConditionType_CONDITION_TYPE_TAKE_PROFIT;
    }
    assert(false);
}

std::string CreatePlaceOrderMessage(
    const ExchangeInfo& exchange_info, const AccountInfo& account_info, const LowLevelPlaceLongTermOrderParams& params
)
{
    auto info = exchange_info.GetInstrumentInfo(params.symbol);

    return SignMessage(
        exchange_info,
        account_info,
        CreateProtoMsgPlaceOrder(
            account_info.GetAccountAddress(),
            account_info.GetSubaccountNumber(),
            params.order_cid,
            info.clob_pair_id,
            ToProtoOrderSide(params.side),
            ToProtoTimeInForce(params.time_in_force),
            ToProtoQuantums(params.size, info),
            ToProtoSubticks(params.price, info),
            params.good_till_timestamp,
            params.conditional_order_params.has_value()
                ? ToProtoConditionType(params.conditional_order_params->condition_type)
                : dydxprotocol::clob::Order_ConditionType_CONDITION_TYPE_UNSPECIFIED,
            params.conditional_order_params.has_value()
                ? ToProtoSubticks(params.conditional_order_params->trigger_price, info)
                : 0,
            params.reduce_only,
            /*long_term=*/true,
            params.client_metadata
        ),
        /*gas_limit=*/0
    );
}

std::string CreateCancelOrderMessage(
    const ExchangeInfo& exchange_info, const AccountInfo& account_info, const LowLevelCancelShortTermOrderParams& params
)
{
    auto info = exchange_info.GetInstrumentInfo(params.symbol);

    return SignMessage(
        exchange_info,
        account_info,
        CreateProtoMsgCancelOrder(
            account_info.GetAccountAddress(),
            account_info.GetSubaccountNumber(),
            params.order_cid,
            info.clob_pair_id,
            params.good_till_block,
            /*conditional=*/false,
            /*long_term*=*/false
        ),
        /*gas_limit=*/0
    );
}

std::string CreateCancelOrderMessage(
    const ExchangeInfo& exchange_info, const AccountInfo& account_info, const LowLevelCancelLongTermOrderParams& params
)
{
    auto info = exchange_info.GetInstrumentInfo(params.symbol);

    return SignMessage(
        exchange_info,
        account_info,
        CreateProtoMsgCancelOrder(
            account_info.GetAccountAddress(),
            account_info.GetSubaccountNumber(),
            params.order_cid,
            info.clob_pair_id,
            params.good_till_timestamp,
            /*conditional=*/params.conditional,
            /*long_term*=*/true
        ),
        /*gas_limit=*/0
    );
}

std::string CreateTransferMessage(
    const ExchangeInfo& exchange_info,
    const AccountInfo& account_info,
    GasLimitEstimator estimator,
    Subaccount recipient_subaccount,
    common::Quantity amount,
    AssetId asset_id
)
{
    assert(asset_id == ASSET_USDC);
    return SignMessage(
        exchange_info,
        account_info,
        CreateProtoMsgCreateTransfer(
            account_info.GetAccountAddress(),
            account_info.GetSubaccountNumber(),
            recipient_subaccount.account_address,
            recipient_subaccount.subaccount_number,
            ToProtoQuantumsUSDC(amount),
            asset_id
        ),
        /*gas_limit=*/std::nullopt,
        estimator
    );
}

std::string CreateDepositToSubaccountMessage(
    const ExchangeInfo& exchange_info,
    const AccountInfo& account_info,
    GasLimitEstimator estimator,
    common::Quantity amount,
    AssetId asset_id
)
{
    assert(asset_id == ASSET_USDC);
    return SignMessage(
        exchange_info,
        account_info,
        CreateProtoMsgDepositToSubaccount(
            account_info.GetAccountAddress(), account_info.GetSubaccountNumber(), ToProtoQuantumsUSDC(amount), asset_id
        ),
        /*gas_limit=*/std::nullopt,
        estimator
    );
}

std::string CreateWithdrawFromSubaccountMessage(
    const ExchangeInfo& exchange_info,
    const AccountInfo& account_info,
    GasLimitEstimator estimator,
    common::Quantity amount,
    AssetId asset_id
)
{
    assert(asset_id == ASSET_USDC);
    return SignMessage(
        exchange_info,
        account_info,
        CreateProtoMsgWithdrawFromSubaccount(
            account_info.GetAccountAddress(), account_info.GetSubaccountNumber(), ToProtoQuantumsUSDC(amount), asset_id
        ),
        /*gas_limit=*/std::nullopt,
        estimator
    );
}

}  // namespace dydx_v4_client_lib
