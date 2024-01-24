import Long from 'long';

import { GovAddNewMarketParams, ProposalStatus } from '../src';
import { CompositeClient } from '../src/clients/composite-client';
import { Network } from '../src/clients/constants';
import { sleep } from '../src/lib/utils';

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

  const network = Network.local();
  const client = await CompositeClient.connect(network);
  console.log('**Client**');
  console.log(client);

  const tx = await client.submitGovAddNewMarketProposal(
    MOCK_DATA,
    getTitle(MOCK_DATA.ticker),
    getSummary(MOCK_DATA.ticker, MOCK_DATA.delayBlocks),
    INITIAL_DEPOSIT_AMOUNT,
  );
  console.log('**Tx**');
  console.log(tx);

  await sleep(3000);

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

function getTitle(
  ticker: string,
): string {
  return `Add ${ticker} perpetual market`;
}

function getSummary(
  ticker: string,
  delayBlocks: number,
): string {
  return `Add the x/prices, x/perpetuals and x/clob parameters needed for a ${ticker} perpetual market. Create the market in INITIALIZING status and transition it to ACTIVE status after ${delayBlocks} blocks.`;
}

test().catch((error) => {
  console.error(error);
});
