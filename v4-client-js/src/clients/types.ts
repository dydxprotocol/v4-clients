import { Coin } from '@cosmjs/proto-signing';
import { Method } from '@cosmjs/tendermint-rpc';
import { Order_ConditionType, Order_Side, Order_TimeInForce } from '@dydxprotocol/v4-proto/src/codegen/dydxprotocol/clob/order';
import BigNumber from 'bignumber.js';
import Long from 'long';

export type Integer = BigNumber;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericParams = { [name: string]: any };

// TODO: Find a better way.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Data = any;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

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

// Information for signing a transaction while offline - without sequence.
export interface PartialTransactionOptions {
  accountNumber: number;
  chainId: string;
}

// Information for signing a transaction while offline.
export interface TransactionOptions extends PartialTransactionOptions {
  sequence: number;
}

// OrderFlags, just a number in proto, defined as enum for convenience
export enum OrderFlags {
  SHORT_TERM = 0,
  LONG_TERM = 64,
  CONDITIONAL = 32,
}

export interface IHumanReadableShortTermOrder {
  marketId: string,
  side: OrderSide,
  price: number,
  size: number,
  clientId: number,
  goodTilBlock: number,
  timeInForce: Order_TimeInForce,
  reduceOnly: boolean,
}

export interface IHumanReadableOrder {
  marketId: string,
  type: OrderType,
  side: OrderSide,
  price: number,
  size: number,
  clientId: number,
  timeInForce?: OrderTimeInForce,
  goodTilTimeInSeconds?: number,
  execution?: OrderExecution,
  postOnly?: boolean,
  reduceOnly?: boolean,
  triggerPrice?: number,
  marketInfo?: MarketInfo,
  currentHeight?: number,
}

export interface IHumanReadableTransfer {
  recipientAddress: string,
  recipientSubaccountNumber: number,
  amount: string,
}

export interface IHumanReadableDeposit {
  amount: string,
}

export interface IHumanReadableWithdraw {
  amount: string,
  recipient?: string,
}

export interface IHumanReadableSendToken {
  amount: string,
  recipient: string,
}

export interface IBasicOrder {
  clientId: number;
  orderFlags: OrderFlags,
  clobPairId: number;
  goodTilBlock?: number;
  goodTilBlockTime?: number;
}

export interface IPlaceOrder extends IBasicOrder {
  side: Order_Side;
  quantums: Long;
  subticks: Long;
  timeInForce: Order_TimeInForce,
  reduceOnly: boolean;
  clientMetadata: number;
  conditionType?: Order_ConditionType,
  conditionalOrderTriggerSubticks?: Long,
}

export interface ICancelOrder extends IBasicOrder {
}

export interface ITransfer {
  recipientAddress: string,
  recipientSubaccountNumber: number,
  assetId: number,
  amount: Long,
}

export interface IDeposit {
  assetId: number,
  quantums: Long,
}

export interface IWithdraw {
  assetId: number,
  quantums: Long,
  recipient?: string,
}

export interface ISendToken {
  recipient: string,
  coinDenom: string,
  quantums: string,
}

export interface MarketInfo {
  clobPairId: number;
  atomicResolution: number;
  stepBaseQuantums: number;
  quantumConversionExponent: number;
  subticksPerTick: number;
}

// How long to wait and how often to check when calling Broadcast with
// Method.BroadcastTxCommit
export interface BroadcastOptions {
  broadcastPollIntervalMs: number;
  broadcastTimeoutMs: number;
}

export interface DenomConfig {
  USDC_DENOM: string;
  USDC_DECIMALS: number;
  USDC_GAS_DENOM?: string;

  CHAINTOKEN_DENOM: string;
  CHAINTOKEN_DECIMALS: number;
  CHAINTOKEN_GAS_DENOM?: string;
}

// Specify when a broadcast should return:
// 1. Immediately
// 2. Once the transaction is added to the memPool
// 3. Once the transaction is committed to a block
// See https://docs.cosmos.network/master/run-node/txs.html for more information
export type BroadcastMode = (
  Method.BroadcastTxAsync | Method.BroadcastTxSync | Method.BroadcastTxCommit
);

// ------ Utility Endpoint Responses ------ //
export interface TimeResponse {
  iso: string;
  epoch: number;
}

export interface HeightResponse {
  height: number;
  time: string;
}

export interface ComplianceResponse {
  restricted: boolean;
}

// ------------ Squid ------------ //
export type SquidIBCPayload = {
  msgTypeUrl: '/ibc.applications.transfer.v1.MsgTransfer';
  msg: Partial<{
    sourcePort: string;
    sourceChannel: string;
    token: Coin;
    sender: string;
    receiver: string;
    timeoutTimestamp: Long;
    memo: string;
  }>;
};

// ------------ x/gov: Add New Market ------------ //
export type GovAddNewMarketParams = {
  // common
  id: number;
  ticker: string;

  // x/prices
  priceExponent: number;
  minPriceChange: number;
  minExchanges: number;
  exchangeConfigJson: string;

  // x/perpetuals
  liquidityTier: number;
  atomicResolution: number;

  // x/clob
  quantumConversionExponent: number;
  stepBaseQuantums: Long;
  subticksPerTick: number;

  // x/delaymsg
  delayBlocks: number;
};

export * from './modules/proto-includes';
