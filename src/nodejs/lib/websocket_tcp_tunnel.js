import { createConnection } from 'net';
import Events from 'events';

/**
 * A generic WebSocket to TCP tunnel. It transmits data arriving on the tcp
 * socket as WebSocket binary frames and treats incoming WebSocket binary
 * frames as a bytestream, i.e. dropping the frame information.
 */
class WebSocketTCPTunnel extends Events {
  /**
   * Constructs a WebSocketTCPTunnel and starts transmitting data between
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
    socket.on('data', (buf) => this._onSocketData(buf));
    websocket.on('message', (data) => this._onWebSocketData(data));
  }

  _onWebSocketClosed() {
    this.close();
  }

  _onWebSocketData(data) {
    if (typeof data === 'string') {
      this.emit('error', new TypeError('Received unexpected TEST frame.'));
      this.close();
      return;
    }
    //console.log('WebSocket -> Socket %d bytes.', data.length);
    this.socket.write(data);
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

export function connectTCPTunnel(connectOptions, getWebSocket) {
  return new Promise((resolve, reject) => {
      const onConnectError = (err) => {
        reject(err);
      };

      let tcpConnection;

      tcpConnection = createConnection(connectOptions, async () => {
        // websocket was closed
        tcpConnection.off('error', onConnectError);

        const ws = await getWebSocket();

        if (tcpConnection.readyState !== 'open') {
          // connection has been lost while getting websocket
          ws.close();
          reolve(null);
        } else {
          const tunnel = new WebSocketTCPTunnel(ws, tcpConnection);

          resolve(tunnel);
          }
      });

      tcpConnection.on('error', onConnectError);
  });
}
