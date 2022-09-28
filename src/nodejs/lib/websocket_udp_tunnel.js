import { createSocket } from 'dgram';
import { resolve } from 'dns';
import { isIP } from 'net';
import Events from 'events';

async function lookup_address(host) {
  if (isIP(host))
    return Promise.resolve(host);

  return new Promise((resolve, reject) => {
    lookup(host, { family: 4 }, (err, address) => {
      if (err) reject(err);
      else resolve(address);
    });
  });
}

/**
 * A generic WebSocket to UDP tunnel. It transmits data arriving on the tcp
 * socket as WebSocket binary frames and treats incoming WebSocket binary
 * frames as a bytestream, i.e. dropping the frame information.
 */
class WebSocketUDPTunnel extends Events {
  /**
   * Constructs a WebSocketUDPTunnel and starts transmitting data between
   * the two in both directions.
   */
  constructor(websocket, socket) {
    super();
    this.websocket = websocket;
    this.socket = socket;
    this.closed = false;

    websocket.on('close', () => this._onWebSocketClosed());
    socket.on('close', () => this._onSocketClosed());
    websocket.on('error', (err) => this._onWebSocketClosed());
    socket.on('error', (err) => this._onSocketClosed());
    socket.on('message', (msg, rinfo) => {
      this._onSocketData(msg);
    });
    websocket.on('message', (data) => this._onWebSocketData(data));
  }

  _onWebSocketClosed() {
    this.close();
  }

  _onWebSocketData(data) {
    if (typeof data === 'string') {
      this.emit('error', new TypeError('Received unexpected TEXT frame.'));
      this.close();
      return;
    }
    //console.log('WebSocket -> Socket %d bytes.', data.length);
    this.socket.send(data);
  }

  _onSocketClosed() {
    this.close();
  }

  _onSocketData(buffer) {
    //console.log('Socket -> WebSocket %d bytes.', buffer.length);
    this.websocket.send(buffer);
  }

  close() {
    if (this.closed) return;
    try { this.websocket.close(); } catch (err) {}
    try { this.socket.close(); } catch (err) {}
    this.emit('close');
    this.closed = true;
  }
}

export function connectUDPTunnel(options, getWebSocket) {
  return new Promise((resolve, reject) => {
      const onConnectError = (err) => {
        reject(err);
      };

      const socket = createSocket(options.type || 'udp4');

      socket.on('error', onConnectError);
      socket.bind(
        { exclusive: true },
        () => {
          socket.on('connect', async () => {
            socket.off('error', onConnectError);

            const ws = await getWebSocket();

            if (ws.readyState !== ws.OPEN) {
              // connection has been lost while getting websocket
              console.log('WebSocket is closed: %o', ws.readyState);
              ws.close();
              resolve(null);
            } else {
              const tunnel = new WebSocketUDPTunnel(ws, socket);

              resolve(tunnel);
            }
          });
          socket.connect(options.port, options.host);
      });
  });
}
