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
  const orderIds: Record<string, string[]> = {};
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
            for (const order of data.contents.orders) {
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              if (!orderIds[order.ticker]) {
                orderIds[order.ticker] = [];
              }
              orderIds[order.ticker].push(order.id);
            }
          }
        } catch (e) {
          console.error('Error parsing JSON message:', e);
        }
      }
    },
  );
  mySocket.connect();
  await delay(5 * 1000); // 1 minute
  mySocket.terminate();
  console.log('Order IDs:', orderIds);
  const endTimestamp: string = formatUTCDateWithMoment(new Date());
  console.log('Start timestamp:', startTimestamp);
  console.log('End timestamp:', endTimestamp);
}

test();
