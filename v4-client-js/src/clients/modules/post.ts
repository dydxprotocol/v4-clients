import { Coin, Secp256k1Pubkey } from '@cosmjs/amino';
import { Uint53 } from '@cosmjs/math';
import {
  EncodeObject,
  Registry,
} from '@cosmjs/proto-signing';
import {
  Account,
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

import { GAS_MULTIPLIER } from '../constants';
import { UnexpectedClientError } from '../lib/errors';
import { generateRegistry } from '../lib/registry';
import { SubaccountInfo } from '../subaccount';
import {
  OrderFlags,
  BroadcastMode,
  TransactionOptions,
  IPlaceOrder,
  ICancelOrder,
  DenomConfig,
  ISendToken,
  IWithdraw,
  IDeposit,
  ITransfer,
} from '../types';
import { Composer } from './composer';
import { Get } from './get';
import LocalWallet from './local-wallet';
import {
  Order_Side, Order_TimeInForce, Any, MsgPlaceOrder, MsgCancelOrder, Order_ConditionType,
} from './proto-includes';

// Required for encoding and decoding queries that are of type Long.
// Must be done once but since the individal modules should be usable
// - must be set in each module that encounters encoding/decoding Longs.
// Reference: https://github.com/protobufjs/protobuf.js/issues/921
protobuf.util.Long = Long;
protobuf.configure();

export enum TransactionType {
  PLACE_ORDER = 'placeOrder',
  CANCEL_ORDER = 'cancelOrder',
  TRANSFER = 'transfer',
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  SEND_TOKEN = 'sendToken',
}

export class TransactionMsg {
  public type: TransactionType;
  public params: (
    IPlaceOrder |
    ICancelOrder |
    ITransfer |
    IDeposit |
    IWithdraw |
    ISendToken
  );

  public zeroFee?: boolean;
  public memo?: string;
  public broadcastMode?: BroadcastMode;

  constructor(
    type: TransactionType,
    params: (
      IPlaceOrder |
      ICancelOrder |
      ITransfer |
      IDeposit |
      IWithdraw |
      ISendToken
    ),
    zeroFee?: boolean,
    memo?: string,
    broadcastMode?: BroadcastMode,
  ) {
    this.type = type;
    this.params = params;
    this.zeroFee = zeroFee;
    this.memo = memo;
    this.broadcastMode = broadcastMode;
  }
}

export class Post {
    public readonly composer: Composer;
    private readonly registry: Registry;
    private readonly chainId: string;
    public readonly get: Get;
    public readonly denoms: DenomConfig;
    public readonly defaultClientMemo?: string;

    public readonly defaultGasPrice: GasPrice;
    public readonly defaultDydxGasPrice: GasPrice;

    private accountNumberCache: Map<string, Account> = new Map();

    constructor(
      get: Get,
      chainId: string,
      denoms: DenomConfig,
      defaultClientMemo?: string,
    ) {
      this.get = get;
      this.chainId = chainId;
      this.registry = generateRegistry();
      this.composer = new Composer();
      this.denoms = denoms;
      this.defaultClientMemo = defaultClientMemo;
      this.defaultGasPrice = GasPrice
        .fromString(`0.025${denoms.USDC_GAS_DENOM !== undefined ? denoms.USDC_GAS_DENOM : denoms.USDC_DENOM}`);
      this.defaultDydxGasPrice = GasPrice
        .fromString(`25000000000${denoms.CHAINTOKEN_GAS_DENOM !== undefined ? denoms.CHAINTOKEN_GAS_DENOM : denoms.CHAINTOKEN_DENOM}`);
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
      gasPrice: GasPrice = this.defaultGasPrice,
      memo?: string,
      account?: () => Promise<Account>,
    ): Promise<StdFee> {
      const msgsPromise = messaging();
      const accountPromise = account ? (await account()) : this.account(wallet.address!);
      const msgsAndAccount = await Promise.all([msgsPromise, accountPromise]);
      const msgs = msgsAndAccount[0];

      return this.simulateTransaction(
        wallet.pubKey!,
        msgsAndAccount[1].sequence,
        msgs,
        gasPrice,
        memo,
      );
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
      gasPrice: GasPrice = this.defaultGasPrice,
      memo?: string,
      account?: () => Promise<Account>,
    ): Promise<Uint8Array> {
      const msgsPromise = await messaging();
      const accountPromise = account ? (await account()) : this.account(wallet.address!);
      const msgsAndAccount = await Promise.all([msgsPromise, accountPromise]);
      const msgs = msgsAndAccount[0];
      return this.signTransaction(wallet, msgs, msgsAndAccount[1], zeroFee, gasPrice, memo);
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
      gasPrice: GasPrice = this.defaultGasPrice,
      memo?: string,
      broadcastMode?: BroadcastMode,
      account?: () => Promise<Account>,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const msgsPromise = messaging();
      const accountPromise = account ? (await account()) : this.account(wallet.address!);
      const msgsAndAccount = await Promise.all([msgsPromise, accountPromise]);
      const msgs = msgsAndAccount[0];

      return this.signAndSendTransaction(
        wallet,
        msgsAndAccount[1],
        msgs,
        zeroFee,
        gasPrice,
        memo ?? this.defaultClientMemo,
        broadcastMode ?? this.defaultBroadcastMode(msgs),
      );
    }

    /**
     * @description Calculate the default broadcast mode.
     */
    private defaultBroadcastMode(msgs: EncodeObject[]): BroadcastMode {
      return this.areShortTermOrderMsgs(msgs) ? Method.BroadcastTxSync : Method.BroadcastTxCommit;
    }

    /**
     * @description Calculate the default broadcast mode for a msg.
     */
    private defaultMsgBroadcastMode(msg: EncodeObject): BroadcastMode {
      if (this.isShortTermOrderMsg(msg)) {
        return Method.BroadcastTxSync;
      } else {
        return Method.BroadcastTxCommit;
      }
    }

    /**
     * @description Whether the msg is a short term placeOrder or cancelOrder msg.
     */
    private isShortTermOrderMsg(msg: EncodeObject): boolean {
      if (msg.typeUrl === '/dydxprotocol.clob.MsgPlaceOrder' ||
          msg.typeUrl === '/dydxprotocol.clob.MsgCancelOrder') {
        const orderFlags = msg.typeUrl === '/dydxprotocol.clob.MsgPlaceOrder'
          ? (msg.value as MsgPlaceOrder).order?.orderId?.orderFlags
          : (msg.value as MsgCancelOrder).orderId?.orderFlags;

        return orderFlags === OrderFlags.SHORT_TERM;
      } else {
        return false;
      }
    }

    /**
     * @description Whether the msg is a short term placeOrder or cancelOrder msg.
     */
    private isOrderMsg(msg: EncodeObject): boolean {
      return (msg.typeUrl === '/dydxprotocol.clob.MsgPlaceOrder' ||
          msg.typeUrl === '/dydxprotocol.clob.MsgCancelOrder');
    }

    /**
     * @description All msgs are short term orders
     */
    private areShortTermOrderMsgs(msgs: EncodeObject[]): boolean {
      const notShortTerm = msgs.find((msg) => {
        return this.isShortTermOrderMsg(msg) === false;
      });
      return !notShortTerm;
    }

    /**
     * @description All msgs are orders
     */
    private areOrderMsgs(msgs: EncodeObject[]): boolean {
      const notOrder = msgs.find((msg) => {
        return this.isOrderMsg(msg) === false;
      });
      return !notOrder;
    }

    /**
     * @description Sign and send a message
     *
     * @returns The Tx Response.
     */
    private async signTransaction(
      wallet: LocalWallet,
      messages: EncodeObject[],
      account: Account,
      zeroFee: boolean,
      gasPrice: GasPrice = this.defaultGasPrice,
      memo?: string,
    ): Promise<Uint8Array> {
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
     * @description Retrieve an account structure for transactions.
     * For short term orders, the sequence doesn't matter. Use cached if available.
     * For long term and conditional orders, a round trip to validator must be made.
     */
    public async account(address: string, orderFlags?: OrderFlags): Promise<Account> {
      return this.updatedAccount(address, (orderFlags === OrderFlags.SHORT_TERM));
    }

    /**
     * @description Retrieve an account structure for transactions.
     * For short term orders, the sequence doesn't matter. Use cached if available.
     * For long term and conditional orders, a round trip to validator must be made.
     */
    public async updatedAccount(address: string, cached: boolean): Promise<Account> {
      if (cached) {
        if (this.accountNumberCache.has(address)) {
          // For SHORT_TERM orders, the sequence doesn't matter
          return this.accountNumberCache.get(address)!;
        }
      }
      const account = await this.get.getAccount(address);
      this.accountNumberCache.set(address, account);
      return account;
    }

    /**
     * @description Sign and send a message
     *
     * @returns The Tx Response.
     */
    private async signAndSendTransaction(
      wallet: LocalWallet,
      account: Account,
      messages: EncodeObject[],
      zeroFee: boolean,
      gasPrice: GasPrice = this.defaultGasPrice,
      memo?: string,
      broadcastMode?: BroadcastMode,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const signedTransaction = await this.signTransaction(
        wallet,
        messages,
        account,
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
      gasPrice: GasPrice = this.defaultGasPrice,
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

      // The promise should have been rejected if the gasInfo was undefined.
      if (simulationResponse.gasInfo === undefined) {
        throw new UnexpectedClientError();
      }

      // Calculate and return fee from gasEstimate.
      const gasEstimate: number = Uint53.fromString(
        simulationResponse.gasInfo.gasUsed.toString(),
      ).toNumber();
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
            denom: this.denoms.USDC_DENOM,
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
      subaccount: SubaccountInfo,
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
      const params: IPlaceOrder = {
        clientId,
        clobPairId,
        side,
        quantums,
        subticks,
        timeInForce,
        orderFlags,
        reduceOnly,
        goodTilBlock,
        goodTilBlockTime,
        clientMetadata,
        conditionType,
        conditionalOrderTriggerSubticks,
      };
      const msgs = await this.placeOrderMsgs(
        subaccount,
        params,
      );
      const account: Promise<Account> = this.account(subaccount.address, orderFlags);
      return this.send(
        subaccount.wallet,
        () => Promise.resolve(msgs),
        true,
        undefined,
        undefined,
        broadcastMode,
        () => account,
      );
    }

    async placeOrderMsgs(
      subaccount: SubaccountInfo,
      params: IPlaceOrder,
    ): Promise<EncodeObject[]> {
      const { address, subaccountNumber } = subaccount;
      const {
        clientId,
        clobPairId,
        side,
        quantums,
        subticks,
        timeInForce,
        orderFlags,
        reduceOnly,
        goodTilBlock,
        goodTilBlockTime,
        clientMetadata,
        conditionType,
        conditionalOrderTriggerSubticks,
      } = params;
      return new Promise((resolve) => {
        const msg = this.composer.composeMsgPlaceOrder(
          address,
          subaccountNumber,
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
    }

    async placeOrderObject(
      subaccount: SubaccountInfo,
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
      subaccount: SubaccountInfo,
      clientId: number,
      orderFlags: OrderFlags,
      clobPairId: number,
      goodTilBlock?: number,
      goodTilBlockTime?: number,
      broadcastMode?: BroadcastMode,
    ) : Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const params: ICancelOrder = {
        clientId,
        orderFlags,
        clobPairId,
        goodTilBlock,
        goodTilBlockTime,
      };
      const msgs = await this.cancelOrderMsgs(
        subaccount,
        params,
      );
      return this.send(
        subaccount.wallet,
        () => Promise.resolve(msgs),
        true,
        undefined,
        undefined,
        broadcastMode);
    }

    async cancelOrderMsgs(
      subaccount: SubaccountInfo,
      params: ICancelOrder,
    ) : Promise<EncodeObject[]> {
      const { address, subaccountNumber } = subaccount;
      const {
        clientId,
        orderFlags,
        clobPairId,
        goodTilBlock,
        goodTilBlockTime,
      } = params;
      return new Promise((resolve) => {
        const msg = this.composer.composeMsgCancelOrder(
          address,
          subaccountNumber,
          clientId,
          clobPairId,
          orderFlags,
          goodTilBlock ?? 0,
          goodTilBlockTime ?? 0,
        );
        resolve([msg]);
      });
    }

    async cancelOrderObject(
      subaccount: SubaccountInfo,
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
      subaccount: SubaccountInfo,
      recipientAddress: string,
      recipientSubaccountNumber: number,
      assetId: number,
      amount: Long,
      broadcastMode?: BroadcastMode,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const params: ITransfer = {
        recipientAddress,
        recipientSubaccountNumber,
        assetId,
        amount,
      };
      const msgs = await this.transferMsgs(
        subaccount,
        params,
      );
      return this.send(
        subaccount.wallet,
        () => Promise.resolve(msgs),
        false,
        undefined,
        undefined,
        broadcastMode,
      );
    }

    async transferMsgs(
      subaccount: SubaccountInfo,
      params: ITransfer,
    ): Promise<EncodeObject[]> {
      const { address, subaccountNumber } = subaccount;
      const {
        recipientAddress,
        recipientSubaccountNumber,
        assetId,
        amount,
      } = params;
      return new Promise((resolve) => {
        const msg = this.composer.composeMsgTransfer(
          address,
          subaccountNumber,
          recipientAddress,
          recipientSubaccountNumber,
          assetId,
          amount,
        );
        resolve([msg]);
      });
    }

    async deposit(
      subaccount: SubaccountInfo,
      assetId: number,
      quantums: Long,
      broadcastMode?: BroadcastMode,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const params: IDeposit = {
        assetId,
        quantums,
      };
      const msgs = await this.depositMsgs(
        subaccount,
        params,
      );
      return this.send(
        subaccount.wallet,
        () => Promise.resolve(msgs),
        false,
        undefined,
        undefined,
        broadcastMode,
      );
    }

    async depositMsgs(
      subaccount: SubaccountInfo,
      params: IDeposit,
    ): Promise<EncodeObject[]> {
      const { address, subaccountNumber } = subaccount;
      const {
        assetId,
        quantums,
      } = params;
      return new Promise((resolve) => {
        const msg = this.composer.composeMsgDepositToSubaccount(
          address,
          subaccountNumber,
          assetId,
          quantums,
        );
        resolve([msg]);
      });
    }

    async withdraw(
      subaccount: SubaccountInfo,
      assetId: number,
      quantums: Long,
      recipient?: string,
      broadcastMode?: BroadcastMode,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const params: IWithdraw = {
        assetId,
        quantums,
        recipient: recipient ?? subaccount.wallet.address!,
      };
      const msgs = await this.withdrawMsgs(
        subaccount,
        params,
      );
      return this.send(
        subaccount.wallet,
        () => Promise.resolve(msgs),
        false,
        undefined,
        undefined,
        broadcastMode,
      );
    }

    async withdrawMsgs(
      subaccount: SubaccountInfo,
      params: IWithdraw,
    ): Promise<EncodeObject[]> {
      const { address, subaccountNumber } = subaccount;
      const {
        assetId,
        quantums,
        recipient,
      } = params;
      return new Promise((resolve) => {
        const msg = this.composer.composeMsgWithdrawFromSubaccount(
          address,
          subaccountNumber,
          assetId,
          quantums,
          recipient,
        );
        resolve([msg]);
      });
    }

    async sendToken(
      subaccount: SubaccountInfo,
      recipient: string,
      coinDenom: string,
      quantums: string,
      zeroFee: boolean = true,
      broadcastMode?: BroadcastMode,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const params: ISendToken = {
        recipient,
        coinDenom,
        quantums,
      };
      const msgs = await this.sendTokenMsgs(
        subaccount,
        params,
      );
      return this.send(
        subaccount.wallet,
        () => Promise.resolve(msgs),
        zeroFee,
        coinDenom === this.denoms.CHAINTOKEN_DENOM
          ? this.defaultDydxGasPrice
          : this.defaultGasPrice,
        undefined,
        broadcastMode,
      );
    }

    async sendTokenMsgs(
      subaccount: SubaccountInfo,
      params: ISendToken,
    ): Promise<EncodeObject[]> {
      const { address } = subaccount;
      const {
        recipient,
        coinDenom,
        quantums,
      } = params;
      if (coinDenom !== this.denoms.CHAINTOKEN_DENOM && coinDenom !== this.denoms.USDC_DENOM) {
        throw new Error('Unsupported coinDenom');
      }
      return new Promise((resolve) => {
        const msg = this.composer.composeMsgSendToken(
          address,
          recipient,
          coinDenom,
          quantums,
        );
        resolve([msg]);
      });
    }

    async msgs(
      subaccount: SubaccountInfo,
      transactionMsg: TransactionMsg,
    ): Promise<EncodeObject[]> {
      switch (transactionMsg.type) {
        case TransactionType.PLACE_ORDER:
          return this.placeOrderMsgs(subaccount, transactionMsg.params as IPlaceOrder);

        case TransactionType.CANCEL_ORDER:
          return this.cancelOrderMsgs(subaccount, transactionMsg.params as ICancelOrder);

        case TransactionType.TRANSFER:
          return this.transferMsgs(subaccount, transactionMsg.params as ITransfer);

        case TransactionType.DEPOSIT:
          return this.depositMsgs(subaccount, transactionMsg.params as IDeposit);

        case TransactionType.WITHDRAW:
          return this.withdrawMsgs(subaccount, transactionMsg.params as IWithdraw);

        case TransactionType.SEND_TOKEN:
          return this.sendTokenMsgs(subaccount, transactionMsg.params as ISendToken);

        default:
          throw new Error('Unsupported transaction type');
      }
    }

    async sendMsg(
      subaccount: SubaccountInfo,
      transactionMsg: TransactionMsg,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const msgs = await this.msgs(subaccount, transactionMsg);
      return this.send(
        subaccount.wallet,
        () => Promise.resolve(msgs),
        transactionMsg.zeroFee ?? false,
        this.defaultGasPrice,
        transactionMsg.memo ?? this.defaultClientMemo,
        transactionMsg.broadcastMode ?? this.defaultBroadcastMode(msgs),
      );
    }

    async sendTransactionMsgs(
      subaccount: SubaccountInfo,
      transactionMsgs: TransactionMsg[],
      memo?: string,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const msgs = (await Promise.all(
        transactionMsgs.map((transactionMsg) => this.msgs(subaccount, transactionMsg)),
      )).flat();
      return this.sendMsgs(subaccount, msgs, memo);
    }

    async sendMsgs(
      subaccount: SubaccountInfo,
      msgs: EncodeObject[],
      memo?: string,
    ): Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx> {
      const shortTermOrders = this.areShortTermOrderMsgs(msgs);
      const zeroFee = this.areOrderMsgs(msgs);
      const mode = shortTermOrders ? Method.BroadcastTxSync : Method.BroadcastTxCommit;

      const account: Promise<Account> = this.updatedAccount(
        subaccount.address,
        shortTermOrders,
      );
      return this.send(
        subaccount.wallet,
        () => Promise.resolve(msgs.flat()),
        zeroFee,
        this.defaultGasPrice,
        memo ?? this.defaultClientMemo,
        mode,
        () => account,
      );
    }

    /**
   * @description Submit a list of msgs as one transaction
   *
   * @param params Parameters neeeded to create a new market.
   *
   * @returns the transaction hash.
   */

    async simulateTransactionMsgs(
      subaccount: SubaccountInfo,
      requests: TransactionMsg[],
      memo?: string,
    ): Promise<StdFee> {
      const msgs = (await Promise.all(
        requests.map((request) => this.msgs(subaccount, request)),
      )).flat();

      return this.simulateMsgs(subaccount, msgs, memo);
    }

    public async simulateMsgs(
      subaccount: SubaccountInfo,
      msgs: EncodeObject[],
      memo?: string,
    ): Promise<StdFee> {
      const shortTermOrders = this.areShortTermOrderMsgs(msgs);

      const account: Promise<Account> = this.updatedAccount(
        subaccount.address,
        shortTermOrders,
      );
      return this.simulate(
        subaccount.wallet,
        () => Promise.resolve(msgs.flat()),
        undefined,
        memo,
        () => account,
      );

    }
}
