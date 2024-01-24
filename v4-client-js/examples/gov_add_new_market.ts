import { EncodeObject, Registry } from '@cosmjs/proto-signing';
import Long from 'long';

import { BECH32_PREFIX } from '../src';
import { CompositeClient } from '../src/clients/composite-client';
import { Network } from '../src/clients/constants';
import { generateRegistry } from '../src/clients/lib/registry';
import { Composer } from '../src/clients/modules/composer';
import LocalWallet from '../src/clients/modules/local-wallet';
import { DYDX_LOCAL_MNEMONIC } from './constants';

const INITIAL_DEPOSIT_AMOUNT = 10_000_000_000_000; // 10,000 whole native tokens.
const MOCK_DATA = {
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
  defaultFundingPpm: 0,
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

  const wallet = await LocalWallet.fromMnemonic(DYDX_LOCAL_MNEMONIC, BECH32_PREFIX);
  const network = Network.local();
  const client = await CompositeClient.connect(network);
  console.log('**Client**');
  console.log(client);

  const composer: Composer = client.validatorClient.post.composer;
  const registry: Registry = generateRegistry();
  const msgs: EncodeObject[] = [];

  // x/prices.MsgCreateOracleMarket
  const createOracleMarket = composer.composeMsgCreateOracleMarket(
    MOCK_DATA.id,
    MOCK_DATA.ticker,
    MOCK_DATA.priceExponent,
    MOCK_DATA.minExchanges,
    MOCK_DATA.minPriceChange,
    MOCK_DATA.exchangeConfigJson,
  );

  // x/perpetuals.MsgCreatePerpetual
  const createPerpetual = composer.composeMsgCreatePerpetual(
    MOCK_DATA.id,
    MOCK_DATA.id,
    MOCK_DATA.ticker,
    MOCK_DATA.atomicResolution,
    MOCK_DATA.defaultFundingPpm,
    MOCK_DATA.liquidityTier,
  );

  // x/clob.MsgCreateClobPair
  const createClobPair = composer.composeMsgCreateClobPair(
    MOCK_DATA.id,
    MOCK_DATA.id,
    MOCK_DATA.quantumConversionExponent,
    MOCK_DATA.stepBaseQuantums,
    MOCK_DATA.subticksPerTick,
  );

  // x/clob.MsgUpdateClobPair
  const updateClobPair = composer.composeMsgUpdateClobPair(
    MOCK_DATA.id,
    MOCK_DATA.id,
    MOCK_DATA.quantumConversionExponent,
    MOCK_DATA.stepBaseQuantums,
    MOCK_DATA.subticksPerTick,
  );

  // x/delaymsg.MsgDelayMessage
  const delayMessage = composer.composeMsgDelayMessage(
    // IMPORTANT: must wrap messages in Any type to fit into delaymsg.
    composer.wrapMessageAsAny(registry, updateClobPair),
    MOCK_DATA.delayBlocks,
  );
  msgs.push(createOracleMarket);
  msgs.push(createPerpetual);
  msgs.push(createClobPair);
  msgs.push(delayMessage);

  // x/gov.v1.MsgSubmitProposal
  const submitProposal = composer.composeMsgSubmitProposal(
    getTitle(MOCK_DATA.ticker),
    INITIAL_DEPOSIT_AMOUNT,
    client.validatorClient.config.denoms,
    getSummary(MOCK_DATA.ticker, MOCK_DATA.delayBlocks),
    // IMPORTANT: must wrap messages in Any type for gov's submit proposal.
    composer.wrapMessageArrAsAny(registry, msgs),
    wallet.address!, // proposer
  );

  console.log('**Submit Proposal**');
  console.log(submitProposal);

  const tx = await client.send(
    wallet,
    () => Promise.resolve([submitProposal]),
    false,
    client.validatorClient.post.defaultDydxGasPrice,
    undefined,
    () => client.validatorClient.post.account(
      wallet.address!,
      undefined,
    ),
  );
  console.log('**Tx**');
  console.log(tx);
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
