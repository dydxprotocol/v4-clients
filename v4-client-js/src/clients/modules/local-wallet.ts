import { Secp256k1Pubkey, StdFee, encodeSecp256k1Pubkey } from '@cosmjs/amino';
import { fromHex } from '@cosmjs/encoding';
import {
  AccountData,
  DirectSecp256k1HdWallet,
  DirectSecp256k1Wallet,
  EncodeObject,
  OfflineSigner,
} from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';
import Long from 'long';
import protobuf from 'protobufjs';

import { stripHexPrefix } from '../../lib/helpers';
import { generateRegistry } from '../lib/registry';
import { TransactionOptions } from '../types';
import { DirectEthSecp256k1Wallet } from './eth-secp256k1';
import { TransactionSigner } from './signer';

// Required for encoding and decoding queries that are of type Long.
protobuf.util.Long = Long;
protobuf.configure();

export default class LocalWallet {
  accounts?: AccountData[];
  address?: string;
  pubKey?: Secp256k1Pubkey;
  signer?: TransactionSigner;
  offlineSigner?: OfflineSigner;

  static async fromOfflineSigner(signer: OfflineSigner): Promise<LocalWallet> {
    const wallet = new LocalWallet();
    await wallet.setSigner(signer);
    return wallet;
  }

  static async fromMnemonic(mnemonic: string, prefix?: string): Promise<LocalWallet> {
    const wallet = new LocalWallet();
    await wallet.setMnemonic(mnemonic, prefix);
    return wallet;
  }

  /**
   * Creates an Injective wallet for chains using Ethermint-style keys.
   * Uses HD path (`m/44'/60'/0'/0/0`) by default.
   */
  static async fromEthSecp256k1Mnemonic(
    mnemonic: string,
    prefix: string,
    hdPath?: string,
  ): Promise<LocalWallet> {
    const wallet = new LocalWallet();
    await wallet.setSigner(await DirectEthSecp256k1Wallet.fromMnemonic(mnemonic, prefix, hdPath));
    return wallet;
  }

  static async fromPrivateKey(pkHex: string, prefix?: string): Promise<LocalWallet> {
    const wallet = new LocalWallet();
    await wallet.setPrivateKey(pkHex, prefix);
    return wallet;
  }

  async setSigner(signer: OfflineSigner): Promise<void> {
    this.offlineSigner = signer;
    const stargateClient = await SigningStargateClient.offline(signer, {
      registry: generateRegistry(),
    });
    const accountData = await signer.getAccounts();
    const firstAccount = accountData[0]!;
    this.accounts = [...accountData];
    this.address = firstAccount.address;
    this.pubKey = encodeSecp256k1Pubkey(firstAccount.pubkey);
    this.signer = new TransactionSigner(this.address, stargateClient, signer);
  }

  async setMnemonic(mnemonic: string, prefix?: string): Promise<void> {
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix });
    return this.setSigner(signer);
  }

  async setPrivateKey(pkHex: string, prefix?: string): Promise<void> {
    const signer = await DirectSecp256k1Wallet.fromKey(fromHex(stripHexPrefix(pkHex)), prefix);
    return this.setSigner(signer);
  }

  public async signTransaction(
    messages: EncodeObject[],
    transactionOptions: TransactionOptions,
    fee?: StdFee,
    memo: string = '',
  ): Promise<Uint8Array> {
    return this.signer!.signTransaction(messages, transactionOptions, fee, memo, this.pubKey);
  }
}
