import { BECH32_PREFIX, OrderFlags } from '../src';
import { CompositeClient } from '../src/clients/composite-client';
import {
  Network, OrderExecution, OrderSide, OrderTimeInForce, OrderType,
} from '../src/clients/constants';
import LocalWallet from '../src/clients/modules/local-wallet';
import { Subaccount } from '../src/clients/subaccount';
import { randomInt } from '../src/lib/utils';
import { DYDX_TEST_MNEMONIC, MAX_CLIENT_ID } from './constants';

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function test(): Promise<void> {
  const wallet = await LocalWallet.fromMnemonic(DYDX_TEST_MNEMONIC, BECH32_PREFIX);
  console.log(wallet);
  const network = Network.staging();
  const client = await CompositeClient.connect(network);
  console.log('**Client**');
  console.log(client);
  const subaccount = new Subaccount(wallet, 0);

  const longTermOrderClientId = randomInt(MAX_CLIENT_ID);
  try {
    // place a long term order
    const tx = await client.placeOrder(
      subaccount,
      'ETH-USD',
      OrderType.LIMIT,
      OrderSide.SELL,
      40000,
      0.01,
      longTermOrderClientId,
      OrderTimeInForce.GTT,
      60,
      OrderExecution.DEFAULT,
      false,
      false,
    );
    console.log('**Long Term Order Tx**');
    console.log(tx.hash);
  } catch (error) {
    console.log('**Long Term Order Failed**');
    console.log(error.message);
  }

  await sleep(5000);  // wait for placeOrder to complete

  try {
    // cancel the long term order
    const tx = await client.cancelOrder(
      subaccount,
      longTermOrderClientId,
      OrderFlags.LONG_TERM,
      'ETH-USD',
      0,
      120,
    );
    console.log('**Cancel Long Term Order Tx**');
    console.log(tx);
  } catch (error) {
    console.log('**Cancel Long Term Order Failed**');
    console.log(error.message);
  }
}

test().then(() => {
}).catch((error) => {
  console.log(error.message);
});
