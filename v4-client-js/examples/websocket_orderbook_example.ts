/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { Network } from '../src/clients/constants';
import { SocketClient } from '../src/clients/socket-client';

function test(): void {
  let orderBookBidList: [number, number, number][] = [];
  let orderBookAskList: [number, number, number][] = [];

  const mySocket = new SocketClient(
    Network.mainnet().indexerConfig,
    () => {
      console.log('socket opened');

      mySocket.subscribeToOrderbook('ETH-USD');
    },
    () => {
      console.log('socket closed');
    },
    (message) => {
      try {
        if (typeof message.data === 'string') {
          const jsonString = message.data;
          const parsingData = JSON.parse(jsonString);
          const messageId = parsingData.message_id;
          const orderBookDataList = parsingData.contents;

          if (orderBookDataList instanceof Array) {
            // common orderBook data;
            [orderBookBidList, orderBookAskList] = updateOrderBook(
              orderBookDataList,
              orderBookBidList,
              orderBookAskList,
              messageId,
            );

            // sort
            orderBookBidList = sortByNthElementDesc(orderBookBidList, 0);
            orderBookAskList = sortByNthElementAsc(orderBookAskList, 0);

            // resolving crossed orderBook
            if (
              orderBookBidList.length > 0 &&
              orderBookAskList.length > 0 &&
              orderBookBidList[0][0] >= orderBookAskList[0][0]
            ) {
              [orderBookBidList, orderBookAskList] = resolveCrossedOrderBook(
                orderBookBidList,
                orderBookAskList,
              );
            }

            printOrderBook(orderBookBidList, orderBookAskList);

            if (orderBookBidList.length > 300) {
              orderBookBidList.splice(50);
            }

            if (orderBookAskList.length > 300) {
              orderBookAskList.splice(50);
            }
          } else if (orderBookDataList !== null && orderBookDataList !== undefined) {
            // initial OrderBook data
            setInitialOrderBook(orderBookDataList, orderBookBidList, orderBookAskList, messageId);
          }
        }
      } catch (e) {
        console.error('Error parsing JSON message:', e);
      }
    },
    (event) => {
      console.error('Encountered error:', event.message);
    },
  );

  mySocket.connect();
}

const sortByNthElementAsc = (
  arr: [number, number, number][],
  n: number,
): [number, number, number][] => {
  return arr.sort((a, b) => {
    if (a[n] < b[n]) return -1;
    if (a[n] > b[n]) return 1;
    return 0;
  });
};
const sortByNthElementDesc = (
  arr: [number, number, number][],
  n: number,
): [number, number, number][] => {
  return arr.sort((a, b) => {
    if (a[n] > b[n]) return -1;
    if (a[n] < b[n]) return 1;
    return 0;
  });
};

const printOrderBook = (
  orderBookBidList: [number, number, number][],
  orderBookAskList: [number, number, number][],
): void => {
  // print
  console.log(`OrderBook for ETH-USD:`);
  console.log(`Price     Qty`);
  for (let i = 4; i > -1; i--) {
    const priceStr = String(orderBookAskList[i][0]);
    const spaces = createSpaces(10 - priceStr.length);
    console.log(`${priceStr}${spaces}${orderBookAskList[i][1]}`);
  }
  console.log('---------------------');
  for (let i = 0; i < 5; i++) {
    const priceStr = String(orderBookBidList[i][0]);
    const spaces = createSpaces(10 - priceStr.length);
    console.log(`${priceStr}${spaces}${orderBookBidList[i][1]}`);
  }
  console.log('');
};

function createSpaces(count: number): string {
  if (count <= 0) {
    return '';
  }

  let spaces = '';
  for (let i = 0; i < count; i++) {
    spaces += ' ';
  }
  return spaces;
}

const resolveCrossedOrderBook = (
  orderBookBidList: [number, number, number][],
  orderBookAskList: [number, number, number][],
): [[number, number, number][], [number, number, number][]] => {
  while (orderBookBidList[0][0] >= orderBookAskList[0][0]) {
    if (orderBookBidList[0][2] < orderBookAskList[0][2]) {
      orderBookBidList.shift();
    } else if (orderBookBidList[0][2] > orderBookAskList[0][2]) {
      orderBookAskList.shift();
    } else {
      if (orderBookBidList[0][1] > orderBookAskList[0][1]) {
        orderBookBidList[0][1] -= orderBookAskList[0][1];
        orderBookAskList.shift();
      } else if (orderBookBidList[0][1] < orderBookAskList[0][1]) {
        orderBookAskList[0][1] -= orderBookBidList[0][1];
        orderBookBidList.shift();
      } else {
        orderBookAskList.shift();
        orderBookBidList.shift();
      }
    }
  }

  return [orderBookBidList, orderBookAskList];
};
const setInitialOrderBook = (
  orderBookDataList: { bids: []; asks: [] },
  orderBookBidList: [number, number, number][],
  orderBookAskList: [number, number, number][],
  messageId: number,
): void => {
  orderBookDataList.bids.forEach((item: { price: string; size: string }) => {
    orderBookBidList.push([Number(item.price), Number(item.size), messageId]);
  });

  orderBookDataList.asks.forEach((item: { price: string; size: string }) => {
    orderBookAskList.push([Number(item.price), Number(item.size), messageId]);
  });
};

const updateOrderBook = (
  orderBookDataList: { bids: [[]]; asks: [[]] }[],
  orderBookBidList: [number, number, number][],
  orderBookAskList: [number, number, number][],
  messageId: number,
): [[number, number, number][], [number, number, number][]] => {
  orderBookDataList.forEach((entry: { bids: [[]]; asks: [[]] }) => {
    if (entry.bids !== null && entry.bids !== undefined) {
      const flattened = entry.bids.reduce((acc: any[], val: any[]) => acc.concat(val), []);
      const entryBidPrice = Number(flattened[0]);
      const entryBidSize = Number(flattened[1]);

      // remove prices with zero Qty
      if (entryBidSize === 0) {
        for (let i = orderBookBidList.length - 1; i >= 0; i--) {
          if (orderBookBidList[i][0] === entryBidPrice) {
            orderBookBidList.splice(i, 1);
          }
        }
      } else {
        // The price that already exists in the order book is modified only Qty
        if (orderBookBidList.some((innerArray) => innerArray[0] === entryBidPrice)) {
          orderBookBidList.forEach((item, index) => {
            if (item[0] === entryBidPrice) {
              orderBookBidList[index][1] = entryBidSize;
              orderBookBidList[index][2] = messageId;
            }
          });
        } else {
          // Add new data to order book
          orderBookBidList.push([entryBidPrice, entryBidSize, messageId]);
        }
      }
    }
    if (entry.asks !== null && entry.asks !== undefined) {
      const flattened = entry.asks.reduce((acc: any[], val: any[]) => acc.concat(val), []);
      const entryAskPrice = Number(flattened[0]);
      const entryAskSize = Number(flattened[1]);

      if (entryAskSize === 0) {
        // remove prices with zero Qty
        for (let i = orderBookAskList.length - 1; i >= 0; i--) {
          if (orderBookAskList[i][0] === entryAskPrice) {
            orderBookAskList.splice(i, 1);
          }
        }
      } else {
        // The price that already exists in the order book is modified only Qty
        if (orderBookAskList.some((innerArray) => innerArray[0] === entryAskPrice)) {
          orderBookAskList.forEach((item, index) => {
            if (item[0] === entryAskPrice) {
              orderBookAskList[index][1] = entryAskSize;
              orderBookAskList[index][2] = messageId;
            }
          });
        } else {
          // Add new data to order book
          orderBookAskList.push([entryAskPrice, entryAskSize, messageId]);
        }
      }
    }
  });

  return [orderBookBidList, orderBookAskList];
};

test();
