#include "dydx_v4_futures/encoding/proto_constructors.h"

#include <string>

#include <cosmos/crypto/secp256k1/keys.pb.h>
#include <dydxprotocol/clob/tx.pb.h>
#include <dydxprotocol/subaccounts/subaccount.pb.h>

namespace dydx_v4_client_lib {

dydxprotocol::clob::MsgPlaceOrder CreateProtoMsgPlaceOrder(
    const Address& address,
    SubaccountNumber subaccount_number,
    OrderCid order_cid,
    ClobPairId clob_pair_id,
    dydxprotocol::clob::Order_Side side,
    dydxprotocol::clob::Order_TimeInForce time_in_force,
    Quantums quantums,
    Subticks subticks,
    uint32_t good_till,
    dydxprotocol::clob::Order_ConditionType condition_type,
    Subticks condition_order_trigger_subticks,
    bool reduce_only,
    bool long_term,
    uint32_t client_metadata
)
{
    assert(condition_type == dydxprotocol::clob::Order_ConditionType_CONDITION_TYPE_UNSPECIFIED || long_term);
    dydxprotocol::clob::MsgPlaceOrder place_order;
    dydxprotocol::clob::Order& order = *place_order.mutable_order();
    dydxprotocol::clob::OrderId& order_id = *order.mutable_order_id();
    dydxprotocol::subaccounts::SubaccountId& subaccount_id = *order_id.mutable_subaccount_id();
    *subaccount_id.mutable_owner() = address;
    subaccount_id.set_number(subaccount_number);
    order_id.set_client_id(order_cid);

    order_id.set_order_flags(
        condition_type == dydxprotocol::clob::Order_ConditionType_CONDITION_TYPE_UNSPECIFIED ? (long_term ? 64 : 0) : 32
    );
    order_id.set_clob_pair_id(clob_pair_id);
    order.set_side(side);
    order.set_quantums(quantums);
    order.set_subticks(subticks);
    if (long_term) {
        order.set_good_til_block_time(good_till);
    } else {
        order.set_good_til_block(good_till);
    }
    order.set_time_in_force(time_in_force);
    order.set_reduce_only(reduce_only);
    order.set_client_metadata(client_metadata);
    order.set_condition_type(condition_type);
    order.set_conditional_order_trigger_subticks(condition_order_trigger_subticks);
    return place_order;
}

dydxprotocol::clob::MsgCancelOrder CreateProtoMsgCancelOrder(
    const Address& address,
    SubaccountNumber subaccount_number,
    OrderCid order_cid,
    ClobPairId clob_pair_id,
    uint32_t good_till,
    bool conditional,
    bool long_term
)
{
    dydxprotocol::clob::MsgCancelOrder cancel_order;
    dydxprotocol::clob::OrderId& order_id = *cancel_order.mutable_order_id();
    dydxprotocol::subaccounts::SubaccountId& subaccount_id = *order_id.mutable_subaccount_id();
    *subaccount_id.mutable_owner() = address;
    subaccount_id.set_number(subaccount_number);
    order_id.set_client_id(order_cid);
    order_id.set_order_flags(conditional ? 32 : (long_term ? 64 : 0));
    order_id.set_clob_pair_id(clob_pair_id);
    if (long_term) {
        cancel_order.set_good_til_block_time(good_till);
    } else {
        cancel_order.set_good_til_block(good_till);
    }
    return cancel_order;
}

dydxprotocol::sending::MsgCreateTransfer CreateProtoMsgCreateTransfer(
    Address address,
    SubaccountNumber subaccount_number,
    Address recipient_address,
    SubaccountNumber recipient_subaccount_number,
    uint64_t amount,
    AssetId asset_id
)
{
    dydxprotocol::sending::MsgCreateTransfer create_transfer;
    dydxprotocol::sending::Transfer& transfer = *create_transfer.mutable_transfer();
    dydxprotocol::subaccounts::SubaccountId& sender = *transfer.mutable_sender();
    sender.set_owner(address);
    sender.set_number(subaccount_number);
    dydxprotocol::subaccounts::SubaccountId& recipient = *transfer.mutable_recipient();
    recipient.set_owner(recipient_address);
    recipient.set_number(recipient_subaccount_number);
    transfer.set_asset_id(asset_id);
    transfer.set_amount(amount);
    return create_transfer;
}

dydxprotocol::sending::MsgDepositToSubaccount CreateProtoMsgDepositToSubaccount(
    Address address, SubaccountNumber subaccount_number, Quantums quantums, AssetId asset_id
)
{
    dydxprotocol::sending::MsgDepositToSubaccount deposit_to_subaccount;
    deposit_to_subaccount.set_sender(address);
    dydxprotocol::subaccounts::SubaccountId& recipient = *deposit_to_subaccount.mutable_recipient();
    recipient.set_owner(address);
    recipient.set_number(subaccount_number);
    deposit_to_subaccount.set_asset_id(asset_id);
    deposit_to_subaccount.set_quantums(quantums);
    return deposit_to_subaccount;
}

dydxprotocol::sending::MsgWithdrawFromSubaccount CreateProtoMsgWithdrawFromSubaccount(
    Address address, SubaccountNumber subaccount_number, Quantums quantums, AssetId asset_id
)
{
    dydxprotocol::sending::MsgWithdrawFromSubaccount withdraw_from_subaccount;
    dydxprotocol::subaccounts::SubaccountId& sender = *withdraw_from_subaccount.mutable_sender();
    sender.set_owner(address);
    sender.set_number(subaccount_number);
    withdraw_from_subaccount.set_recipient(address);
    withdraw_from_subaccount.set_asset_id(asset_id);
    withdraw_from_subaccount.set_quantums(quantums);
    return withdraw_from_subaccount;
}

}  // namespace dydx_v4_client_lib
