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

export const registry: ReadonlyArray<[string, GeneratedType]> = [];
export function generateRegistry(): Registry {
  return new Registry([
    // clob
    ['/dydxprotocol.clob.MsgPlaceOrder', MsgPlaceOrder as GeneratedType],
    ['/dydxprotocol.clob.MsgCancelOrder', MsgCancelOrder as GeneratedType],
    ['/dydxprotocol.clob.MsgCreateClobPair', MsgCreateClobPair as GeneratedType],
    ['/dydxprotocol.clob.MsgUpdateClobPair', MsgUpdateClobPair as GeneratedType],

    // delaymsg
    ['/dydxprotocol.delaymsg.MsgDelayMessage', MsgDelayMessage as GeneratedType],

    // perpetuals
    ['/dydxprotocol.perpetuals.MsgCreatePerpetual', MsgCreatePerpetual as GeneratedType],

    // prices
    ['/dydxprotocol.prices.MsgCreateOracleMarket', MsgCreateOracleMarket as GeneratedType],

    // sending
    ['/dydxprotocol.sending.MsgCreateTransfer', MsgCreateTransfer as GeneratedType],
    ['/dydxprotocol.sending.MsgWithdrawFromSubaccount', MsgWithdrawFromSubaccount as GeneratedType],
    ['/dydxprotocol.sending.MsgDepositToSubaccount', MsgDepositToSubaccount as GeneratedType],

    // default types
    ...defaultRegistryTypes,
  ]);
}
