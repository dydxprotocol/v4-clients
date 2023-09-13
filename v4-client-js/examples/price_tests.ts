import { BECH32_PREFIX } from '../src';
import { CompositeClient } from '../src/clients/composite-client';
import {
  Network, OrderExecution, OrderSide, OrderTimeInForce, OrderType,
} from '../src/clients/constants';
import LocalWallet from '../src/clients/modules/local-wallet';
import { Subaccount } from '../src/clients/subaccount';
import { randomInt } from '../src/lib/utils';
import { DYDX_TEST_MNEMONIC } from './constants';

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buy(client: CompositeClient, subaccount: Subaccount, market: string): Promise<void> {
  try {
    const type = OrderType.LIMIT;
    const side = OrderSide.BUY;
    const price = 123;
    const postOnly = false;
    const timeInForce = OrderTimeInForce.GTT;
    const timeInForceSeconds = 6000;
    const tx = await client.placeOrder(
      subaccount,
      market,
      type,
      side,
      price,
      0.01,
      randomInt(100_000_000),
      timeInForce,
      timeInForceSeconds,
      OrderExecution.DEFAULT,
      postOnly,
      false,
    );
    console.log('**Order Tx**');
    console.log(tx);
  } catch (error) {
    console.log(error.message);
  }
}

async function test(): Promise<void> {
  const wallet = await LocalWallet.fromMnemonic(DYDX_TEST_MNEMONIC, BECH32_PREFIX);
  console.log(wallet);
  const network = Network.staging();
  const client = await CompositeClient.connect(network);
  console.log('**Client**');
  console.log(client);
  const subaccount = new Subaccount(wallet, 0);
  buy(client, subaccount, 'ETH-USD');
  await sleep(5000);  // wait for placeOrder to complete
  buy(client, subaccount, 'BTC-USD');
  await sleep(5000);  // wait for placeOrder to complete
  buy(client, subaccount, 'FIL-USD');
}

test().then(() => {
}).catch((error) => {
  console.log(error.message);
});
