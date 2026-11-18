import {
  Bip39,
  EnglishMnemonic,
  keccak256,
  Secp256k1,
  Slip10,
  Slip10Curve,
  stringToPath,
} from '@cosmjs/crypto';
import { toBase64, toBech32 } from '@cosmjs/encoding';
import {
  AccountData,
  DirectSignResponse,
  makeSignBytes,
  OfflineDirectSigner,
} from '@cosmjs/proto-signing';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

export const ETH_SECP256K1_HD_PATH = "m/44'/60'/0'/0/0";

/**
 * OfflineDirectSigner for `eth_secp256k1` keys (e.g. Injective).
 */
export class DirectEthSecp256k1Wallet implements OfflineDirectSigner {
  private readonly privkey: Uint8Array;
  private readonly pubkey: Uint8Array;
  private readonly prefix: string;

  private constructor(privkey: Uint8Array, compressedPubkey: Uint8Array, prefix: string) {
    this.privkey = privkey;
    this.pubkey = compressedPubkey;
    this.prefix = prefix;
  }

  static async fromKey(privkey: Uint8Array, prefix: string): Promise<DirectEthSecp256k1Wallet> {
    const { pubkey } = await Secp256k1.makeKeypair(privkey);
    return new DirectEthSecp256k1Wallet(privkey, Secp256k1.compressPubkey(pubkey), prefix);
  }

  static async fromMnemonic(
    mnemonic: string,
    prefix: string,
    hdPath: string = ETH_SECP256K1_HD_PATH,
  ): Promise<DirectEthSecp256k1Wallet> {
    const seed = await Bip39.mnemonicToSeed(new EnglishMnemonic(mnemonic));
    const { privkey } = Slip10.derivePath(Slip10Curve.Secp256k1, seed, stringToPath(hdPath));
    return DirectEthSecp256k1Wallet.fromKey(privkey, prefix);
  }

  private get address(): string {
    const uncompressed = Secp256k1.uncompressPubkey(this.pubkey).slice(1);
    return toBech32(this.prefix, keccak256(uncompressed).slice(-20));
  }

  getAccounts(): Promise<readonly AccountData[]> {
    return Promise.resolve([
      {
        // Not part of cosmjs's `Algo` union
        algo: 'eth_secp256k1' as AccountData['algo'],
        address: this.address,
        pubkey: this.pubkey,
      },
    ]);
  }

  async signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse> {
    if (signerAddress !== this.address) {
      throw new Error(`Address ${signerAddress} not found in wallet`);
    }

    const hash = keccak256(makeSignBytes(signDoc));
    const signature = await Secp256k1.createSignature(hash, this.privkey);
    const signatureBytes = new Uint8Array([...signature.r(32), ...signature.s(32)]);

    return {
      signed: signDoc,
      signature: {
        pub_key: { type: 'injective/PubKeyEthSecp256k1', value: toBase64(this.pubkey) },
        signature: toBase64(signatureBytes),
      },
    };
  }
}
