import WebSocket from 'ws';

import { AbacusWebsocketProtocol } from './abacus';

const RECONNECT_INTERVAL_MS = 10_000;

export const PING_INTERVAL_MS = 2000;
export const PONG_TIMEOUT_MS = 5000;

export const PONG_MESSAGE_TYPE = 'pong';

export const OUTGOING_PING_MESSAGE = JSON.stringify({ type: 'ping' });

export const isDev = true;

class AbacusWebsocket implements Omit<AbacusWebsocketProtocol, '__doNotUseOrImplementIt'> {
  private socket: WebSocket | null = null;
  private url: string | null = null;
  private connectedCallback: ((p0: boolean) => void) | null = null;
  private receivedCallback: ((p0: string) => void) | null = null;

  private pingPongTimer?: NodeJS.Timer;
  private disconnectTimer?: NodeJS.Timer;
  private currentCandleId: string | undefined;

  connect(url: string, connected: (p0: boolean) => void, received: (p0: string) => void): void {
    this.url = url;
    this.connectedCallback = connected;
    this.receivedCallback = received;
    this._initializeSocket();
  }

  disconnect(): void {
    this._clearSocket();
  }

  send(message: string): void {
    try {
      this.socket?.send(message);
    } catch (error) {
    //   log('AbacusWebsocketProtocol/send', error, { message });
    }
  }

  handleCandlesSubscription = ({
    channelId,
    subscribe,
  }: {
    channelId: string;
    subscribe: boolean;
  }) => {
    if (!this.socket) return;

    if (subscribe) {
      this.socket.send(
        JSON.stringify({
          type: 'subscribe',
          channel: 'v4_candles',
          id: channelId,
          batched: true,
        }),
      );

      this.currentCandleId = channelId;
    } else {
      this.socket.send(
        JSON.stringify({
          type: 'unsubscribe',
          channel: 'v4_candles',
          id: channelId,
        }),
      );

      if (this.currentCandleId === channelId) {
        this.currentCandleId = undefined;
      }
    }
  };

  private connect(): void {
    if ((this.url == null) || !this.connectedCallback || !this.receivedCallback) return;
    this.socket = new WebSocket(this.url);

    this.socket.addEventListener('open', this.handleOpen.bind(this));
    this.socket.addEventListener('close', this.handleClose.bind(this));
    this.socket.addEventListener('message', this.handleMessage.bind(this));
  };

  private _clearSocket = (): void => {
    if ((this.url == null) || !this.connectedCallback || !this.receivedCallback) return;
    this.socket?.close();
    this.socket = null;

    clearInterval(this.pingPongTimer);
    delete this.pingPongTimer;

    clearInterval(this.disconnectTimer);
    delete this.disconnectTimer;

    this.connectedCallback(false);
  };

  private _setReconnectInterval = () => {
    setInterval(() => {
      if (
        !this.socket ||
        this.socket.readyState === WebSocket.CLOSED ||
        this.socket.readyState === WebSocket.CLOSING
      ) {
        this._clearSocket();
        this._initializeSocket();
      }
    }, RECONNECT_INTERVAL_MS);
  };

  private _setDisconnectTimeout = () => {
    this.disconnectTimer = setTimeout(() => {
      this._clearSocket();
    }, PONG_TIMEOUT_MS);
  };
}

export default AbacusWebsocket;
