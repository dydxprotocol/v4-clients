import { BECH32_PREFIX } from '../src';
import { CompositeClient } from '../src/clients/composite-client';
import { Coin } from '@dydxprotocol/v4-proto/src/codegen/cosmos/base/v1beta1/coin';
import { Network } from '../src/clients/constants';
import LocalWallet from '../src/clients/modules/local-wallet';
import { Any } from 'cosmjs-types/google/protobuf/any';
import * as govtx from '@dydxprotocol/v4-proto/src/codegen/cosmos/gov/v1/tx';
import * as pricetx from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/prices/tx';
import * as perptx from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/perpetuals/tx';
import * as clobtx from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/clob/tx';
import * as clobpair from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/clob/clob_pair';
import * as delaytx from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/delaymsg/tx';
import { DYDX_LOCAL_MNEMONIC, MAX_CLIENT_ID } from './constants';
import { EncodeObject, Registry } from '@cosmjs/proto-signing';
import Long from 'long';
import {
  Account, GasPrice, IndexedTx, StdFee,
} from '@cosmjs/stargate';
import { ValidatorClient } from '@dydxprotocol/v4-client-js';
import { Wallet } from 'ethers';
import { generateRegistry } from '../src/clients/lib/registry';

const GOV_ADDRESS = "dydx10d07y265gmmuvt4z0w9aw880jnsr700jnmapky"
const DELAY_ADDRESS = "dydx1mkkvp26dngu6n8rmalaxyp3gwkjuzztq5zx6tr"

const NATIVE_TOKEN = "adv4tnt"
const INITIAL_DEPOSIT_AMOUNT = 1000000000

const TYPE_URL_MSG_CREATE_ORACLE_MARKET = "/dydxprotocol.prices.MsgCreateOracleMarket"
const TYPE_URL_MSG_CREATE_PERPETUAL = "/dydxprotocol.perpetuals.MsgCreatePerpetual"
const TYPE_URL_MSG_CREATE_CLOB_PAIR = "/dydxprotocol.clob.MsgCreateClobPair"
const TYPE_URL_MSG_UPDATE_CLOB_PAIR = "/dydxprotocol.clob.MsgUpdateClobPair"
const TYPE_URL_MSG_DELAY_MESSAGE = "/dydxprotocol.delaymsg.MsgDelayMessage"
const TYPE_URL_MSG_SUBMIT_PROPOSAL = "/cosmos.gov.v1.MsgSubmitProposal"

const MOCK_DATA = {
  id: 34, // new
  defaultFundingPpm: 0, // new
  delayBlocks: 10, // new
  symbol: '1INCH',
  referencePrice: 0.438319018,
  numOracles: 4,
  liquidityTier: 2,
  p: -1,
  atomicResolution: -5,
  minExchanges: 3,
  minPriceChange: 4_000,
  priceExponent: -10,
  stepBaseQuantums: Long.fromNumber(1_000_000), // updated
  tickSizeExponent: -3,
  subticksPerTick: 1_000_000,
  minOrderSize: 1_000_000,
  quantumConversionExponent: -9,
}

async function test(): Promise<void> {
  console.log('**Start**');

  const wallet = await LocalWallet.fromMnemonic(DYDX_LOCAL_MNEMONIC, BECH32_PREFIX);
  console.log(wallet);
  const network = Network.local();
  const client = await CompositeClient.connect(network);
  console.log('**Client**');
  console.log(client);

  const msgs: EncodeObject[] = [];
  const createOracleMarket = composeMsgCreateOracleMarket(
    MOCK_DATA.id,
    MOCK_DATA.symbol,
    MOCK_DATA.priceExponent,
    MOCK_DATA.minExchanges,
    MOCK_DATA.minPriceChange,
    JSON.stringify({
      exchanges: [{ exchangeName: "TODO", ticker: "TODO" }]
    }),
  );
  const createPerpetual = composeMsgCreatePerpetual(
    MOCK_DATA.id,
    MOCK_DATA.id,
    MOCK_DATA.symbol,
    MOCK_DATA.atomicResolution,
    MOCK_DATA.defaultFundingPpm,
    MOCK_DATA.liquidityTier,
  );
  const createClobPair = composeMsgCreateClobPair(
    MOCK_DATA.id,
    MOCK_DATA.id,
    MOCK_DATA.quantumConversionExponent,
    MOCK_DATA.stepBaseQuantums,
    MOCK_DATA.subticksPerTick,
  );
  const updateClobPair = composeMsgUpdateClobPair(
    MOCK_DATA.id,
    MOCK_DATA.id,
    MOCK_DATA.quantumConversionExponent,
    MOCK_DATA.stepBaseQuantums,
    MOCK_DATA.subticksPerTick,
  );
  const delayMessage = composeMsgDelayMessage(
    updateClobPair,
    MOCK_DATA.delayBlocks,
  );
  msgs.push(createOracleMarket);
  msgs.push(createPerpetual);
  msgs.push(createClobPair);
  msgs.push(delayMessage);

  console.log('**Create Oracle Market**');
  console.log(createOracleMarket);
  console.log('**Create Perpetual**');
  console.log(createPerpetual);
  console.log('**Create Clob Pair**');
  console.log(createClobPair);
  console.log('**Update Clob Pair**');
  console.log(updateClobPair);
  console.log('**Delay Message**');
  console.log(delayMessage);

  const submitProposal = composeMsgSubmitProposal(
    getTitle(MOCK_DATA.symbol),
    INITIAL_DEPOSIT_AMOUNT,
    getSummary(MOCK_DATA.symbol, MOCK_DATA.delayBlocks),
    wrapMessagesAsAny(msgs), // IMPORTANT: must wrap messages in Any type.
    wallet.address!,
  );

  console.log('**Submit Proposal**');
  console.log(submitProposal);

  console.log('**Address**');
  console.log(wallet.address!);

  let account = await client.validatorClient.post.account(
    wallet.address!,
    undefined,
  )
  console.log('**Account**');
  console.log(account);


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

function composeMsgCreateOracleMarket(
  market_id: number,
  pair: string,
  exponent: number,
  min_exchanges: number,
  min_price_change_ppm: number,
  exchange_config_json: string,
): EncodeObject {
  const msg: pricetx.MsgCreateOracleMarket = {
    authority: GOV_ADDRESS,
    params: {
      id: market_id,
      pair: pair,
      exponent: exponent,
      minExchanges: min_exchanges,
      minPriceChangePpm: min_price_change_ppm,
      exchangeConfigJson: exchange_config_json,
    },
  };

  return {
    typeUrl: TYPE_URL_MSG_CREATE_ORACLE_MARKET,
    value: msg,
  };
}

function composeMsgCreatePerpetual(
  perpetual_id: number,
  market_id: number,
  ticker: string,
  atomic_resolution: number,
  default_funding_ppm: number,
  liquidity_tier: number,
): EncodeObject {
  const msg: perptx.MsgCreatePerpetual = {
    authority: GOV_ADDRESS,
    params: {
      id: perpetual_id,
      marketId: market_id,
      ticker: ticker,
      atomicResolution: atomic_resolution,
      defaultFundingPpm: default_funding_ppm,
      liquidityTier: liquidity_tier,
    },
  };

  return {
    typeUrl: TYPE_URL_MSG_CREATE_PERPETUAL,
    value: msg,
  };
}


function composeMsgCreateClobPair(
  clob_id: number,
  perpetual_id: number,
  quantum_conversion_exponent: number,
  step_base_quantums: Long,
  subticks_per_tick: number,
): EncodeObject {
  const msg: clobtx.MsgCreateClobPair = {
    authority: GOV_ADDRESS,
    clobPair: {
      id: clob_id,
      perpetualClobMetadata: {
        perpetualId: perpetual_id,
      },
      quantumConversionExponent: quantum_conversion_exponent,
      stepBaseQuantums: step_base_quantums,
      subticksPerTick: subticks_per_tick,
      status: clobpair.ClobPair_Status.STATUS_INITIALIZING,
    },
  };

  return {
    typeUrl: TYPE_URL_MSG_CREATE_CLOB_PAIR,
    value: msg,
  };
}

function composeMsgUpdateClobPair(
  clob_id: number,
  perpetual_id: number,
  quantum_conversion_exponent: number,
  step_base_quantums: Long,
  subticks_per_tick: number,
): EncodeObject {
  const msg: clobtx.MsgUpdateClobPair = {
    authority: DELAY_ADDRESS,
    clobPair: {
      id: clob_id,
      perpetualClobMetadata: {
        perpetualId: perpetual_id,
      },
      quantumConversionExponent: quantum_conversion_exponent,
      stepBaseQuantums: step_base_quantums,
      subticksPerTick: subticks_per_tick,
      status: clobpair.ClobPair_Status.STATUS_ACTIVE,
    },
  };

  return {
    typeUrl: TYPE_URL_MSG_UPDATE_CLOB_PAIR,
    value: msg,
  };
}

function composeMsgDelayMessage(
  embeddedMsg: EncodeObject,
  delay_blocks: number,
): EncodeObject {
  const msg: delaytx.MsgDelayMessage = {
    authority: GOV_ADDRESS, // all msgs sent to x/delay must be from x/gov module account.
    msg: embeddedMsg,
    delayBlocks: delay_blocks,
  }

  return {
    typeUrl: TYPE_URL_MSG_DELAY_MESSAGE,
    value: msg,
  }
}

function composeMsgSubmitProposal(
  title: string,
  initial_deposit_amount: number,
  summary: string,
  messages: EncodeObject[],
  proposer: string,
): EncodeObject {
  const initial_deposit: Coin[] = [{
    amount: initial_deposit_amount.toString(),
    denom: NATIVE_TOKEN,
  }];

  const msg: govtx.MsgSubmitProposal = {
    title,
    initialDeposit: initial_deposit,
    summary,
    messages,
    proposer,
    metadata: "",
    expedited: false,
  }


  return {
    typeUrl: TYPE_URL_MSG_SUBMIT_PROPOSAL,
    value: msg,
  };
}

function getTitle(
  ticker: string,
): string {
  return `Add ${ticker} perpetual market`;
}

function getSummary(
  ticker: string,
  delay_blocks: number,
): string {
  return `Add the x/prices, x/perpetuals and x/clob parameters needed for a ${ticker} perpetual market. Create the market in INITIALIZING status and transition it to ACTIVE status after ${delay_blocks} blocks.`;
}

function wrapMessagesAsAny(
  messages: EncodeObject[],
): Any[] {
  const registry: Registry = generateRegistry()
  const encodedMessages: Any[] = messages.map(
    (message: EncodeObject) => registry.encodeAsAny(message),
  );
  return encodedMessages;
}

test();
