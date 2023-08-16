import { PageRequest } from '@dydxprotocol/dydxjs/src/codegen/cosmos/base/query/v1beta1/pagination';
import Long from 'long';

import { BroadcastOptions } from './types';

export * from '../lib/constants';

// Chain ID
export const DEV_CHAIN_ID = 'dydxprotocol-testnet';
export const STAGING_CHAIN_ID = 'dydxprotocol-testnet';
export const TESTNET_CHAIN_ID = 'dydx-testnet-2';

// ------------ API URLs ------------
export enum IndexerApiHost {
  DEV = 'https://indexer.v4dev.dydx.exchange',
  STAGING = 'https://indexer.v4staging.dydx.exchange',
  TESTNET = 'https://indexer.v4testnet2.dydx.exchange',
  // TODO: Add MAINNET
}

export enum IndexerWSHost {
  DEV = 'wss://indexer.v4dev.dydx.exchange/v4/ws',
  STAGING = 'wss://indexer.v4staging.dydx.exchange/v4/ws',
  TESTNET = 'wss://indexer.v4testnet2.dydx.exchange/v4/ws',
  // TODO: Add MAINNET
}

export enum FaucetApiHost {
  DEV = 'https://faucet.v4dev.expotrading.com',
  STAGING = 'https://faucet.v4staging.dydx.exchange',
  TESTNET = 'https://faucet.v4testnet2.dydx.exchange',
}

export enum ValidatorApiHost {
  DEV = 'https://validator.v4dev.dydx.exchange',
  STAGING = 'https://validator.v4staging.dydx.exchange',
  TESTNET = 'https://validator.v4testnet2.dydx.exchange',
  // TODO: Add MAINNET
}

// ------------ Network IDs ------------

export enum NetworkId {
  DEV = 'dydxprotocol-testnet',
  STAGING = 'dydxprotocol-testnet',
  TESTNET = 'dydx-testnet-2',
  // TODO: Add MAINNET
}
export const NETWORK_ID_MAINNET: string | null = null;
export const NETWORK_ID_TESTNET: string = 'dydxprotocol-testnet';

// ------------ Market Statistic Day Types ------------
export enum MarketStatisticDay {
  ONE = '1',
  SEVEN = '7',
  THIRTY = '30',
}

// ------------ Order Types ------------
// This should match OrderType in Abacus
export enum OrderType {
  LIMIT = 'LIMIT',
  MARKET = 'MARKET',
  STOP_LIMIT = 'STOP_LIMIT',
  TAKE_PROFIT_LIMIT = 'TAKE_PROFIT',
  STOP_MARKET = 'STOP_MARKET',
  TAKE_PROFIT_MARKET = 'TAKE_PROFIT_MARKET',
}

// ------------ Order Side ------------
// This should match OrderSide in Abacus
export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

// ------------ Order TimeInForce ------------
// This should match OrderTimeInForce in Abacus
export enum OrderTimeInForce {
  GTT = 'GTT',
  IOC = 'IOC',
  FOK = 'FOK',
}

// ------------ Order Execution ------------
// This should match OrderExecution in Abacus
export enum OrderExecution {
  DEFAULT = 'DEFAULT',
  IOC = 'IOC',
  FOK = 'FOK',
  POST_ONLY = 'POST_ONLY',
}

// ------------ Order Status ------------
// This should match OrderStatus in Abacus
export enum OrderStatus {
  BEST_EFFORT_OPENED = 'BEST_EFFORT_OPENED',
  OPEN = 'OPEN',
  FILLED = 'FILLED',
  BEST_EFFORT_CANCELED = 'BEST_EFFORT_CANCELED',
  CANCELED = 'CANCELED',
}

export enum TickerType {
  PERPETUAL = 'PERPETUAL',  // Only PERPETUAL is supported right now
}

export enum PositionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  LIQUIDATED = 'LIQUIDATED',
}

// ----------- Time Period for Sparklines -------------

export enum TimePeriod {
  ONE_DAY = 'ONE_DAY',
  SEVEN_DAYS = 'SEVEN_DAYS',
}

// ------------ API Defaults ------------
export const DEFAULT_API_TIMEOUT: number = 3_000;

export const MAX_MEMO_CHARACTERS: number = 256;

// Querying
export const PAGE_REQUEST: PageRequest = {
  key: new Uint8Array(),
  offset: new Long(0),
  limit: new Long(-1),
  countTotal: true,
  reverse: false,
};

export class IndexerConfig {
    public restEndpoint: string;
    public websocketEndpoint: string;

    constructor(restEndpoint: string,
      websocketEndpoint: string) {
      this.restEndpoint = restEndpoint;
      this.websocketEndpoint = websocketEndpoint;
    }
}

export class ValidatorConfig {
  public restEndpoint: string;
  public chainId: string;
  public broadcastOptions?: BroadcastOptions;

  constructor(
    restEndpoint: string,
    chainId: string,
    broadcastOptions?: BroadcastOptions,
  ) {
    if ((restEndpoint?.endsWith('/'))) {
      this.restEndpoint = restEndpoint.slice(0, -1);
    }
    this.restEndpoint = restEndpoint;
    this.chainId = chainId;
    this.broadcastOptions = broadcastOptions;
  }
}

export class Network {
  constructor(
    public env: string,
    public indexerConfig: IndexerConfig,
    public validatorConfig: ValidatorConfig,
  ) {}

  static dev(): Network {
    const indexerConfig = new IndexerConfig(
      IndexerApiHost.DEV,
      IndexerWSHost.DEV,
    );
    const validatorConfig = new ValidatorConfig(ValidatorApiHost.DEV, DEV_CHAIN_ID);
    return new Network('dev', indexerConfig, validatorConfig);
  }

  static staging(): Network {
    const indexerConfig = new IndexerConfig(
      IndexerApiHost.STAGING,
      IndexerWSHost.STAGING,
    );
    const validatorConfig = new ValidatorConfig(ValidatorApiHost.STAGING, STAGING_CHAIN_ID);
    return new Network('staging', indexerConfig, validatorConfig);
  }

  static testnet(): Network {
    const indexerConfig = new IndexerConfig(
      IndexerApiHost.TESTNET,
      IndexerWSHost.TESTNET,
    );
    const validatorConfig = new ValidatorConfig(ValidatorApiHost.TESTNET, TESTNET_CHAIN_ID);
    return new Network('testnet', indexerConfig, validatorConfig);
  }

  // TODO: Add mainnet(): Network

  getString(): string {
    return this.env;
  }
}
