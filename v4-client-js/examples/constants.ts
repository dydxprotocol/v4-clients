import { Order_Side, Order_TimeInForce } from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/clob/order';
import Long from 'long';

import { IPlaceOrder, OrderFlags } from '../src/clients/types';

export const DYDX_TEST_ADDRESS = 'dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art';
export const DYDX_TEST_PRIVATE_KEY = 'e92a6595c934c991d3b3e987ea9b3125bf61a076deab3a9cb519787b7b3e8d77';
export const DYDX_TEST_MNEMONIC = 'mirror actor skill push coach wait confirm orchard lunch mobile athlete gossip awake miracle matter bus reopen team ladder lazy list timber render wait';

export const MARKET_BTC_USD: string = 'BTC-USD';
export const PERPETUAL_PAIR_BTC_USD: number = 0;

const quantums: Long = new Long(1_000_000_000);
const subticks: Long = new Long(1_000_000_000);

// PlaceOrder variables
export const defaultOrder: IPlaceOrder = {
  clientId: 0,
  orderFlags: OrderFlags.SHORT_TERM,
  clobPairId: PERPETUAL_PAIR_BTC_USD,
  side: Order_Side.SIDE_BUY,
  quantums,
  subticks,
  timeInForce: Order_TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
  reduceOnly: false,
  clientMetadata: 0,
};
