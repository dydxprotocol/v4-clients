/*
    Native app can call JS functions with primitives.
*/

import { EncodeObject } from '@cosmjs/proto-signing';
import { accountFromAny } from '@cosmjs/stargate';
import { Order_Side, Order_TimeInForce } from '@dydxprotocol/dydxjs/src/codegen/dydxprotocol/clob/order';
import * as AuthModule from 'cosmjs-types/cosmos/auth/v1beta1/query';
import Long from 'long';

import { BECH32_PREFIX, GAS_PRICE_DYDX_DENOM, USDC_DENOM } from '../lib/constants';
import { UserError } from '../lib/errors';
import { encodeJson } from '../lib/helpers';
import { deriveHDKeyFromEthereumSignature } from '../lib/onboarding';
import { NetworkOptimizer } from '../network_optimizer';
import { CompositeClient } from './composite-client';
import {
  Network, OrderType, OrderSide, OrderTimeInForce, OrderExecution, IndexerConfig, ValidatorConfig,
} from './constants';
import { FaucetClient } from './faucet-client';
import LocalWallet from './modules/local-wallet';
import { Subaccount } from './subaccount';
import { OrderFlags } from './types';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var client: CompositeClient;
  // eslint-disable-next-line vars-on-top, no-var
  var faucetClient: FaucetClient | null;
  // eslint-disable-next-line vars-on-top, no-var
  var wallet: LocalWallet;
}

/* this should match the definitions in Abacus */
export enum Environment {
  staging = 'dydxprotocol-staging',
  testnet = 'dydxprotocol-testnet-2',
}

function network(env: Environment): Network {
  switch (env) {
    case Environment.staging:
      return Network.staging();

    case Environment.testnet:
      return Network.testnet();

    default:
      throw new UserError('invalid environment');
  }
}

export async function connectClient(
  env: Environment,
): Promise<string> {
  try {
    const config = network(env);
    globalThis.client = await CompositeClient.connect(config);
    return encodeJson(config);
  } catch (e) {
    return wrappedError(e);
  }
}

export async function connectNetwork(
  chainId: string,
  validatorUrl: string,
  indexerUrl: string,
  indexerSocketUrl: string,
  faucetUrl?: string,
): Promise<string> {
  try {
    const indexerConfig = new IndexerConfig(indexerUrl, indexerSocketUrl);
    const validatorConfig = new ValidatorConfig(validatorUrl, chainId);
    const config = new Network('native', indexerConfig, validatorConfig);
    globalThis.client = await CompositeClient.connect(config);
    if (faucetUrl !== undefined) {
      globalThis.faucetClient = new FaucetClient(faucetUrl);
    } else {
      globalThis.faucetClient = null;
    }
    return encodeJson(config);
  } catch (e) {
    return wrappedError(e);
  }
}

export async function connectWallet(
  mnemonic: string,
): Promise<string> {
  try {
    globalThis.wallet = await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX);
    const address = globalThis.wallet.address!;
    return encodeJson({ address });
  } catch (e) {
    return wrappedError(e);
  }
}

export async function connect(
  env: Environment,
  mnemonic: string,
): Promise<string> {
  try {
    await connectClient(env);
    return connectWallet(mnemonic);
  } catch (e) {
    return wrappedError(e);
  }
}

export async function deriveMnemomicFromEthereumSignature(signature: string): Promise<string> {
  try {
    const { mnemonic } = deriveHDKeyFromEthereumSignature(signature);
    const wallet = await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX);
    const result = { mnemonic, address: wallet.address! };
    return new Promise((resolve) => {
      resolve(encodeJson(result));
    });
  } catch (e) {
    return wrappedError(e);
  }
}

export async function getHeight(): Promise<string> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const block = await globalThis.client?.validatorClient.get.latestBlock();
    return encodeJson(block);
  } catch (e) {
    return wrappedError(e);
  }
}

export async function getFeeTiers(): Promise<string> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const feeTiers = await globalThis.client?.validatorClient.get.getFeeTiers();
    return encodeJson(feeTiers);
  } catch (e) {
    return wrappedError(e);
  }
}

export async function getUserFeeTier(address: string): Promise<string> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const feeTiers = await globalThis.client?.validatorClient.get.getUserFeeTier(address);
    return encodeJson(feeTiers);
  } catch (e) {
    return wrappedError(e);
  }
}

export async function getPerpetualMarkets(): Promise<string> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const markets = await globalThis.client?.indexerClient.markets.getPerpetualMarkets();
    return encodeJson(markets);
  } catch (e) {
    return wrappedError(e);
  }
}

export async function placeOrder(
  payload: string,
): Promise<string> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const wallet = globalThis.wallet;
    if (wallet === undefined) {
      throw new UserError('wallet is not set. Call connectWallet() first');
    }
    const json = JSON.parse(payload);

    const subaccountNumber = json.subaccountNumber;
    if (subaccountNumber === undefined) {
      throw new UserError('subaccountNumber is not set');
    }
    const marketId = json.marketId;
    if (marketId === undefined) {
      throw new UserError('marketId is not set');
    }
    const type = json.type;
    if (type === undefined) {
      throw new UserError('type is not set');
    }
    const side = json.side;
    if (side === undefined) {
      throw new UserError('side is not set');
    }
    const price = json.price;
    if (price === undefined) {
      throw new UserError('price is not set');
    }
    // trigger_price: number,   // not used for MARKET and LIMIT
    const size = json.size;
    if (size === undefined) {
      throw new UserError('size is not set');
    }
    const clientId = json.clientId;
    if (clientId === undefined) {
      throw new UserError('clientId is not set');
    }
    const timeInForce = json.timeInForce;
    const goodTilTimeInSeconds = json.goodTilTimeInSeconds;
    const execution = json.execution;
    const postOnly = json.postOnly ?? false;
    const reduceOnly = json.reduceOnly ?? false;
    const triggerPrice = json.triggerPrice;

    const subaccount = new Subaccount(wallet, subaccountNumber);
    const tx = await client.placeOrder(
      subaccount,
      marketId,
      type,
      side,
      price,
      size,
      clientId,
      timeInForce,
      goodTilTimeInSeconds,
      execution,
      postOnly,
      reduceOnly,
      triggerPrice,
    );
    return encodeJson(tx);
  } catch (error) {
    return wrappedError(error);
  }
}

export function wrappedError(error: Error): string {
  const text = JSON.stringify(error, Object.getOwnPropertyNames(error));
  return `{"error": ${text}}`;
}

export async function cancelOrder(
  payload: string,
): Promise<string> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectNetwork() first');
    }
    const wallet = globalThis.wallet;
    if (wallet === undefined) {
      throw new UserError('wallet is not set. Call connectWallet() first');
    }
    const json = JSON.parse(payload);

    const subaccountNumber = json.subaccountNumber;
    if (subaccountNumber === undefined) {
      throw new UserError('subaccountNumber is not set');
    }
    const clientId = json.clientId;
    if (clientId === undefined) {
      throw new UserError('clientId is not set');
    }
    const orderFlags = json.orderFlags;
    if (orderFlags === undefined) {
      throw new UserError('orderFlags is not set');
    }
    const clobPairId = json.clobPairId;
    if (clobPairId === undefined) {
      throw new UserError('clobPairId is not set');
    }
    const goodTilBlock = json.goodTilBlock;
    const goodTilBlockTime = json.goodTilBlockTime;

    const subaccount = new Subaccount(wallet, subaccountNumber);
    const tx = await client.cancelOrder(
      subaccount,
      clientId,
      orderFlags,
      clobPairId,
      goodTilBlock !== 0 ? goodTilBlock : undefined,
      goodTilBlockTime !== 0 ? goodTilBlockTime : undefined,
    );
    return encodeJson(tx);
  } catch (error) {
    return wrappedError(error);
  }
}

export async function deposit(
  payload: string,
): Promise<string> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectNetwork() first');
    }
    const wallet = globalThis.wallet;
    if (wallet === undefined) {
      throw new UserError('wallet is not set. Call connectWallet() first');
    }

    const json = JSON.parse(payload);
    const subaccountNumber = json.subaccountNumber;
    if (subaccountNumber === undefined) {
      throw new UserError('subaccountNumber is not set');
    }
    const amount = json.amount;
    if (amount === undefined) {
      throw new UserError('amount is not set');
    }

    const subaccount = new Subaccount(wallet, subaccountNumber);
    const tx = await client.depositToSubaccount(
      subaccount,
      amount,
    );
    return encodeJson(tx);
  } catch (error) {
    return wrappedError(error);
  }
}

export async function withdraw(
  payload: string,
): Promise<string> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectNetwork() first');
    }
    const wallet = globalThis.wallet;
    if (wallet === undefined) {
      throw new UserError('wallet is not set. Call connectWallet() first');
    }

    const json = JSON.parse(payload);
    const subaccountNumber = json.subaccountNumber;
    if (subaccountNumber === undefined) {
      throw new UserError('subaccountNumber is not set');
    }
    const amount = json.amount;
    if (amount === undefined) {
      throw new UserError('amount is not set');
    }

    const subaccount = new Subaccount(wallet, subaccountNumber);
    const tx = await client.withdrawFromSubaccount(
      subaccount,
      amount,
      json.recipient,
    );
    return encodeJson(tx);
  } catch (error) {
    return wrappedError(error);
  }
}

export async function faucet(
  payload: string,
): Promise<string> {
  try {
    const faucetClient = globalThis.faucetClient;
    if (!faucetClient) {
      throw new UserError('faucetClient is not connected. Call connectNetwork() first');
    }
    const wallet = globalThis.wallet;
    if (wallet === undefined) {
      throw new UserError('wallet is not set. Call connectWallet() first');
    }

    const json = JSON.parse(payload);
    const subaccountNumber = json.subaccountNumber;
    if (subaccountNumber === undefined) {
      throw new UserError('subaccountNumber is not set');
    }
    const amount = json.amount;
    if (amount === undefined) {
      throw new UserError('amount is not set');
    }

    const response = await faucetClient.fill(wallet.address!, subaccountNumber, amount);

    return encodeJson(response);
  } catch (error) {
    return wrappedError(error);
  }
}

export async function withdrawToIBC(
  subaccountNumber: number,
  amount: number,
  payload: string,
): Promise<string> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const wallet = globalThis.wallet;
    if (wallet === undefined) {
      throw new UserError('wallet is not set. Call connectWallet() first');
    }

    const decode = (str: string):string => Buffer.from(str, 'base64').toString('binary');
    const decoded = decode(payload);

    const json = JSON.parse(decoded);

    const ibcMsg: EncodeObject = {
      typeUrl: json.msgTypeUrl, // '/ibc.applications.transfer.v1.MsgTransfer',
      value: json.msg,
    };

    const subaccount = new Subaccount(wallet, subaccountNumber);
    const subaccountMsg = client.withdrawFromSubaccountMessage(subaccount, amount);

    const msgs = [subaccountMsg, ibcMsg];
    const encodeObjects: Promise<EncodeObject[]> = new Promise((resolve) => resolve(msgs));

    const tx = await client.send(
      wallet,
      () => {
        return encodeObjects;
      },
      false,
      undefined,
      undefined,
    );
    return encodeJson(tx);
  } catch (error) {
    return wrappedError(error);
  }
}

export async function transferNativeToken(
  payload: string,
): Promise<string> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const wallet = globalThis.wallet;
    if (wallet === undefined) {
      throw new UserError('wallet is not set. Call connectWallet() first');
    }

    const json = JSON.parse(payload);
    const subaccountNumber = json.subaccountNumber;
    if (subaccountNumber === undefined) {
      throw new UserError('subaccountNumber is not set');
    }
    const amount = json.amount;
    if (amount === undefined) {
      throw new UserError('amount is not set');
    }

    const subaccount = new Subaccount(wallet, subaccountNumber);
    const msg: EncodeObject = client.sendTokenMessage(
      subaccount,
      amount,
      json.recipient,
    );
    const msgs = [msg];
    const encodeObjects: Promise<EncodeObject[]> = new Promise((resolve) => resolve(msgs));

    const tx = await client.send(
      wallet,
      () => {
        return encodeObjects;
      },
      false,
      GAS_PRICE_DYDX_DENOM,
      undefined,
    );
    return encodeJson(tx);
  } catch (error) {
    return wrappedError(error);
  }
}

export async function getAccountBalance(): Promise<String> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const wallet = globalThis.wallet;
    if (wallet === undefined) {
      throw new UserError('wallet is not set. Call connectWallet() first');
    }
    const address = globalThis.wallet.address!;

    const tx = await client.validatorClient.get.getAccountBalance(address, USDC_DENOM);
    return encodeJson(tx);
  } catch (error) {
    return wrappedError(error);
  }
}

export async function getAccountBalances(): Promise<String> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const wallet = globalThis.wallet;
    if (wallet === undefined) {
      throw new UserError('wallet is not set. Call connectWallet() first');
    }
    const address = globalThis.wallet.address!;

    const tx = await client.validatorClient.get.getAccountBalances(address);
    return encodeJson(tx);
  } catch (error) {
    return wrappedError(error);
  }
}

export async function getUserStats(
  payload: string,
): Promise<String> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const json = JSON.parse(payload);
    const address = json.address;
    if (address === undefined) {
      throw new UserError('address is not set');
    }

    const tx = await client.validatorClient.get.getUserStats(address);
    return encodeJson(tx);
  } catch (error) {
    return wrappedError(error);
  }
}

export async function simulateDeposit(
  payload: string,
): Promise<string> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const wallet = globalThis.wallet;
    if (wallet === undefined) {
      throw new UserError('wallet is not set. Call connectWallet() first');
    }
    const json = JSON.parse(payload);
    const subaccountNumber = json.subaccountNumber;
    if (subaccountNumber === undefined) {
      throw new UserError('subaccountNumber is not set');
    }
    const amount = json.amount;
    if (amount === undefined) {
      throw new UserError('amount is not set');
    }

    const subaccount = new Subaccount(wallet, subaccountNumber);
    const msg: EncodeObject = client.depositToSubaccountMessage(
      subaccount,
      amount,
    );
    const msgs: EncodeObject[] = [msg];
    const encodeObjects: Promise<EncodeObject[]> = new Promise((resolve) => resolve(msgs));
    const stdFee = await client.simulate(globalThis.wallet, () => {
      return encodeObjects;
    });
    return JSON.stringify(stdFee);
  } catch (error) {
    return wrappedError(error);
  }
}

export async function simulateWithdraw(
  payload: string,
): Promise<string> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const wallet = globalThis.wallet;
    if (wallet === undefined) {
      throw new UserError('wallet is not set. Call connectWallet() first');
    }
    const json = JSON.parse(payload);
    const subaccountNumber = json.subaccountNumber;
    if (subaccountNumber === undefined) {
      throw new UserError('subaccountNumber is not set');
    }
    const amount = json.amount;
    if (amount === undefined) {
      throw new UserError('amount is not set');
    }

    const subaccount = new Subaccount(wallet, subaccountNumber);
    const msg: EncodeObject = client.withdrawFromSubaccountMessage(
      subaccount,
      amount,
      json.recipient,
    );
    const msgs: EncodeObject[] = [msg];
    const encodeObjects: Promise<EncodeObject[]> = new Promise((resolve) => resolve(msgs));
    const stdFee = await client.simulate(globalThis.wallet, () => {
      return encodeObjects;
    });
    return encodeJson(stdFee);
  } catch (error) {
    return wrappedError(error);
  }
}

export async function simulateTransferNativeToken(
  payload: string,
): Promise<string> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const wallet = globalThis.wallet;
    if (wallet === undefined) {
      throw new UserError('wallet is not set. Call connectWallet() first');
    }
    const json = JSON.parse(payload);
    const subaccountNumber = json.subaccountNumber;
    if (subaccountNumber === undefined) {
      throw new UserError('subaccountNumber is not set');
    }
    const recipient = json.recipient;
    if (recipient === undefined) {
      throw new UserError('recipient is not set');
    }
    const amount = json.amount;
    if (amount === undefined) {
      throw new UserError('amount is not set');
    }

    const subaccount = new Subaccount(wallet, subaccountNumber);
    const msg: EncodeObject = client.sendTokenMessage(
      subaccount,
      amount,
      json.recipient,
    );
    const msgs: EncodeObject[] = [msg];
    const encodeObjects: Promise<EncodeObject[]> = new Promise((resolve) => resolve(msgs));
    const stdFee = await client.simulate(
      globalThis.wallet,
      () => {
        return encodeObjects;
      },
      GAS_PRICE_DYDX_DENOM,
    );
    return encodeJson(stdFee);
  } catch (error) {
    return wrappedError(error);
  }
}

export async function signRawPlaceOrder(
  subaccountNumber: number,
  clientId: number,
  clobPairId: number,
  side: Order_Side,
  quantums: Long,
  subticks: Long,
  timeInForce: Order_TimeInForce,
  orderFlags: number,
  reduceOnly: boolean,
  goodTilBlock: number,
  goodTilBlockTime: number,
  clientMetadata: number,
): Promise<string> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const wallet = globalThis.wallet;
    if (wallet === undefined) {
      throw new UserError('wallet is not set. Call connectWallet() first');
    }

    const msgs: Promise<EncodeObject[]> = new Promise((resolve) => {
      const msg = client.validatorClient.post.composer.composeMsgPlaceOrder(
        wallet.address!,
        subaccountNumber,
        clientId,
        clobPairId,
        orderFlags,
        goodTilBlock,
        goodTilBlockTime,
        side,
        quantums,
        subticks,
        timeInForce,
        reduceOnly,
        clientMetadata ?? 0,
      );
      resolve([msg]);
    });
    const signed = await client.sign(
      wallet,
      () => msgs,
      true,
    );
    return Buffer.from(signed).toString('base64');
  } catch (error) {
    return wrappedError(error);
  }
}

export async function signPlaceOrder(
  subaccountNumber: number,
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
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const wallet = globalThis.wallet;
    if (wallet === undefined) {
      throw new UserError('wallet is not set. Call connectWallet() first');
    }

    const subaccount = new Subaccount(wallet, subaccountNumber);
    const signed = await client.signPlaceOrder(
      subaccount,
      marketId,
      type,
      side,
      price,
      size,
      clientId,
      timeInForce,
      goodTilTimeInSeconds,
      execution,
      postOnly,
      reduceOnly,
    );
    return signed;
  } catch (error) {
    return wrappedError(error);
  }
}

export async function signCancelOrder(
  subaccountNumber: number,
  clientId: number,
  orderFlags: OrderFlags,
  clobPairId: number,
  goodTilBlock: number,
  goodTilBlockTime: number,
): Promise<string> {
  try {
    const client = globalThis.client;
    if (client === undefined) {
      throw new UserError('client is not connected. Call connectClient() first');
    }
    const wallet = globalThis.wallet;
    if (wallet === undefined) {
      throw new UserError('wallet is not set. Call connectWallet() first');
    }

    const subaccount = new Subaccount(wallet, subaccountNumber);
    const signed = await client.signCancelOrder(
      subaccount,
      clientId,
      orderFlags,
      clobPairId,
      goodTilBlock,
      goodTilBlockTime,
    );
    return signed;
  } catch (error) {
    return wrappedError(error);
  }
}

export async function encodeAccountRequestData(address: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const requestData: Uint8Array = Uint8Array.from(
        AuthModule.QueryAccountRequest.encode({ address }).finish(),
      );
      resolve(Buffer.from(requestData).toString('hex'));
    } catch (error) {
      reject(error);
    }
  });
}

export async function decodeAccountResponseValue(value: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const rawData = Buffer.from(value, 'base64');
      const rawAccount = AuthModule.QueryAccountResponse.decode(rawData).account;
      // The promise should have been rejected if the rawAccount was undefined.
      if (rawAccount === undefined) {
        throw Error('rawAccount is undefined');
      }
      const account = accountFromAny(rawAccount);
      resolve(encodeJson(account));
    } catch (error) {
      reject(error);
    }
  });
}

export async function getOptimalNode(endpointUrlsAsJson: string): Promise<string> {
  /*
    param:
      endpointUrlsAsJson:
      {
        "endpointUrls": [
          "https://rpc.testnet.near.org"
        ],
        "chainId": "testnet"
      }
  */
  try {
    const param = JSON.parse(endpointUrlsAsJson);
    const endpointUrls = param.endpointUrls;
    const chainId = param.chainId;
    const networkOptimizer = new NetworkOptimizer();
    const optimalUrl = await networkOptimizer.findOptimalNode(endpointUrls, chainId);
    const url = {
      url: optimalUrl,
    };
    return encodeJson(url);
  } catch (error) {
    return wrappedError(error);
  }
}
