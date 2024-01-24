import { GeneratedType, Registry } from '@cosmjs/proto-signing';
import { defaultRegistryTypes } from '@cosmjs/stargate';
import {
  MsgPlaceOrder,
  MsgCancelOrder,
  MsgCreateClobPair,
  MsgUpdateClobPair,
} from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/clob/tx';
import { MsgDelayMessage } from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/delaymsg/tx';
import { MsgCreatePerpetual } from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/perpetuals/tx';
import { MsgCreateOracleMarket } from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/prices/tx';
import {
  MsgWithdrawFromSubaccount,
  MsgDepositToSubaccount,
} from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/sending/transfer';
import {
  MsgCreateTransfer,
} from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/sending/tx';
import {
  TYPE_URL_MSG_PLACE_ORDER,
  TYPE_URL_MSG_CANCEL_ORDER,
  TYPE_URL_MSG_CREATE_CLOB_PAIR,
  TYPE_URL_MSG_UPDATE_CLOB_PAIR,
  TYPE_URL_MSG_DELAY_MESSAGE,
  TYPE_URL_MSG_CREATE_PERPETUAL,
  TYPE_URL_MSG_CREATE_ORACLE_MARKET,
  TYPE_URL_MSG_CREATE_TRANSFER,
  TYPE_URL_MSG_WITHDRAW_FROM_SUBACCOUNT,
  TYPE_URL_MSG_DEPOSIT_TO_SUBACCOUNT,
} from '../constants';

export const registry: ReadonlyArray<[string, GeneratedType]> = [];
export function generateRegistry(): Registry {
  return new Registry([
    // clob
    [TYPE_URL_MSG_PLACE_ORDER, MsgPlaceOrder as GeneratedType],
    [TYPE_URL_MSG_CANCEL_ORDER, MsgCancelOrder as GeneratedType],
    [TYPE_URL_MSG_CREATE_CLOB_PAIR, MsgCreateClobPair as GeneratedType],
    [TYPE_URL_MSG_UPDATE_CLOB_PAIR, MsgUpdateClobPair as GeneratedType],

    // delaymsg
    [TYPE_URL_MSG_DELAY_MESSAGE, MsgDelayMessage as GeneratedType],

    // perpetuals
    [TYPE_URL_MSG_CREATE_PERPETUAL, MsgCreatePerpetual as GeneratedType],

    // prices
    [TYPE_URL_MSG_CREATE_ORACLE_MARKET, MsgCreateOracleMarket as GeneratedType],

    // sending
    [TYPE_URL_MSG_CREATE_TRANSFER, MsgCreateTransfer as GeneratedType],
    [TYPE_URL_MSG_WITHDRAW_FROM_SUBACCOUNT, MsgWithdrawFromSubaccount as GeneratedType],
    [TYPE_URL_MSG_DEPOSIT_TO_SUBACCOUNT, MsgDepositToSubaccount as GeneratedType],

    // default types
    ...defaultRegistryTypes,
  ]);
}
