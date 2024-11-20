import { Network } from '../src/clients/constants';
import { SocketClient } from '../src/clients/socket-client';

function test(): void {
    let orderBookBidList: [number, number][] = [];
    let orderBookAskList: [number, number][] = [];

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
                    const jsonString = message.data as string;
                    const orderBookDataList = JSON.parse(jsonString).contents;

                    if (orderBookDataList instanceof Array) {
                        // common orderBook data;
                        [orderBookBidList, orderBookAskList] = updateOrderBook(
                            orderBookDataList,
                            orderBookBidList,
                            orderBookAskList,
                        );

                        // sort
                        orderBookBidList = sortByNthElementDesc(orderBookBidList, 0);
                        orderBookAskList = sortByNthElementAsc(orderBookAskList, 0);

                        // resolving crossed orderBook
                        [orderBookBidList, orderBookAskList] = resolveCrossedOrderBook(
                            orderBookBidList,
                            orderBookAskList,
                        );

                        printOrderBook(orderBookBidList, orderBookAskList);
                    } else if (orderBookDataList !== null && orderBookDataList !== undefined) {
                        // initial OrderBook data
                        setInitialOrderBook(orderBookDataList, orderBookBidList, orderBookAskList);
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

const printOrderBook = (
    orderBookBidList: [number, number][],
    orderBookAskList: [number, number][],
): void => {
    // print
    console.log(`OrderBook for ETH-USD:`);
    console.log(`Price     Qty`);
    for (let i = 4; i > -1; i--) {
        console.log(`${String(orderBookAskList[i][0]).padEnd(10, ' ')}${orderBookAskList[i][1]}`);
    }
    console.log('---------------------');
    for (let i = 0; i < 5; i++) {
        console.log(`${String(orderBookBidList[i][0]).padEnd(10, ' ')}${orderBookBidList[i][1]}`);
    }
    console.log('');
};

const resolveCrossedOrderBook = (
    orderBookBidList: [number, number][],
    orderBookAskList: [number, number][],
): [[number, number][], [number, number][]] => {
    const bidList = [...orderBookBidList];
    const askList = [...orderBookAskList];

    while (bidList[0][0] >= askList[0][0]) {
        if (bidList[0][1] > askList[0][1]) {
            bidList[0][1] -= askList[0][1];
            askList.shift();
        } else if (bidList[0][1] < askList[0][1]) {
            askList[0][1] -= bidList[0][1];
            bidList.shift();
        } else {
            askList.shift();
            bidList.shift();
        }
    }

    return [bidList, askList];
};

const setInitialOrderBook = (
    orderBookDataList: { bids: []; asks: [] },
    orderBookBidList: [number, number][],
    orderBookAskList: [number, number][],
): void => {
    orderBookDataList.bids.forEach((item: { price: string; size: string }) => {
        orderBookBidList.push([Number(item.price), Number(item.size)]);
    });

    orderBookDataList.asks.forEach((item: { price: string; size: string }) => {
        orderBookAskList.push([Number(item.price), Number(item.size)]);
    });
};

const updateOrderBook = (
    orderBookDataList: { bids: [[]]; asks: [[]] }[],
    orderBookBidList: [number, number][],
    orderBookAskList: [number, number][],
): [[number, number][], [number, number][]] => {
    let bidList = [...orderBookBidList];
    let askList = [...orderBookAskList];

    orderBookDataList.forEach((entry: { bids: [[]]; asks: [[]] }) => {
        if (entry.bids !== null && entry.bids !== undefined) {
            const entryBidPrice = Number(entry.bids.flat()[0]);
            const entryBidSize = Number(entry.bids.flat()[1]);

            // remove prices with zero Qty
            if (entryBidSize === 0) {
                bidList.forEach((item, index) => {
                    if (item[0] === entryBidPrice) {
                        bidList.splice(index, 1);
                    }
                });
            } else {
                // The price that already exists in the order book is modified only Qty
                if (bidList.some((innerArray) => innerArray[0] === entryBidPrice)) {
                    bidList = bidList.map((item, index) => {
                        if (item[0] === entryBidPrice) {
                            bidList[index][1] = entryBidSize;
                            return item;
                        } else {
                            return item;
                        }
                    });
                } else {
                    // Add new data to order book
                    bidList.push([entryBidPrice, entryBidSize]);
                }
            }
        }
        if (entry.asks !== null && entry.asks !== undefined) {
            const entryAskPrice = Number(entry.asks.flat()[0]);
            const entryAskSize = Number(entry.asks.flat()[1]);

            if (entryAskSize === 0) {
                // remove prices with zero Qty
                askList.forEach((item, index) => {
                    if (item[0] === entryAskPrice) {
                        askList.splice(index, 1);
                    }
                });
            } else {
                // The price that already exists in the order book is modified only Qty
                if (askList.some((innerArray) => innerArray[0] === entryAskPrice)) {
                    askList = askList.map((item, index) => {
                        if (item[0] === entryAskPrice) {
                            askList[index][1] = entryAskSize;
                            return item;
                        } else {
                            return item;
                        }
                    });
                } else {
                    // Add new data to order book
                    askList.push([entryAskPrice, entryAskSize]);
                }
            }
        }
    });

    return [orderBookBidList, orderBookAskList];
};

test();