#pragma once

#include <cstdint>
#include <string>

#include <cosmos/tx/v1beta1/tx.pb.h>
#include <dydxprotocol/clob/order.pb.h>
#include <dydxprotocol/clob/tx.pb.h>
#include <dydxprotocol/sending/transfer.pb.h>
#include <dydxprotocol/sending/tx.pb.h>

#include <common/encoding/base64.h>
#include <common/types.h>

#include <dydx_v4_futures/account_info.h>
#include <dydx_v4_futures/encoding/signing.h>
#include <dydx_v4_futures/enums.h>
#include <dydx_v4_futures/exchange_info.h>
#include <dydx_v4_futures/instrument_info.h>
#include <dydx_v4_futures/types.h>

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
    BlockNumber good_till_block,
    dydxprotocol::clob::Order_ConditionType condition_type,
    Subticks condition_order_trigger_subticks,
    bool reduce_only,
    bool long_term,
    uint32_t client_metadata
);

dydxprotocol::clob::MsgCancelOrder CreateProtoMsgCancelOrder(
    const Address& address,
    SubaccountNumber subaccount_number,
    OrderCid order_cid,
    ClobPairId clob_pair_id,
    uint32_t good_till,
    bool conditional,
    bool long_term
);

dydxprotocol::sending::MsgCreateTransfer CreateProtoMsgCreateTransfer(
    Address address,
    SubaccountNumber subaccount_number,
    Address recipient_address,
    SubaccountNumber recipient_subaccount_number,
    uint64_t amount,
    AssetId asset_id
);

dydxprotocol::sending::MsgDepositToSubaccount CreateProtoMsgDepositToSubaccount(
    Address address, SubaccountNumber subaccount_number, Quantums quantums, AssetId asset_id
);

dydxprotocol::sending::MsgWithdrawFromSubaccount CreateProtoMsgWithdrawFromSubaccount(
    Address address, SubaccountNumber subaccount_number, Quantums quantums, AssetId asset_id
);

}  // namespace dydx_v4_client_lib
