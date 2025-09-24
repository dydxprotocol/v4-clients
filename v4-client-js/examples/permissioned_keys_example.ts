import Long from 'long';

import { BECH32_PREFIX } from '../src';
import { CompositeClient } from '../src/clients/composite-client';
import {
  Network,
  OrderExecution,
  OrderSide,
  OrderTimeInForce,
  OrderType,
  SelectedGasDenom,
} from '../src/clients/constants';
import LocalWallet from '../src/clients/modules/local-wallet';
import { SubaccountInfo } from '../src/clients/subaccount';
import {
  createNewRandomDydxWallet,
  getAuthorizeNewTradingKeyArguments,
  getAuthorizedTradingKeysMetadata,
} from '../src/lib/trading-key-utils';
import { DYDX_TEST_MNEMONIC, DYDX_TEST_MNEMONIC_2 } from './constants';

async function test(): Promise<void> {
  const wallet1 = await LocalWallet.fromMnemonic(DYDX_TEST_MNEMONIC, BECH32_PREFIX);
  const wallet2 = await LocalWallet.fromMnemonic(DYDX_TEST_MNEMONIC_2, BECH32_PREFIX);

  const network = Network.staging();
  const client = await CompositeClient.connect(network);
  client.setSelectedGasDenom(SelectedGasDenom.NATIVE);

  console.log('**Client**');
  console.log(client);

  const subaccount1 = SubaccountInfo.forLocalWallet(wallet1, 0);
  const subaccount2 = SubaccountInfo.forLocalWallet(wallet2, 0);

  // Change second wallet pubkey
  // Add an authenticator to allow wallet2 to place orders
  console.log('** Adding authenticator **');
  // Record authenticator count before adding
  const authsBefore = await client.getAuthenticators(wallet1.address!);
  const beforeCount = authsBefore.accountAuthenticators.length;
  console.log(`Authenticators before: ${beforeCount}`);

  const apiTradingWalletInfo1 = await createApiTradingWallet(client, subaccount1);
  const apiTradingWallet1 = await LocalWallet.fromPrivateKey(
    apiTradingWalletInfo1.privteKeyHex,
    BECH32_PREFIX,
  );

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

  const parsedAuths = getAuthorizedTradingKeysMetadata(authsAfter.accountAuthenticators);
  const newAuthenticatorID = parsedAuths.find(
    (a) => apiTradingWallet1.address != null && a.address === apiTradingWallet1.address,
  )?.id;
  if (newAuthenticatorID == null) {
    console.error(
      'Unable to locate the created authenticator. Address: ',
      apiTradingWallet1.address,
    );
    throw new Error('Unable to locate the new authenticator');
  }
  console.log(`New authenticator ID: ${newAuthenticatorID}`);

  // Placing order using subaccount2 for subaccount1 succeeds
  console.log(
    '** Placing order for subaccount1 with subaccount2 + authenticator, should succeed **',
  );
  await placeOrder(client, apiTradingWallet1, subaccount1.address, newAuthenticatorID);

  // Placing order using subaccount2 for subaccount1 should fail
  console.log('** Placing order for subaccount1 with subaccount3 + authenticator, should fail **');
  await placeOrder(client, subaccount2.signingWallet, subaccount1.address, newAuthenticatorID);

  // Remove authenticator
  console.log('** Removing authenticator **');
  await removeAuthenticator(client, subaccount1, newAuthenticatorID);

  console.log('** Waiting 3 seconds for txn to be confirmed **');
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Placing an order using subaccount2 will now fail
  console.log('** Placing order with removed authenticator should fail **');
  await placeOrder(client, apiTradingWallet1, subaccount1.address, newAuthenticatorID);
}

async function removeAuthenticator(
  client: CompositeClient,
  subaccount: SubaccountInfo,
  id: string,
): Promise<void> {
  await client.removeAuthenticator(subaccount, id);
}

async function createApiTradingWallet(
  client: CompositeClient,
  subaccount: SubaccountInfo,
): Promise<{ privteKeyHex: string; forDydxAddress: string }> {
  const wallet = await createNewRandomDydxWallet();
  if (wallet == null) {
    throw new Error("Couldn't create wallet");
  }
  const { data, type } = getAuthorizeNewTradingKeyArguments({
    generatedWalletPubKey: wallet?.publicKey,
  });
  console.log('adding', wallet.address);
  await client.addAuthenticator(subaccount, type, data);
  return { privteKeyHex: wallet.privateKeyHex, forDydxAddress: subaccount.address };
}

async function placeOrder(
  client: CompositeClient,
  apiTradingWallet: LocalWallet,
  forAccountAddress: string,
  authenticatorId: string,
): Promise<void> {
  try {
    const side = OrderSide.BUY;
    const price = Number('10000');

    const clientId = Math.floor(Math.random() * 10000);

    const tx = await client.placeOrder(
      SubaccountInfo.forPermissionedWallet(apiTradingWallet, forAccountAddress, 0, [
        Long.fromString(authenticatorId),
      ]),
      'ETH-USD',
      OrderType.MARKET,
      side,
      price,
      0.01,
      clientId,
      OrderTimeInForce.IOC,
      100,
      OrderExecution.IOC,
      false,
      false,
    );
    console.log('**Order Tx**');
    console.log(Buffer.from(tx.hash).toString('hex'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error.message);
  }
}

test()
  .then(() => {})
  .catch((error) => {
    console.log(error.message);
  });
