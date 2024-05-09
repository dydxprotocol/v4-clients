import { Network } from '../src/clients/constants';
import { IncomingMessageTypes, SocketClient } from '../src/clients/socket-client';
import moment from 'moment';


function formatUTCDateWithMoment(date: Date): string {
  return moment(date).utc().format('YYYY-MM-DD HH:mm:ss');
}

function delay(ms: number) {
  return new Promise( (resolve) => setTimeout(resolve, ms) );
}

async function test(): Promise<void> {
  const clientIds = new Set();
  const sawRemoveBeforePlace = new Set();
  const orderIdToTimestamp: Record<string, string> = {};
  let orderCount = 0;
  // now in format yyyy-mm-dd HH:MM:SS & utc timezone
  const startTimestamp: string = formatUTCDateWithMoment(new Date());
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
            mySocket.subscribeToSubaccount('dydx18p7nz5rqezkyscdz9pv9rchnsesjyjjyfe92t3', 0);
          }
          // console.log(JSON.stringify(data));
          if (data.type === IncomingMessageTypes.CHANNEL_DATA && data.contents.orders) {
            // console.log(`orders: ${JSON.stringify(data.contents.orders)}`);
            for (const order of data.contents.orders) {
              if (order.ticker !== 'AEVO-USD') {
                continue;
              }
              orderCount++;
              if (order.clientId in clientIds) {  // seen before
                if (!orderIdToTimestamp[order.clientId]) {
                  orderIdToTimestamp[order.clientId] = new Date().getTime().toString();
                }
              } else {  // first time seen
                if (order.status === 'BEST_EFFORT_CANCELED') {
                  sawRemoveBeforePlace.add(order.clientId);
                }
              }
              clientIds.add(order.clientId);
            }
          }
        } catch (e) {
          console.error('Error parsing JSON message:', e);
        }
      }
    },
  );
  mySocket.connect();
  await delay(60 * 5 * 1000); // 5 minutes
  mySocket.terminate();

  console.log('Order count:', orderCount);
  console.log('Order timestamps: ');
  for (const [orderId, timestamp] of Object.entries(orderIdToTimestamp)) {
    console.log(`${orderId}: ${timestamp}`);
  }
  console.log(`Saw remove before place: ${sawRemoveBeforePlace.size}`);
  for (const orderId of sawRemoveBeforePlace) {
    console.log(orderId);
  }
  const endTimestamp: string = formatUTCDateWithMoment(new Date());
  console.log('Start timestamp:', startTimestamp);
  console.log('End timestamp:', endTimestamp);
}

test();
