import Long from 'long';

import { BECH32_PREFIX, ITransfer } from '../src';
import { Network } from '../src/clients/constants';
import LocalWallet from '../src/clients/modules/local-wallet';
import { TransactionMsg, TransactionType } from '../src/clients/modules/post';
import { SubaccountInfo } from '../src/clients/subaccount';
import { ValidatorClient } from '../src/clients/validator-client';
import { DYDX_TEST_MNEMONIC } from './constants';

async function test(): Promise<void> {
  const wallet = await LocalWallet.fromMnemonic(DYDX_TEST_MNEMONIC, BECH32_PREFIX);
  console.log(wallet);

  const client = await ValidatorClient.connect(Network.testnet().validatorConfig);
  console.log('**Client**');
  console.log(client);

  const subaccount = new SubaccountInfo(wallet, 0);

  const tx = await client.post.transfer(
    subaccount,
    subaccount.address,
    1,
    0,
    new Long(10_000_000),
  );
  console.log('**Transfer Tx**');
  console.log(tx);

  const params: ITransfer = {
    recipientAddress: wallet.address!!,
    recipientSubaccountNumber: 0,
    assetId: 0,
    amount: new Long(10_000_000),
  };
  const tx2 = await client.post.sendMsg(
    subaccount,
    new TransactionMsg(
      TransactionType.TRANSFER,
      params,
      false,
    ),
  );
  console.log('**Withdraw Tx**');
  console.log(tx2);
}

test().then(() => {
}).catch((error) => {
  console.log(error.message);
});
