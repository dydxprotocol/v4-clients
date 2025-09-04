import { toBase64 } from '@cosmjs/encoding';
import { Order_TimeInForce } from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/clob/order';

import { BECH32_PREFIX } from '../src';
import { CompositeClient } from '../src/clients/composite-client';
import { AuthenticatorType, Network, OrderSide, SelectedGasDenom } from '../src/clients/constants';
import LocalWallet from '../src/clients/modules/local-wallet';
import { SubaccountInfo } from '../src/clients/subaccount';
import { DYDX_TEST_MNEMONIC, DYDX_TEST_MNEMONIC_2, DYDX_TEST_MNEMONIC_3 } from './constants';

async function test(): Promise<void> {
  const wallet1 = await LocalWallet.fromMnemonic(DYDX_TEST_MNEMONIC, BECH32_PREFIX);
  const wallet2 = await LocalWallet.fromMnemonic(DYDX_TEST_MNEMONIC_2, BECH32_PREFIX);
  const wallet3 = await LocalWallet.fromMnemonic(DYDX_TEST_MNEMONIC_3, BECH32_PREFIX);

  const network = Network.staging();
  const client = await CompositeClient.connect(network);
  client.setSelectedGasDenom(SelectedGasDenom.NATIVE);

  console.log('**Client**');
  console.log(client);

  const subaccount1 = new SubaccountInfo(wallet1, 0);
  const subaccount2 = new SubaccountInfo(wallet2, 0);
  const subaccount3 = new SubaccountInfo(wallet3, 0);

  // Change second wallet pubkey
  // Add an authenticator to allow wallet2 to place orders
  console.log('** Adding authenticator **');
  // Record authenticator count before adding
  const authsBefore = await client.getAuthenticators(wallet1.address!);
  const beforeCount = authsBefore.accountAuthenticators.length;
  console.log(`Authenticators before: ${beforeCount}`);
  await addTestAuthenticator(client, subaccount1, wallet2.pubKey!.value);

  console.log('** Waiting 3 seconds for txn to be confirmed **');
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const authsAfter = await client.getAuthenticators(wallet1.address!);
  const afterCount = authsAfter.accountAuthenticators.length;
  console.log(`Authenticators after: ${afterCount}`);
  if (afterCount !== beforeCount + 1) {
    console.error('Authenticator count did not increment by 1.');
    process.exit(1);
  } else {
    console.log('Authenticator count incremented by 1 as expected.');
  }
  // Last element in authenticators array is the most recently created
  const lastElement = authsAfter.accountAuthenticators.length - 1;
  const newAuthenticatorID = authsAfter.accountAuthenticators[lastElement].id;

  console.log(`New authenticator ID: ${newAuthenticatorID}`);

  // Placing order using subaccount2 for subaccount1 succeeds
  console.log(
    '** Placing order for subaccount1 with subaccount2 + authenticator, should succeed **',
  );
  await placeOrder(client, subaccount2, subaccount1, newAuthenticatorID);

  // Placing order using subaccount3 for subaccount1 should fail
  console.log('** Placing order for subaccount1 with subaccount3 + authenticator, should fail **');
  await placeOrder(client, subaccount3, subaccount1, newAuthenticatorID);

  // Remove authenticator
  console.log('** Removing authenticator **');
  await removeAuthenticator(client, subaccount1, newAuthenticatorID);

  console.log('** Waiting 3 seconds for txn to be confirmed **');
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Placing an order using subaccount2 will now fail
  console.log('** Placing order with removed authenticator should fail **');
  await placeOrder(client, subaccount2, subaccount1, newAuthenticatorID);
}

async function removeAuthenticator(
  client: CompositeClient,
  subaccount: SubaccountInfo,
  id: Long,
): Promise<void> {
  await client.removeAuthenticator(subaccount, id);
}

async function addTestAuthenticator(
  client: CompositeClient,
  subaccount: SubaccountInfo,
  authedPubKey: string,
): Promise<void> {
  const msgType = (s: string): string => toBase64(new TextEncoder().encode(s));
  const anyOfSubAuth = [
    {
      type: AuthenticatorType.MESSAGE_FILTER,
      config: msgType('/dydxprotocol.clob.MsgPlaceOrder'),
    },
    {
      type: AuthenticatorType.MESSAGE_FILTER,
      config: msgType('/dydxprotocol.sending.MsgCreateTransfer'),
    },
  ];

  // Nested AnyOf config must be base64(JSON([...])) as on-chain expects []byte
  const anyOfConfigB64 = toBase64(new TextEncoder().encode(JSON.stringify(anyOfSubAuth)));

  const subAuth = [
    {
      type: AuthenticatorType.SIGNATURE_VERIFICATION,
      config: authedPubKey,
    },
    {
      type: AuthenticatorType.ANY_OF,
      config: anyOfConfigB64,
    },
  ];

  const jsonString = JSON.stringify(subAuth);
  const encodedData = new TextEncoder().encode(jsonString);

  await client.addAuthenticator(subaccount, AuthenticatorType.ALL_OF, encodedData);
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
