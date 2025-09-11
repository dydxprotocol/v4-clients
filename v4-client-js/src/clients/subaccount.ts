import Long from 'long';

import { MAX_SUBACCOUNT_NUMBER } from './constants';
import LocalWallet from './modules/local-wallet';

export class SubaccountInfo {
  readonly address: string;
  readonly subaccountNumber: number;
  readonly signingWallet: LocalWallet;
  readonly authenticators?: Long[];

  private constructor(
    signingWallet: LocalWallet,
    address: string,
    subaccountNumber: number = 0,
    authenticators?: Long[],
  ) {
    if (subaccountNumber < 0 || subaccountNumber > MAX_SUBACCOUNT_NUMBER) {
      throw new Error(`Subaccount number must be between 0 and ${MAX_SUBACCOUNT_NUMBER}`);
    }

    this.address = address;
    this.subaccountNumber = subaccountNumber;
    this.signingWallet = signingWallet;
    this.authenticators = authenticators;
  }

  static forLocalWallet(wallet: LocalWallet, subaccountNumber: number = 0): SubaccountInfo {
    const address = wallet.address;
    if (address === undefined) {
      throw new Error('Address not available from wallet');
    }
    return new SubaccountInfo(wallet, address, subaccountNumber);
  }

  static forPermissionedWallet(
    signingWallet: LocalWallet,
    accountAddress: string,
    subaccountNumber: number = 0,
    authenticators: Long[],
  ): SubaccountInfo {
    return new SubaccountInfo(signingWallet, accountAddress, subaccountNumber, authenticators);
  }

  get isPermissionedWallet(): boolean {
    return this.address !== this.signingWallet.address;
  }

  cloneWithSubaccount(subaccountNumber: number): SubaccountInfo {
    return new SubaccountInfo(
      this.signingWallet,
      this.address,
      subaccountNumber,
      this.authenticators,
    );
  }
}
