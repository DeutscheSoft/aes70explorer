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

    websocket.on('close', () => { this._onWebSocketClosed(); });
    socket.on('close', () => { this._onSocketClosed(); });
  }

  _onWebSocketClosed() {
    this.close();
  }

  _onWebSocketMessage(data) {
    if (typeof data === 'string') {
      this.emit('error', new TypeError('Received unexpected TEST frame.'));
      this.close();
      return;
    }
    this.socket.write(data);
  }

  _onSocketClosed() {
    this.close();
  }

  _onSocketData(buffer) {
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

export function connectTCPTunnel(wss, request, socket, head, connectOptions) {
  return new Promise((resolve, reject) => {
      const onConnectionError = (err) => {
        reject(err);
        socket.destroy();
      };

      const tcpConnection = createConnection(connectionOptions, () => {
        tcpConnection.off('error', onError);

        // TODO: can this fail? Can the TCP connection be closed in the
        // meantime?
        wss.handleUpgrade(request, socket, head, (ws) => {
          resolve(new WebSocketTCPTunnel(ws, tcpConnection));
        });
      });

      tcpConnection.on('error', onError);
  });
}
