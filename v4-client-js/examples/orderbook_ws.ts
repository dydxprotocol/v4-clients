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
  // const clientIds = new Set();
  // const sawRemoveBeforePlace = new Set();
  // const orderIdToTimestamp: Record<string, string> = {};
  const timestamps: string[] = [];
  // let orderCount = 0;
  // // now in format yyyy-mm-dd HH:MM:SS & utc timezone
  // const startTimestamp: string = formatUTCDateWithMoment(new Date());
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
            mySocket.subscribeToOrderbook('AEVO-USD');
          }
          if (data.type === IncomingMessageTypes.CHANNEL_BATCH_DATA) {
            console.log(formatUTCDateWithMoment(new Date()));
            timestamps.push(new Date().getTime().toString());
            // timestamps.push(formatUTCDateWithMoment(new Date()));
          }
          // console.log(JSON.stringify(data));
        } catch (e) {
          console.error('Error parsing JSON message:', e);
        }
      }
    },
  );
  mySocket.connect();
  await delay(120 * 1000); // 2 minutes
  mySocket.terminate();

  console.log('Timestamps:');
  for (const timestamp of timestamps) {
    console.log(timestamp);
  }

  // console.log('Order count:', orderCount);
  // console.log('Order timestamps: ');
  // for (const [orderId, timestamp] of Object.entries(orderIdToTimestamp)) {
  //   console.log(`${orderId}: ${timestamp}`);
  // }
  // console.log(`Saw remove before place: ${sawRemoveBeforePlace.size}`);
  // for (const orderId of sawRemoveBeforePlace) {
  //   console.log(orderId);
  // }
  // const endTimestamp: string = formatUTCDateWithMoment(new Date());
  // console.log('Start timestamp:', startTimestamp);
  // console.log('End timestamp:', endTimestamp);
}

test();
