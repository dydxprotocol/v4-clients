import { Network } from '../src/clients/constants';
import { IncomingMessageTypes, SocketClient } from '../src/clients/socket-client';

function test(): void {
  let orderBookBidList: [number, number][] = [];
  let orderBookAskList: [number, number][] = [];

  const mySocket = new SocketClient(
    Network.mainnet().indexerConfig,
    () => {
      console.log('socket opened');
    },
    () => {
      console.log('socket closed');
    },
    (message) => {
      if (typeof message.data === 'string') {
        const jsonString = message.data as string;
        try {
          const data = JSON.parse(jsonString);
          if (data.type === IncomingMessageTypes.CONNECTED) {
            mySocket.subscribeToOrderbook('ETH-USD');
          } else {
            const orderBookDataList = data.contents;

            // Common Orderbook Data
            if (orderBookDataList instanceof Array) {
              orderBookDataList.forEach((entry) => {
                if (entry.bids !== null && entry.bids !== undefined) {
                  const entryBidPrice = Number(entry.bids.flat()[0]);
                  const entryBidSize = Number(entry.bids.flat()[1]);

                  // remove prices with zero Qty
                  if (entryBidSize === 0) {
                    orderBookBidList.forEach((item, index) => {
                      if (item[0] === entryBidPrice) {
                        orderBookBidList.splice(index, 1);
                      }
                    });
                  } else {
                    // The price that already exists in the order book is modified only Qty
                    if (orderBookBidList.some((innerArray) => innerArray[0] === entryBidPrice)) {
                      orderBookBidList = orderBookBidList.map((item, index) => {
                        if (item[0] === entryBidPrice) {
                          orderBookBidList[index][1] = entryBidSize;
                          return item;
                        } else {
                          return item;
                        }
                      });
                    } else {
                      // Add new data to order book
                      orderBookBidList.push([entryBidPrice, entryBidSize]);
                    }
                  }
                }
                if (entry.asks !== null && entry.asks !== undefined) {
                  const entryAskPrice = Number(entry.asks.flat()[0]);
                  const entryAskSize = Number(entry.asks.flat()[1]);

                  if (entryAskSize === 0) {
                    // remove prices with zero Qty
                    orderBookAskList.forEach((item, index) => {
                      if (item[0] === entryAskPrice) {
                        orderBookAskList.splice(index, 1);
                      }
                    });
                  } else {
                    // The price that already exists in the order book is modified only Qty
                    if (orderBookAskList.some((innerArray) => innerArray[0] === entryAskPrice)) {
                      orderBookAskList = orderBookAskList.map((item, index) => {
                        if (item[0] === entryAskPrice) {
                          orderBookAskList[index][1] = entryAskSize;
                          return item;
                        } else {
                          return item;
                        }
                      });
                    } else {
                      // Add new data to order book
                      orderBookAskList.push([entryAskPrice, entryAskSize]);
                    }
                  }
                }
              });

              // sort
              orderBookBidList = sortByNthElementDesc(orderBookBidList, 0);
              orderBookAskList = sortByNthElementAsc(orderBookAskList, 0);

              // Resolving Crossed Orderbook Data
              while (orderBookBidList[0][0] >= orderBookAskList[0][0]) {
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

              // print
              console.log(`OrderBook for ETH-USD:`);
              console.log(`Price     Qty`);
              for (let i = 4; i > -1; i--) {
                console.log(
                  `${String(orderBookAskList[i][0]).padEnd(10, ' ')}${orderBookAskList[i][1]}`,
                );
              }
              console.log('---------------------');
              for (let i = 0; i < 5; i++) {
                console.log(
                  `${String(orderBookBidList[i][0]).padEnd(10, ' ')}${orderBookBidList[i][1]}`,
                );
              }
              console.log('');
            } else if (orderBookDataList !== null && orderBookDataList !== undefined) {
              orderBookDataList.bids.forEach((item: { price: string; size: string }) => {
                orderBookBidList.push([Number(item.price), Number(item.size)]);
              });

              orderBookDataList.asks.forEach((item: { price: string; size: string }) => {
                orderBookAskList.push([Number(item.price), Number(item.size)]);
              });
            }
          }
        } catch (e) {
          console.error('Error parsing JSON message:', e);
        }
      }
    },
    (event) => {
      console.error('Encountered error:', event.message);
    },
  );
  mySocket.connect();
}

const sortByNthElementAsc = (arr: [number, number][], n: number): [number, number][] => {
  return arr.sort((a, b) => {
    if (a[n] < b[n]) return -1;
    if (a[n] > b[n]) return 1;
    return 0;
  });
};
const sortByNthElementDesc = (arr: [number, number][], n: number): [number, number][] => {
  return arr.sort((a, b) => {
    if (a[n] > b[n]) return -1;
    if (a[n] < b[n]) return 1;
    return 0;
  });
};

test();
