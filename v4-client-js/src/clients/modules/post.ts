import { Coin, Secp256k1Pubkey } from '@cosmjs/amino';
import { Uint53 } from '@cosmjs/math';
import {
  EncodeObject,
  Registry,
} from '@cosmjs/proto-signing';
import {
  calculateFee,
  GasPrice,
  IndexedTx,
  StdFee,
} from '@cosmjs/stargate';
import {
  Method,
} from '@cosmjs/tendermint-rpc';
import {
  BroadcastTxAsyncResponse,
  BroadcastTxSyncResponse,
} from '@cosmjs/tendermint-rpc/build/tendermint37';
import _ from 'lodash';
import Long from 'long';
import protobuf from 'protobufjs';

import { DYDX_DENOM, GAS_PRICE_DYDX_DENOM, USDC_DENOM } from '../../lib/constants';
import {
  GAS_MULTIPLIER, GAS_PRICE,
} from '../constants';
import { UnexpectedClientError } from '../lib/errors';
import { generateRegistry } from '../lib/registry';
import { Subaccount } from '../subaccount';
import {
  OrderFlags,
  BroadcastMode,
  TransactionOptions,
  IPlaceOrder,
  ICancelOrder,
} from '../types';
import { Composer } from './composer';
import { Get } from './get';
import LocalWallet from './local-wallet';
import {
  GasInfo, Order_Side, Order_TimeInForce, Any, MsgPlaceOrder, Order_ConditionType,
} from './proto-includes';

// Required for encoding and decoding queries that are of type Long.
// Must be done once but since the individal modules should be usable
// - must be set in each module that encounters encoding/decoding Longs.
// Reference: https://github.com/protobufjs/protobuf.js/issues/921
protobuf.util.Long = Long;
protobuf.configure();

export class Post {
    public readonly composer: Composer;
    private readonly registry: Registry;
    private readonly chainId: string;
    public readonly get: Get;

    constructor(
      get: Get,
      chainId: string,
    ) {
      this.get = get;
      this.chainId = chainId;
      this.registry = generateRegistry();
      this.composer = new Composer();
    }

    /**
     * @description Simulate a transaction
     * the calling function is responsible for creating the messages.
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The Fee for broadcasting a transaction.
     */
    async simulate(
      wallet: LocalWallet,
      messaging: () => Promise<EncodeObject[]>,
      gasPrice: GasPrice = GAS_PRICE,
      memo?: string,
    ): Promise<StdFee> {
      const msgs = await messaging();
      const account = await this.get.getAccount(wallet.address!);
      return this.simulateTransaction(wallet.pubKey!, account.sequence, msgs, gasPrice, memo);
    }

    /**
     * @description Sign a transaction
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
      const msgs = await messaging();
      return this.signTransaction(wallet, msgs, zeroFee, gasPrice, memo);
    }

    /**
     * @description Send a transaction
     * the calling function is responsible for creating the messages.
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The Tx Hash.
     */
    async send(
      wallet: LocalWallet,
      messaging: () => Promise<EncodeObject[]>,
      zeroFee: boolean,
      gasPrice: GasPrice = GAS_PRICE,
      memo?: string,
      broadcastMode?: BroadcastMode,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const msgs = await messaging();
      return this.signAndSendTransaction(
        wallet,
        msgs,
        zeroFee,
        gasPrice,
        memo,
        broadcastMode ?? this.defaultBroadcastMode(msgs),
      );
    }

    /**
     * @description Calculate the default broadcast mode.
     */
    private defaultBroadcastMode(msgs: EncodeObject[]): BroadcastMode {
      if (msgs.length === 1 && msgs[0].typeUrl === '/dydxprotocol.clob.MsgPlaceOrder') {
        const msg = msgs[0].value as MsgPlaceOrder;
        const orderFlags = msg.order?.orderId?.orderFlags;
        switch (orderFlags) {
          case OrderFlags.SHORT_TERM:
            return Method.BroadcastTxSync;

          case OrderFlags.LONG_TERM:
            return Method.BroadcastTxCommit;

          default:
            break;
        }
      }
      return Method.BroadcastTxSync;
    }

    /**
     * @description Sign and send a message
     *
     * @returns The Tx Response.
     */
    private async signTransaction(
      wallet: LocalWallet,
      messages: EncodeObject[],
      zeroFee: boolean,
      gasPrice: GasPrice = GAS_PRICE,
      memo?: string,
    ): Promise<Uint8Array> {
      const account = await this.get.getAccount(wallet.address!);
      // Simulate transaction if no fee is specified.
      const fee: StdFee = zeroFee ? {
        amount: [],
        gas: '1000000',
      } : await this.simulateTransaction(
        wallet.pubKey!,
        account.sequence,
        messages,
        gasPrice,
        memo,
      );

      const txOptions: TransactionOptions = {
        sequence: account.sequence,
        accountNumber: account.accountNumber,
        chainId: this.chainId,
      };
      // Generate signed transaction.
      return wallet.signTransaction(
        messages,
        txOptions,
        fee,
        memo,
      );
    }

    /**
     * @description Sign and send a message
     *
     * @returns The Tx Response.
     */
    private async signAndSendTransaction(
      wallet: LocalWallet,
      messages: EncodeObject[],
      zeroFee: boolean,
      gasPrice: GasPrice = GAS_PRICE,
      memo?: string,
      broadcastMode?: BroadcastMode,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const signedTransaction = await this.signTransaction(
        wallet,
        messages,
        zeroFee,
        gasPrice,
        memo,
      );
      return this.sendSignedTransaction(signedTransaction, broadcastMode);
    }

    /**
     * @description Send signed transaction.
     *
     * @returns The Tx Response.
     */
    async sendSignedTransaction(
      signedTransaction: Uint8Array,
      broadcastMode?: BroadcastMode,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      return this.get.tendermintClient.broadcastTransaction(
        signedTransaction,
        broadcastMode !== undefined
          ? broadcastMode
          : Method.BroadcastTxSync,
      );
    }

    /**
     * @description Simulate broadcasting a transaction.
     *
     * @throws UnexpectedClientError if a malformed response is returned with no GRPC error
     * at any point.
     * @returns The Fee for broadcasting a transaction.
     */
    private async simulateTransaction(
      pubKey: Secp256k1Pubkey,
      sequence: number,
      messages: readonly EncodeObject[],
      gasPrice: GasPrice = GAS_PRICE,
      memo?: string,
    ): Promise<StdFee> {
      // Get simulated response.
      const encodedMessages: Any[] = messages.map(
        (message: EncodeObject) => this.registry.encodeAsAny(message),
      );
      const simulationResponse = await this.get.stargateQueryClient.tx.simulate(
        encodedMessages,
        memo,
        pubKey,
        sequence,
      );

      // Pull gasInfo out of simulated response.
      const gasInfo: GasInfo | undefined = simulationResponse.gasInfo;

      // The promise should have been rejected if the gasInfo was undefined.
      if (gasInfo === undefined) {
        throw new UnexpectedClientError();
      }

      // Calculate and return fee from gasEstimate.
      const gasEstimate: number = Uint53.fromString(gasInfo.gasUsed.toString()).toNumber();
      const fee = calculateFee(
        Math.floor(gasEstimate * GAS_MULTIPLIER),
        gasPrice,
      );

      // TODO(TRCL-2550): Temporary workaround before IBC denom is supported in '@cosmjs/stargate'.
      // The '@cosmjs/stargate' does not support denom with '/', so currently GAS_PRICE is
      // represented in 'uusdc', and the output of `calculateFee` is in '', which is replaced
      // below by USDC_DENOM string.
      const amount: Coin[] = _.map(fee.amount, (coin: Coin) => {
        if (coin.denom === 'uusdc') {
          return {
            amount: coin.amount,
            denom: USDC_DENOM,
          };
        }
        return coin;
      });

      return {
        ...fee,
        amount,
      };
    }

    // ------ State-Changing Requests ------ //

    async placeOrder(
      subaccount: Subaccount,
      clientId: number,
      clobPairId: number,
      side: Order_Side,
      quantums: Long,
      subticks: Long,
      timeInForce: Order_TimeInForce,
      orderFlags: number,
      reduceOnly: boolean,
      goodTilBlock?: number,
      goodTilBlockTime?: number,
      clientMetadata: number = 0,
      conditionType: Order_ConditionType = Order_ConditionType.CONDITION_TYPE_UNSPECIFIED,
      conditionalOrderTriggerSubticks: Long = Long.fromInt(0),
      broadcastMode?: BroadcastMode,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const msgs: Promise<EncodeObject[]> = new Promise((resolve) => {
        const msg = this.composer.composeMsgPlaceOrder(
          subaccount.address,
          subaccount.subaccountNumber,
          clientId,
          clobPairId,
          orderFlags,
          goodTilBlock ?? 0,
          goodTilBlockTime ?? 0,
          side,
          quantums,
          subticks,
          timeInForce,
          reduceOnly,
          clientMetadata,
          conditionType,
          conditionalOrderTriggerSubticks,
        );
        resolve([msg]);
      });
      return this.send(subaccount.wallet, () => msgs, true, undefined, undefined, broadcastMode);
    }

    async placeOrderObject(
      subaccount: Subaccount,
      placeOrder: IPlaceOrder,
      broadcastMode?: BroadcastMode,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      return this.placeOrder(
        subaccount,
        placeOrder.clientId,
        placeOrder.clobPairId,
        placeOrder.side,
        placeOrder.quantums,
        placeOrder.subticks,
        placeOrder.timeInForce,
        placeOrder.orderFlags,
        placeOrder.reduceOnly,
        placeOrder.goodTilBlock,
        placeOrder.goodTilBlockTime,
        placeOrder.clientMetadata,
        placeOrder.conditionType ?? Order_ConditionType.CONDITION_TYPE_UNSPECIFIED,
        placeOrder.conditionalOrderTriggerSubticks ?? Long.fromInt(0),
        broadcastMode,
      );
    }

    async cancelOrder(
      subaccount: Subaccount,
      clientId: number,
      orderFlags: OrderFlags,
      clobPairId: number,
      goodTilBlock?: number,
      goodTilBlockTime?: number,
      broadcastMode?: BroadcastMode,
    ) : Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const msgs: Promise<EncodeObject[]> = new Promise((resolve) => {
        const msg = this.composer.composeMsgCancelOrder(
          subaccount.address,
          subaccount.subaccountNumber,
          clientId,
          clobPairId,
          orderFlags,
          goodTilBlock ?? 0,
          goodTilBlockTime ?? 0,
        );
        resolve([msg]);
      });
      return this.send(subaccount.wallet, () => msgs, true, undefined, undefined, broadcastMode);
    }

    async cancelOrderObject(
      subaccount: Subaccount,
      cancelOrder: ICancelOrder,
      broadcastMode?: BroadcastMode,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      return this.cancelOrder(
        subaccount,
        cancelOrder.clientId,
        cancelOrder.orderFlags,
        cancelOrder.clobPairId,
        cancelOrder.goodTilBlock,
        cancelOrder.goodTilBlockTime,
        broadcastMode,
      );
    }

    async transfer(
      subaccount: Subaccount,
      recipientAddress: string,
      recipientSubaccountNumber: number,
      assetId: number,
      amount: Long,
      broadcastMode?: BroadcastMode,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const msgs: Promise<EncodeObject[]> = new Promise((resolve) => {
        const msg = this.composer.composeMsgTransfer(
          subaccount.address,
          subaccount.subaccountNumber,
          recipientAddress,
          recipientSubaccountNumber,
          assetId,
          amount,
        );
        resolve([msg]);
      });
      return this.send(subaccount.wallet, () => msgs, false, undefined, undefined, broadcastMode);
    }

    async deposit(
      subaccount: Subaccount,
      assetId: number,
      quantums: Long,
      broadcastMode?: BroadcastMode,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const msgs: Promise<EncodeObject[]> = new Promise((resolve) => {
        const msg = this.composer.composeMsgDepositToSubaccount(
          subaccount.address,
          subaccount.subaccountNumber,
          assetId,
          quantums,
        );
        resolve([msg]);
      });
      return this.send(subaccount.wallet, () => msgs, false, undefined, undefined, broadcastMode);
    }

    async withdraw(
      subaccount: Subaccount,
      assetId: number,
      quantums: Long,
      recipient?: string,
      broadcastMode?: BroadcastMode,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const msgs: Promise<EncodeObject[]> = new Promise((resolve) => {
        const msg = this.composer.composeMsgWithdrawFromSubaccount(
          subaccount.address,
          subaccount.subaccountNumber,
          assetId,
          quantums,
          recipient,
        );
        resolve([msg]);
      });
      return this.send(subaccount.wallet, () => msgs, false, undefined, undefined, broadcastMode);
    }

    async sendToken(
      subaccount: Subaccount,
      recipient: string,
      coinDenom: string,
      quantums: Long,
      zeroFee: boolean = true,
      broadcastMode?: BroadcastMode,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const msgs: Promise<EncodeObject[]> = new Promise((resolve) => {
        const msg = this.composer.composeMsgSendToken(
          subaccount.address,
          recipient,
          coinDenom,
          quantums,
        );
        resolve([msg]);
      });
      return this.send(
        subaccount.wallet,
        () => msgs,
        zeroFee,
        coinDenom === DYDX_DENOM ? GAS_PRICE_DYDX_DENOM : GAS_PRICE,
        undefined,
        broadcastMode,
      );
    }
}
