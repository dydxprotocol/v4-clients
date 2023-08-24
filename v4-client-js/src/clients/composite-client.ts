import { EncodeObject } from '@cosmjs/proto-signing';
import { GasPrice, IndexedTx, StdFee } from '@cosmjs/stargate';
import { BroadcastTxAsyncResponse, BroadcastTxSyncResponse } from '@cosmjs/tendermint-rpc/build/tendermint37';
import Long from 'long';
import protobuf from 'protobufjs';

import { OrderFlags } from '../types';
import {
  DYDX_DENOM,
  GAS_PRICE,
  Network, OrderExecution, OrderSide, OrderTimeInForce, OrderType,
} from './constants';
import {
  calculateQuantums,
  calculateSubticks,
  calculateSide,
  calculateTimeInForce,
  calculateOrderFlags,
  calculateClientMetadata,
  calculateConditionType,
  calculateConditionalOrderTriggerSubticks,
} from './helpers/chain-helpers';
import { IndexerClient } from './indexer-client';
import LocalWallet from './modules/local-wallet';
import { Subaccount } from './subaccount';
import { ValidatorClient } from './validator-client';

// Required for encoding and decoding queries that are of type Long.
// Must be done once but since the individal modules should be usable
// - must be set in each module that encounters encoding/decoding Longs.
// Reference: https://github.com/protobufjs/protobuf.js/issues/921
protobuf.util.Long = Long;
protobuf.configure();

export class CompositeClient {
  public readonly network: Network;
  private _indexerClient: IndexerClient;
  private _validatorClient?: ValidatorClient;

  static async connect(network: Network): Promise<CompositeClient> {
    const client = new CompositeClient(network);
    await client.initialize();
    return client;
  }

  private constructor(
    network: Network,
    apiTimeout?: number,
  ) {
    this.network = network;
    this._indexerClient = new IndexerClient(
      network.indexerConfig,
      apiTimeout,
    );
  }

  private async initialize(): Promise<void> {
    this._validatorClient = await ValidatorClient.connect(this.network.validatorConfig);
  }

  get indexerClient(): IndexerClient {
    /**
     * Get the validator client
     */
    return this._indexerClient!;
  }

  get validatorClient(): ValidatorClient {
    /**
     * Get the validator client
     */
    return this._validatorClient!;
  }

  /**
     * @description Sign a list of messages with a wallet.
     * the calling function is responsible for creating the messages.
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The Signature.
     */
  async sign(
    wallet: LocalWallet,
    messaging: () => Promise<EncodeObject[]>,
    zeroFee: boolean,
    gasPrice: GasPrice = GAS_PRICE,
    memo?: string,
  ): Promise<Uint8Array> {
    return this.validatorClient.post.sign(wallet, messaging, zeroFee, gasPrice, memo);
  }

  /**
     * @description Send a list of messages with a wallet.
     * the calling function is responsible for creating the messages.
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The Transaction Hash.
     */
  async send(
    wallet: LocalWallet,
    messaging: () => Promise<EncodeObject[]>,
    zeroFee: boolean,
    gasPrice: GasPrice = GAS_PRICE,
    memo?: string,
  ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
    return this.validatorClient.post.send(wallet, messaging, zeroFee, gasPrice, memo);
  }

  /**
     * @description Send a signed transaction.
     *
     * @param signedTransaction The signed transaction to send.
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The Transaction Hash.
     */
  async sendSignedTransaction(
    signedTransaction: Uint8Array,
  ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
    return this.validatorClient.post.sendSignedTransaction(signedTransaction);
  }

  /**
     * @description Simulate a list of messages with a wallet.
     * the calling function is responsible for creating the messages.
     *
     * To send multiple messages with gas estimate:
     * 1. Client is responsible for creating the messages.
     * 2. Call simulate() to get the gas estimate.
     * 3. Call send() to send the messages.
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The gas estimate.
     */
  async simulate(
    wallet: LocalWallet,
    messaging: () => Promise<EncodeObject[]>,
    gasPrice: GasPrice = GAS_PRICE,
    memo?: string,
  ): Promise<StdFee> {
    return this.validatorClient.post.simulate(wallet, messaging, gasPrice, memo);
  }

  /**
     * @description Calculate the goodTilBlock value for a SHORT_TERM order
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The goodTilBlock value
     */
  private async calculateGoodTilBlock(): Promise<number> {
    const height = await this.validatorClient.get.latestBlockHeight();
    return height + 3;
  }

  /**
     * @description Calculate the goodTilBlockTime value for a LONG_TERM order
     * the calling function is responsible for creating the messages.
     *
     * @param goodTilTimeInSeconds The goodTilTimeInSeconds of the order to place.
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The goodTilBlockTime value
     */
  private calculateGoodTilBlockTime(goodTilTimeInSeconds: number): number {
    const now = new Date();
    const millisecondsPerSecond = 1000;
    const interval = goodTilTimeInSeconds * millisecondsPerSecond;
    const future = new Date(now.valueOf() + interval);
    return Math.round(future.getTime() / 1000);
  }

  /**
     * @description Place an order with human readable input.
     *
     * Only MARKET and LIMIT types are supported right now
     * Use human readable form of input, including price and size
     * The quantum and subticks are calculated and submitted
     *
     * @param subaccount The subaccount to place the order on.
     * @param marketId The market to place the order on.
     * @param type The type of order to place.
     * @param side The side of the order to place.
     * @param price The price of the order to place.
     * @param size The size of the order to place.
     * @param clientId The client id of the order to place.
     * @param timeInForce The time in force of the order to place.
     * @param goodTilTimeInSeconds The goodTilTimeInSeconds of the order to place.
     * @param execution The execution of the order to place.
     * @param postOnly The postOnly of the order to place.
     * @param reduceOnly The reduceOnly of the order to place.
     *
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The transaction hash.
     */
  async placeOrder(
    subaccount: Subaccount,
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
  ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
    const msgs: Promise<EncodeObject[]> = new Promise((resolve) => {
      const msg = this.placeOrderMessage(
        subaccount,
        marketId,
        type,
        side,
        price,
        // trigger_price: number,   // not used for MARKET and LIMIT
        size,
        clientId,
        timeInForce,
        goodTilTimeInSeconds,
        execution,
        postOnly,
        reduceOnly,
        triggerPrice,
      );
      msg.then((it) => resolve([it])).catch((err) => {
        console.log(err);
      });
    });
    return this.send(
      subaccount.wallet,
      () => msgs,
      true);
  }

  /**
     * @description Calculate and create the place order message
     *
     * Only MARKET and LIMIT types are supported right now
     * Use human readable form of input, including price and size
     * The quantum and subticks are calculated and submitted
     *
     * @param subaccount The subaccount to place the order under
     * @param marketId The market to place the order on
     * @param type The type of order to place
     * @param side The side of the order to place
     * @param price The price of the order to place
     * @param size The size of the order to place
     * @param clientId The client id of the order to place
     * @param timeInForce The time in force of the order to place
     * @param goodTilTimeInSeconds The goodTilTimeInSeconds of the order to place
     * @param execution The execution of the order to place
     * @param postOnly The postOnly of the order to place
     * @param reduceOnly The reduceOnly of the order to place
     *
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The message to be passed into the protocol
     */
  private async placeOrderMessage(
    subaccount: Subaccount,
    marketId: string,
    type: OrderType,
    side: OrderSide,
    price: number,
    // trigger_price: number,   // not used for MARKET and LIMIT
    size: number,
    clientId: number,
    timeInForce?: OrderTimeInForce,
    goodTilTimeInSeconds?: number,
    execution?: OrderExecution,
    postOnly?: boolean,
    reduceOnly?: boolean,
    triggerPrice?: number,
  ): Promise<EncodeObject> {
    const marketsResponse = await this.indexerClient.markets.getPerpetualMarkets(marketId);
    const market = marketsResponse.markets[marketId];
    const clobPairId = market.clobPairId;
    const atomicResolution = market.atomicResolution;
    const stepBaseQuantums = market.stepBaseQuantums;
    const quantumConversionExponent = market.quantumConversionExponent;
    const subticksPerTick = market.subticksPerTick;
    const orderSide = calculateSide(side);
    const quantums = calculateQuantums(
      size,
      atomicResolution,
      stepBaseQuantums,
    );
    const subticks = calculateSubticks(
      price,
      atomicResolution,
      quantumConversionExponent,
      subticksPerTick,
    );
    const orderFlags = calculateOrderFlags(type, timeInForce);
    const orderTimeInForce = calculateTimeInForce(type, timeInForce, execution, postOnly);
    const goodTilBlock = (orderFlags === OrderFlags.SHORT_TERM)
      ? await this.calculateGoodTilBlock() : 0;
    let goodTilBlockTime = 0;
    if (orderFlags === OrderFlags.LONG_TERM || orderFlags === OrderFlags.CONDITIONAL) {
      if (goodTilTimeInSeconds == null) {
        throw new Error('goodTilTimeInSeconds must be set for LONG_TERM or CONDITIONAL order');
      } else {
        goodTilBlockTime = await this.calculateGoodTilBlockTime(goodTilTimeInSeconds);
      }
    }
    const clientMetadata = calculateClientMetadata(type);
    const conditionalType = calculateConditionType(type);
    const conditionalOrderTriggerSubticks = calculateConditionalOrderTriggerSubticks(
      type,
      atomicResolution,
      quantumConversionExponent,
      subticksPerTick,
      triggerPrice);
    return this.validatorClient.post.composer.composeMsgPlaceOrder(
      subaccount.address,
      subaccount.subaccountNumber,
      clientId,
      clobPairId,
      orderFlags,
      goodTilBlock,
      goodTilBlockTime,
      orderSide,
      quantums,
      subticks,
      orderTimeInForce,
      reduceOnly ?? false,
      clientMetadata,
      conditionalType,
      conditionalOrderTriggerSubticks,
    );
  }

  /**
     * @description Cancel an order with human readable input.
     *
     * @param subaccount The subaccount to cancel the order from
     * @param clientId The client id of the order to cancel
     * @param orderFlags The order flags of the order to cancel
     * @param clobPairId The clob pair id of the order to cancel
     * @param goodTilBlock The goodTilBlock of the order to cancel
     * @param goodTilBlockTime The goodTilBlockTime of the order to cancel
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The transaction hash.
     */
  async cancelOrder(
    subaccount: Subaccount,
    clientId: number,
    orderFlags: OrderFlags,
    clobPairId: number,
    goodTilBlock?: number,
    goodTilBlockTime?: number,
  ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
    return this.validatorClient.post.cancelOrder(
      subaccount,
      clientId,
      orderFlags,
      clobPairId,
      goodTilBlock,
      goodTilBlockTime,
    );
  }

  /**
     * @description Transfer from a subaccount to another subaccount
     *
     * @param subaccount The subaccount to transfer from
     * @param recipientAddress The recipient address
     * @param recipientSubaccountNumber The recipient subaccount number
     * @param amount The amount to transfer
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The transaction hash.
     */
  async transferToSubaccount(
    subaccount: Subaccount,
    recipientAddress: string,
    recipientSubaccountNumber: number,
    amount: number,
  ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
    const msgs: Promise<EncodeObject[]> = new Promise((resolve) => {
      const msg = this.transferToSubaccountMessage(
        subaccount,
        recipientAddress,
        recipientSubaccountNumber,
        amount,
      );
      resolve([msg]);
    });
    return this.send(
      subaccount.wallet,
      () => msgs,
      true);
  }

  /**
     * @description Create message to transfer from a subaccount to another subaccount
     *
     * @param subaccount The subaccount to transfer from
     * @param recipientAddress The recipient address
     * @param recipientSubaccountNumber The recipient subaccount number
     * @param amount The amount to transfer
     *
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The message
     */
  transferToSubaccountMessage(
    subaccount: Subaccount,
    recipientAddress: string,
    recipientSubaccountNumber: number,
    amount: number,
  ): EncodeObject {
    const quantums: Long = Long.fromNumber(amount * (10 ** 6));
    return this.validatorClient.post.composer.composeMsgTransfer(
      subaccount.address,
      subaccount.subaccountNumber,
      recipientAddress,
      recipientSubaccountNumber,
      0,
      quantums,
    );
  }

  /**
     * @description Deposit from wallet to subaccount
     *
     * @param subaccount The subaccount to deposit to
     * @param amount The amount to deposit
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The transaction hash.
     */
  async depositToSubaccount(
    subaccount: Subaccount,
    amount: number,
  ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
    const msgs: Promise<EncodeObject[]> = new Promise((resolve) => {
      const msg = this.depositToSubaccountMessage(
        subaccount,
        amount,
      );
      resolve([msg]);
    });
    return this.validatorClient.post.send(subaccount.wallet,
      () => msgs,
      true);
  }

  /**
     * @description Create message to deposit from wallet to subaccount
     *
     * @param subaccount The subaccount to deposit to
     * @param amount The amount to deposit
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The message
     */
  depositToSubaccountMessage(
    subaccount: Subaccount,
    amount: number,
  ): EncodeObject {
    const quantums: Long = Long.fromNumber(amount * (10 ** 6));
    return this.validatorClient.post.composer.composeMsgDepositToSubaccount(
      subaccount.address,
      subaccount.subaccountNumber,
      0,
      quantums,
    );
  }

  /**
     * @description Withdraw from subaccount to wallet
     *
     * @param subaccount The subaccount to withdraw from
     * @param amount The amount to withdraw
     * @param recipient The recipient address, default to subaccount address
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The transaction hash
     */
  async withdrawFromSubaccount(
    subaccount: Subaccount,
    amount: number,
    recipient?: string,
  ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
    const msgs: Promise<EncodeObject[]> = new Promise((resolve) => {
      const msg = this.withdrawFromSubaccountMessage(
        subaccount,
        amount,
        recipient,
      );
      resolve([msg]);
    });
    return this.send(
      subaccount.wallet,
      () => msgs,
      true);
  }

  /**
     * @description Create message to withdraw from subaccount to wallet
     * with human readable input.
     *
     * @param subaccount The subaccount to withdraw from
     * @param amount The amount to withdraw
     * @param recipient The recipient address
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The message
     */
  withdrawFromSubaccountMessage(
    subaccount: Subaccount,
    amount: number,
    recipient?: string,
  ): EncodeObject {
    const quantums: Long = Long.fromNumber(amount * (10 ** 6));
    return this.validatorClient.post.composer.composeMsgWithdrawFromSubaccount(
      subaccount.address,
      subaccount.subaccountNumber,
      0,
      quantums,
      recipient,
    );
  }

  /**
     * @description Create message to send dydx token from subaccount to wallet
     * with human readable input.
     *
     * @param subaccount The subaccount to withdraw from
     * @param amount The amount to withdraw
     * @param recipient The recipient address
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The message
     */
  sendTokenMessage(
    subaccount: Subaccount,
    amount: number,
    recipient: string,
  ): EncodeObject {
    const quantums: Long = Long.fromNumber(amount * (10 ** 6));
    return this.validatorClient.post.composer.composeMsgSendToken(
      subaccount.address,
      recipient,
      DYDX_DENOM,
      quantums,
    );
  }

  async signPlaceOrder(
    subaccount: Subaccount,
    marketId: string,
    type: OrderType,
    side: OrderSide,
    price: number,
    // trigger_price: number,   // not used for MARKET and LIMIT
    size: number,
    clientId: number,
    timeInForce: OrderTimeInForce,
    goodTilTimeInSeconds: number,
    execution: OrderExecution,
    postOnly: boolean,
    reduceOnly: boolean,
  ): Promise<string> {
    const msgs: Promise<EncodeObject[]> = new Promise((resolve) => {
      const msg = this.placeOrderMessage(
        subaccount,
        marketId,
        type,
        side,
        price,
        // trigger_price: number,   // not used for MARKET and LIMIT
        size,
        clientId,
        timeInForce,
        goodTilTimeInSeconds,
        execution,
        postOnly,
        reduceOnly,
      );
      msg.then((it) => resolve([it])).catch((err) => {
        console.log(err);
      });
    });
    const signature = await this.sign(
      wallet,
      () => msgs,
      true);

    return Buffer.from(signature).toString('base64');
  }

  async signCancelOrder(
    subaccount: Subaccount,
    clientId: number,
    orderFlags: OrderFlags,
    clobPairId: number,
    goodTilBlock: number,
    goodTilBlockTime: number,
  ): Promise<string> {
    const msgs: Promise<EncodeObject[]> = new Promise((resolve) => {
      const msg = this.validatorClient.post.composer.composeMsgCancelOrder(
        subaccount.address,
        subaccount.subaccountNumber,
        clientId,
        clobPairId,
        orderFlags,
        goodTilBlock,
        goodTilBlockTime,
      );
      resolve([msg]);
    });
    const signature = await this.sign(subaccount.wallet, () => msgs, true);

    return Buffer.from(signature).toString('base64');
  }
}
