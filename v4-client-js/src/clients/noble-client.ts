import { toBase64 } from '@cosmjs/encoding';
import { EncodeObject, Registry, Coin } from '@cosmjs/proto-signing';
import {
  calculateFee,
  DeliverTxResponse,
  GasPrice,
  StdFee,
  defaultRegistryTypes,
  SigningStargateClient,
  MsgTransferEncodeObject,
} from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

import { GAS_MULTIPLIER } from './constants';
import { Response } from './lib/axios';
import { MsgDepositForBurn, MsgDepositForBurnWithCaller } from './lib/cctpProto';
import LocalWallet from './modules/local-wallet';
import RestClient from './modules/rest';

export class NobleClient extends RestClient{
  private wallet?: LocalWallet;
  private restEndpoint: string;
  private stargateClient?: SigningStargateClient;
  private defaultClientMemo?: string;
  private defaultGasPrice: GasPrice = GasPrice.fromString('0.1uusdc');

  constructor(restEndpoint: string, defaultClientMemo?: string, skipUrl: string = 'https://api.skip.money') {
    super(skipUrl)
    this.restEndpoint = restEndpoint;
    this.defaultClientMemo = defaultClientMemo;
  }

  get isConnected(): boolean {
    return Boolean(this.stargateClient);
  }

  async connect(wallet: LocalWallet): Promise<void> {
    if (wallet?.offlineSigner === undefined) {
      throw new Error('Wallet signer not found');
    }
    this.wallet = wallet;
    this.stargateClient = await SigningStargateClient.connectWithSigner(
      this.restEndpoint,
      wallet.offlineSigner,
      {
        registry: new Registry([
          ['/circle.cctp.v1.MsgDepositForBurn', MsgDepositForBurn],
          ['/circle.cctp.v1.MsgDepositForBurnWithCaller', MsgDepositForBurnWithCaller],
          ...defaultRegistryTypes,
        ]),
      },
    );
  }

  getAccountBalances(): Promise<readonly Coin[]> {
    if (!this.stargateClient || this.wallet?.address === undefined) {
      throw new Error('stargateClient not initialized');
    }
    return this.stargateClient.getAllBalances(this.wallet.address);
  }

  getAccountBalance(denom: string): Promise<Coin> {
    if (!this.stargateClient || this.wallet?.address === undefined) {
      throw new Error('stargateClient not initialized');
    }
    return this.stargateClient.getBalance(this.wallet.address, denom);
  }

  async IBCTransfer(message: MsgTransferEncodeObject): Promise<DeliverTxResponse> {
    const tx = await this.send([message]);
    return tx;
  }

/**
 * This method is a PoC for converting from custom blockchain broadcasting to utilizing skip API
 * The Skip API carries benefits of built-in tenacity and transaction tracking
 * 
 * If we decide this pattern is superior, we can explore moving this function to a SkipClient
 */
  async submitToSkipApi(
    messages: EncodeObject[],
    chainId: string,
    gasPrice: GasPrice = this.defaultGasPrice,
    memo: string = '',
  ): Promise<Response> {
    if (!this.stargateClient) {
      throw new Error('NobleClient stargateClient not initialized');
    }

    if (this.wallet?.address === undefined) {
      throw new Error('NobleClient wallet not initialized');
    }
    // Simulate to get the gas estimate
    const fee = await this.simulateTransaction(messages, gasPrice, memo ?? this.defaultClientMemo);

    // Sign and broadcast the transaction
    const txHashObj = await this.stargateClient.sign(
      this.wallet.address,
      messages,
      fee,
      memo ?? this.defaultClientMemo,
    );
    const serializedTx = TxRaw.encode(txHashObj).finish()
    const base64Tx = toBase64(serializedTx)
    const skipSubmitResponse = await this.post(
      `/v2/tx/submit`,
      {},
      JSON.stringify({
        tx: base64Tx,
        chain_id: chainId
      })
    )
    const { data: { tx_hash: txHash }} = skipSubmitResponse;
    const formattedResponse = {
      transactionHash: txHash,
      code: 0,
      ...skipSubmitResponse.data
    }
    return formattedResponse
  }

  async send(
    messages: EncodeObject[],
    gasPrice: GasPrice = this.defaultGasPrice,
    memo?: string,
  ): Promise<DeliverTxResponse> {
    if (!this.stargateClient) {
      throw new Error('NobleClient stargateClient not initialized');
    }
    if (this.wallet?.address === undefined) {
      throw new Error('NobleClient wallet not initialized');
    }
    // Simulate to get the gas estimate
    const fee = await this.simulateTransaction(messages, gasPrice, memo ?? this.defaultClientMemo);

    // Sign and broadcast the transaction
    return this.stargateClient.signAndBroadcast(
      this.wallet.address,
      messages,
      fee,
      memo ?? this.defaultClientMemo,
    );
  }

  async simulateTransaction(
    messages: readonly EncodeObject[],
    gasPrice: GasPrice = this.defaultGasPrice,
    memo?: string,
  ): Promise<StdFee> {
    if (!this.stargateClient) {
      throw new Error('NobleClient stargateClient not initialized');
    }
    if (this.wallet?.address === undefined) {
      throw new Error('NobleClient wallet not initialized');
    }
    // Get simulated response
    const gasEstimate = await this.stargateClient.simulate(this.wallet?.address, messages, memo);

    // Calculate and return the fee
    return calculateFee(Math.floor(gasEstimate * GAS_MULTIPLIER), gasPrice);
  }
}
