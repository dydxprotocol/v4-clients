import _ from 'lodash';

import { BECH32_PREFIX, Order_TimeInForce } from '../src';
import { CompositeClient, OrderBatchWithMarketId } from '../src/clients/composite-client';
import { Network, OrderSide } from '../src/clients/constants';
import LocalWallet from '../src/clients/modules/local-wallet';
import { SubaccountInfo } from '../src/clients/subaccount';
import { randomInt, sleep } from '../src/lib/utils';
import { DYDX_TEST_MNEMONIC, MAX_CLIENT_ID } from './constants';

type OrderInfo = {
  marketId: string;
  clientId: number;
  side: OrderSide;
  price: number;
  size: number;
};

const generateShortTermOrdersInfo = (): OrderInfo[] => [
  {
    marketId: 'ETH-USD',
    clientId: randomInt(MAX_CLIENT_ID),
    side: OrderSide.SELL,
    price: 4000,
    size: 0.01,
  },
  {
    marketId: 'ETH-USD',
    clientId: randomInt(MAX_CLIENT_ID),
    side: OrderSide.SELL,
    price: 4200,
    size: 0.02,
  },
  {
    marketId: 'BTC-USD',
    clientId: randomInt(MAX_CLIENT_ID),
    side: OrderSide.BUY,
    price: 40000,
    size: 0.01,
  },
];

const generateBatchCancelShortTermOrders = (ordersInfo: OrderInfo[]): OrderBatchWithMarketId[] => {
  const ordersGroupedByMarketIds = _.groupBy(ordersInfo, (info) => info.marketId);
  return Object.keys(ordersGroupedByMarketIds).map((marketId) => ({
    marketId,
    clientIds: ordersGroupedByMarketIds[marketId].map((info) => info.clientId),
  }));
};

async function test(): Promise<void> {
  try {
    const wallet = await LocalWallet.fromMnemonic(DYDX_TEST_MNEMONIC, BECH32_PREFIX);
    console.log('**Wallet**', wallet);

    const network = Network.testnet();
    const client = await CompositeClient.connect(network);
    console.log('**Client**', client);

    const subaccount = new SubaccountInfo(wallet, 0);
    const currentBlock = await client.validatorClient.get.latestBlockHeight();
    const goodTilBlock = currentBlock + 10;

    const shortTermOrdersInfo = generateShortTermOrdersInfo();
    await placeShortTermOrders(client, subaccount, shortTermOrdersInfo, goodTilBlock);
    await sleep(5000);
    await batchCancelOrders(client, subaccount, shortTermOrdersInfo, goodTilBlock);
  } catch (error) {
    console.error('**Test Failed**', error.message);
  }
}

const placeShortTermOrders = async (
  client: CompositeClient,
  subaccount: SubaccountInfo,
  shortTermOrdersInfo: OrderInfo[],
  goodTilBlock: number,
): Promise<void> => {
  const orderPromises = shortTermOrdersInfo.map(async (order) => {
    try {
      const tx = await client.placeShortTermOrder(
        subaccount,
        order.marketId,
        order.side,
        order.price,
        order.size,
        order.clientId,
        goodTilBlock,
        Order_TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
        false,
      );
      console.log('**Short Term Order Tx**', tx.hash);
    } catch (error) {
      console.error(
        `**Short Term Order Failed for Market ${order.marketId}, Client ID ${order.clientId}**`,
        error.message,
      );
    }
  });

  // Wait for all order placements to complete
  await Promise.all(orderPromises);
}

const batchCancelOrders = async (
  client: CompositeClient,
  subaccount: SubaccountInfo,
  shortTermOrdersInfo: OrderInfo[],
  goodTilBlock: number,
): Promise<void> => {
  const shortTermOrdersPayload = generateBatchCancelShortTermOrders(shortTermOrdersInfo);
  try {
    const tx = await client.batchCancelShortTermOrdersWithMarketId(
      subaccount,
      shortTermOrdersPayload,
      goodTilBlock + 10,
    );
    console.log('**Batch Cancel Short Term Orders Tx**', tx);
  } catch (error) {
    console.error('**Batch Cancel Short Term Orders Failed**', error.message);
  }
}

test()
  .then(() => {
    console.log('**Batch Cancel Test Completed Successfully**');
  })
  .catch((error) => {
    console.error('**Batch Cancel Test Execution Error**', error.message);
  });
