import { EncodeObject, Registry, Coin } from '@cosmjs/proto-signing';
import {
  calculateFee,
  DeliverTxResponse,
  GasPrice,
  StdFee,
  defaultRegistryTypes,
  SigningStargateClient,
} from '@cosmjs/stargate';

import { GAS_MULTIPLIER } from './constants';
import LocalWallet from './modules/local-wallet';

export class NobleClient {
  private stargateClient?: SigningStargateClient;
  private wallet?: LocalWallet;

  static async connect(
    restEndpoint: string,
    wallet: LocalWallet,
  ): Promise<NobleClient> {
    const client = new NobleClient();
    await client.initialize(restEndpoint, wallet);
    return client;
  }

  private async initialize(
    restEndpoint: string,
    wallet: LocalWallet,
  ): Promise<void> {
    if (wallet?.offlineSigner === undefined) {
      throw new Error('Wallet signer not found');
    }
    this.wallet = wallet;
    this.stargateClient = await SigningStargateClient.connectWithSigner(
      restEndpoint,
      wallet.offlineSigner,
      { registry: new Registry(defaultRegistryTypes) },
    );
  }

  getAccountBalances(address: string): Promise<readonly Coin[]> {
    if (!this.stargateClient) {
      throw new Error('stargateClient not initialized');
    }
    return this.stargateClient.getAllBalances(address);
  }

  getAccountBalance(address: string, denom: string): Promise<Coin> {
    if (!this.stargateClient) {
      throw new Error('stargateClient not initialized');
    }
    return this.stargateClient.getBalance(address, denom);
  }

  async send(
    messages: EncodeObject[],
    gasPrice: GasPrice = GasPrice.fromString('0.025uusdc'),
    memo?: string,
  ): Promise<DeliverTxResponse> {
    if (!this.stargateClient) {
      throw new Error('NobleClient stargateClient not initialized');
    }
    if (this.wallet?.address === undefined) {
      throw new Error('NobleClient wallet not initialized');
    }
    // Simulate to get the gas estimate
    const fee = await this.simulateTransaction(messages, gasPrice, memo);

    // Sign and broadcast the transaction
    return this.stargateClient.signAndBroadcast(
      this.wallet.address,
      messages,
      fee,
      memo ?? '',
    );
  }

  async simulateTransaction(
    messages: readonly EncodeObject[],
    gasPrice: GasPrice = GasPrice.fromString('0.025uusdc'),
    memo?: string,
  ): Promise<StdFee> {
    if (!this.stargateClient) {
      throw new Error('NobleClient stargateClient not initialized');
    }
    if (this.wallet?.address === undefined) {
      throw new Error('NobleClient wallet not initialized');
    }
    // Get simulated response
    const gasEstimate = await this.stargateClient.simulate(
      this.wallet?.address,
      messages,
      memo,
    );

    // Calculate and return the fee
    return calculateFee(Math.floor(gasEstimate * GAS_MULTIPLIER), gasPrice);
  }
}
