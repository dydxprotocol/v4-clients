import Long from 'long';

import { BECH32_PREFIX } from '../src';
import { STAGING_CHAIN_ID, Network, ValidatorConfig } from '../src/clients/constants';
import LocalWallet from '../src/clients/modules/local-wallet';
import { Subaccount } from '../src/clients/subaccount';
import { ValidatorClient } from '../src/clients/validator-client';
import { DYDX_TEST_MNEMONIC } from './constants';

// TODO: Test after staging deploy latest transfer contracts.

async function test(): Promise<void> {
  const wallet = await LocalWallet.fromMnemonic(DYDX_TEST_MNEMONIC, BECH32_PREFIX);
  console.log(wallet);

  const config = new ValidatorConfig(
    Network.staging().validatorConfig.restEndpoint,
    STAGING_CHAIN_ID,
  );
  const client = await ValidatorClient.connect(config);
  console.log('**Client**');
  console.log(client);

  const subaccount = new Subaccount(wallet, 0);

  const tx = await client.post.transfer(
    subaccount,
    subaccount.address,
    1,
    0,
    new Long(10_000_000),
  );
  console.log('**Transfer Tx**');
  console.log(tx);
}

test().then(() => {
}).catch((error) => {
  console.log(error.message);
});
