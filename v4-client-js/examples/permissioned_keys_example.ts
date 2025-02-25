import { TextEncoder } from 'util';

import { toBase64 } from '@cosmjs/encoding';
import { Order_TimeInForce } from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/clob/order';

import { BECH32_PREFIX } from '../src';
import { CompositeClient } from '../src/clients/composite-client';
import { AuthenticatorType, Network, OrderSide, SelectedGasDenom } from '../src/clients/constants';
import LocalWallet from '../src/clients/modules/local-wallet';
import { SubaccountInfo } from '../src/clients/subaccount';
import { DYDX_TEST_MNEMONIC, DYDX_TEST_MNEMONIC_2 } from './constants';

async function test(): Promise<void> {
  const wallet1 = await LocalWallet.fromMnemonic(DYDX_TEST_MNEMONIC, BECH32_PREFIX);
  const wallet2 = await LocalWallet.fromMnemonic(DYDX_TEST_MNEMONIC_2, BECH32_PREFIX);

  const network = Network.staging();
  const client = await CompositeClient.connect(network);
  client.setSelectedGasDenom(SelectedGasDenom.NATIVE);

  console.log('**Client**');
  console.log(client);

  const subaccount1 = new SubaccountInfo(wallet1, 0);
  const subaccount2 = new SubaccountInfo(wallet2, 0);

  // Change second wallet pubkey
  // Add an authenticator to allow wallet2 to place orders
  console.log("** Adding authenticator **");
  await addAuthenticator(client, subaccount1, wallet2.pubKey!.value);

  const authenticators = await client.getAuthenticators(wallet1.address!);
  // Last element in authenticators array is the most recently created
  const lastElement = authenticators.accountAuthenticators.length - 1;
  const authenticatorID = authenticators.accountAuthenticators[lastElement].id;

  // Placing order using subaccount2 for subaccount1 succeeds
  console.log("** Placing order with authenticator **");
  await placeOrder(client, subaccount2, subaccount1, authenticatorID);

  // Remove authenticator
  console.log("** Removing authenticator **");
  await removeAuthenticator(client, subaccount1, authenticatorID);

  // Placing an order using subaccount2 will now fail
  console.log("** Placing order with invalid authenticator should fail **");
  await placeOrder(client, subaccount2, subaccount1, authenticatorID);
}

async function removeAuthenticator(
  client: CompositeClient,
  subaccount: SubaccountInfo,
  id: Long,
): Promise<void> {
  await client.removeAuthenticator(subaccount, id);
}

async function addAuthenticator(
  client: CompositeClient,
  subaccount: SubaccountInfo,
  authedPubKey: string,
): Promise<void> {
  const subAuth = [ {
    type: AuthenticatorType.SIGNATURE_VERIFICATION,
    config: authedPubKey,
  },
  {
    type: AuthenticatorType.ANY_OF,
    config: [
    {
      type: AuthenticatorType.MESSAGE_FILTER,
      config: toBase64(new TextEncoder().encode('/dydxprotocol.clob.MsgPlaceOrder')),
    },
    {
      type: AuthenticatorType.MESSAGE_FILTER,
      config: toBase64(new TextEncoder().encode('/dydxprotocol.clob.MsgPlaceOrder')),
    },
    ]
  }
];

  const jsonString = JSON.stringify(subAuth);
  const encodedData = new TextEncoder().encode(jsonString);

  try {
    await client.addAuthenticator(subaccount, AuthenticatorType.ALL_OF, encodedData);
  } catch (error) {
    console.log(error.message);
  }
}

async function placeOrder(
  client: CompositeClient,
  fromAccount: SubaccountInfo,
  forAccount: SubaccountInfo,
  authenticatorId: Long,
): Promise<void> {
  try {
    const side = OrderSide.BUY;
    const price = Number('1000');
    const currentBlock = await client.validatorClient.get.latestBlockHeight();
    const nextValidBlockHeight = currentBlock + 5;
    const goodTilBlock = nextValidBlockHeight + 10;

    const timeInForce = Order_TimeInForce.TIME_IN_FORCE_UNSPECIFIED;

    const clientId = Math.floor(Math.random() * 10000);

    const tx = await client.placeShortTermOrder(
      fromAccount,
      'ETH-USD',
      side,
      price,
      0.01,
      clientId,
      goodTilBlock,
      timeInForce,
      false,
      undefined,
      {
        authenticators: [authenticatorId],
        accountForOrder: forAccount,
      },
    );
    console.log('**Order Tx**');
    console.log(Buffer.from(tx.hash).toString('hex'));
  } catch (error) {
    console.log(error.message);
  }
}

test()
  .then(() => {})
  .catch((error) => {
    console.log(error.message);
  });
