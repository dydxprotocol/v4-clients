import { fromBase64, toBase64, toBech32, toHex } from '@cosmjs/encoding';
import { rawSecp256k1PubkeyToRawAddress } from '@cosmjs/tendermint-rpc';
import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

import {
  Authenticator,
  AuthenticatorType,
  TYPE_URL_BATCH_CANCEL,
  TYPE_URL_MSG_CANCEL_ORDER,
  TYPE_URL_MSG_PLACE_ORDER,
} from '../clients/constants';
import { type Get } from '../clients/modules/get';
import LocalWallet from '../clients/modules/local-wallet';
import { BECH32_PREFIX } from './constants';
import { deriveHDKeyFromMnemonic } from './onboarding';

export const createNewRandomDydxWallet = async (): Promise<
  { privateKeyHex: string; mnemonic: string; publicKey: string; address: string } | undefined
> => {
  const mnemonic = generateMnemonic(wordlist, 128);
  const { privateKey: privateKeyRaw } = deriveHDKeyFromMnemonic(mnemonic);
  const wallet = await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX);

  const privateKeyHex = privateKeyRaw != null ? `0x${toHex(privateKeyRaw)}` : undefined;
  const publicKey = wallet.pubKey;
  const address = wallet.address;

  if (privateKeyHex == null || publicKey == null || address == null) {
    return undefined;
  }

  return {
    // 12 english words
    mnemonic,
    // toHex of the raw private key bits
    privateKeyHex,
    // base64, not hex
    publicKey: publicKey.value,
    // valid dydx address corresponding to the key pair
    address,
  };
};

// arguments to authorize a given wallet public key to trade on behalf of the user.
// allows place order, cancel order, batch cancel on subaccount 0 only.
export const getAuthorizeNewTradingKeyArguments = ({
  generatedWalletPubKey,
}: {
  generatedWalletPubKey: string;
}): { type: AuthenticatorType; data: Uint8Array } => {
  const wrapAndEncode64 = (s: string): string => toBase64(new TextEncoder().encode(s));

  const messageFilterSubAuth = [
    {
      type: AuthenticatorType.MESSAGE_FILTER,
      config: wrapAndEncode64(TYPE_URL_MSG_PLACE_ORDER),
    },
    {
      type: AuthenticatorType.MESSAGE_FILTER,
      config: wrapAndEncode64(TYPE_URL_MSG_CANCEL_ORDER),
    },
    {
      type: AuthenticatorType.MESSAGE_FILTER,
      config: wrapAndEncode64(TYPE_URL_BATCH_CANCEL),
    },
  ];

  const anyOfMessageFilterConfigB64 = wrapAndEncode64(JSON.stringify(messageFilterSubAuth));

  const subAuth = [
    {
      type: AuthenticatorType.SIGNATURE_VERIFICATION,
      config: generatedWalletPubKey,
    },
    {
      type: AuthenticatorType.ANY_OF,
      config: anyOfMessageFilterConfigB64,
    },
    // we limit to cross markets to make it slightly harder to drain user funds on low liquidity markets with trading keys
    // could undo this in the future if people are angry about it
    {
      type: AuthenticatorType.SUBACCOUNT_FILTER,
      config: wrapAndEncode64('0'),
    },
  ];

  const jsonString = JSON.stringify(subAuth);
  const encodedData = new TextEncoder().encode(jsonString);
  const topLevelType = AuthenticatorType.ALL_OF;

  return {
    type: topLevelType,
    data: encodedData,
  };
};

// redeclared to keep sub bundle size small
type Awaited<T> = T extends Promise<infer U> ? U : T;
const isTruthy = <T>(n?: T | false | null | undefined | 0): n is T => Boolean(n);

// just parses out keys that match the format created in getAuthorizeNewTradingKeyArguments
export const getAuthorizedTradingKeysMetadata = (
  authorizedKeys: Awaited<ReturnType<Get['getAuthenticators']>>['accountAuthenticators'],
): Array<{ id: string; publicKey: string; address: string }> => {
  return authorizedKeys
    .map(({ config, id, type }) => {
      if (type !== AuthenticatorType.ALL_OF) {
        return null;
      }
      const parsedConfig = JSON.parse(new TextDecoder().decode(config)) as
        | Authenticator[]
        | undefined;
      if (parsedConfig == null) {
        return null;
      }

      const publicKey = parsedConfig.find(
        (t) => t.type === AuthenticatorType.SIGNATURE_VERIFICATION,
      )?.config;
      if (publicKey == null || typeof publicKey !== 'string') {
        return null;
      }

      const address = toBech32(
        BECH32_PREFIX,
        rawSecp256k1PubkeyToRawAddress(fromBase64(publicKey)),
      );
      return {
        id: id.toString(),
        publicKey,
        address,
      };
    })
    .filter(isTruthy);
};
