import { PerpetualMarketType } from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/perpetuals/perpetual';
import Long from 'long';

import { GovAddNewMarketParams, LocalWallet, ProposalStatus } from '../src';
import { CompositeClient } from '../src/clients/composite-client';
import { BECH32_PREFIX, Network } from '../src/clients/constants';
import { getGovAddNewMarketSummary, getGovAddNewMarketTitle, sleep } from '../src/lib/utils';
import { DYDX_LOCAL_MNEMONIC } from './constants';

const INITIAL_DEPOSIT_AMOUNT = 10_000_000_000_000; // 10,000 whole native tokens.
const MOCK_DATA: GovAddNewMarketParams = {
  // common
  id: 34,
  ticker: 'BONK-USD',

  // x/prices
  priceExponent: -14,
  minExchanges: 3,
  minPriceChange: 4_000,
  exchangeConfigJson: JSON.stringify({
    exchanges: [
      { exchangeName: 'Binance', ticker: 'BONKUSDT', adjustByMarket: 'USDT-USD' },
      { exchangeName: 'Bybit', ticker: 'BONKUSDT', adjustByMarket: 'USDT-USD' },
      { exchangeName: 'CoinbasePro', ticker: 'BONK-USD' },
      { exchangeName: 'Kucoin', ticker: 'BONK-USDT', adjustByMarket: 'USDT-USD' },
      { exchangeName: 'Okx', ticker: 'BONK-USDT', adjustByMarket: 'USDT-USD' },
      { exchangeName: 'Mexc', ticker: 'BONK_USDT', adjustByMarket: 'USDT-USD' },
    ],
  }),

  // x/perpetuals
  liquidityTier: 2,
  atomicResolution: -1,
  marketType: PerpetualMarketType.PERPETUAL_MARKET_TYPE_CROSS,

  // x/clob
  quantumConversionExponent: -9,
  stepBaseQuantums: Long.fromNumber(1_000_000),
  subticksPerTick: 1_000_000,

  // x/delaymsg
  delayBlocks: 5,
};

// To run this test:
//  npm run build && node build/examples/gov_add_new_market.js
//
// Confirmed that the proposals have the exact same content.
//  1. submit using an example json file
//   dydxprotocold tx gov submit-proposal gov_add_new_market.json \
//      --from alice --keyring-backend test --gas auto --fees 9553225000000000adv4tnt
//   dydxprotocold query gov proposals
//  2. submit using the file's mock data
//   npm run build && node build/examples/gov_add_new_market.js
//   dydxprotocold query gov proposals
//  3. then compare the two proposals and ensure they match
async function test(): Promise<void> {
  console.log('**Start**');

  const wallet = await LocalWallet.fromMnemonic(DYDX_LOCAL_MNEMONIC, BECH32_PREFIX);
  console.log(wallet);

  const network = Network.local();
  const client = await CompositeClient.connect(network);
  console.log('**Client**');
  console.log(client);

  const tx = await client.submitGovAddNewMarketProposal(
    wallet,
    MOCK_DATA,
    getGovAddNewMarketTitle(MOCK_DATA.ticker),
    getGovAddNewMarketSummary(MOCK_DATA.ticker, MOCK_DATA.delayBlocks),
    BigInt(INITIAL_DEPOSIT_AMOUNT).toString(),
  );
  console.log('**Tx**');
  console.log(tx);

  await sleep(5000);

  const depositProposals = await client.validatorClient.get.getAllGovProposals(
    ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD,
  );
  console.log('**Deposit Proposals**');
  console.log(depositProposals);

  const votingProposals = await client.validatorClient.get.getAllGovProposals(
    ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD,
  );
  console.log('**Voting Proposals**');
  console.log(votingProposals);
}

test().catch((error) => {
  console.error(error);
});
