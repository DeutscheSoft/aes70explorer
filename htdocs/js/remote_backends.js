import { Devices, makeDestinationKey } from './devices.js';
import { forEachAsync, isEqual, callUnsubscribe } from './utils.js';
import { AES70Backend } from '../AWML/src/backends/aes70.js';
import { registerBackendType } from '../AWML/src/components/backend.js';

export class WebSocketUDP {
  get onmessage() {
    return this._onmessage;
  }

  set onmessage(cb) {
    if (this._onmessage && cb)
      throw new Error('Cannot install more than one message callback.');

    this._onmessage = cb;
    this._notifyMessage();
  }

  get onerror() {
    return this._onerror;
  }

  set onerror(cb) {
    if (this._onerror && cb)
      throw new Error('Cannot install more than one error callback.');

    this._onerror = cb;
    this._notifyError();
  }

  _notifyMessage() {
    const onmessage = this.onmessage;

    if (!onmessage) return;

    const inbuf = this._inbuf;

    if (!inbuf.length) return;

    this._inbuf = [];

    for (let i = 0; i < inbuf.length; i++) {
      onmessage(inbuf[i]);
    }
  }

  _notifyError() {
    const onerror = this.onerror;

    if (!onerror) return;

    const error = this._error;

    if (!error) return;
    this._error = null;

    onerror(error);
  }

  send(buf) {
    this.websocket.send(buf);
  }

  receiveMessage(timeout) {
    return new Promise((resolve, reject) => {
      if (this._error) {
        reject(this._error);
      } else if (this._inbuf.length) {
        resolve(this._inbuf.shift());
      } else {
        this.onmessage = (msg) => {
          this.onmessage = null;
          this.onerror = null;
          resolve(msg);
        };
        this.onerror = (err) => {
          this.onmessage = null;
          this.onerror = null;
          reject(err);
        };
      }
    });
  }

  close() {
    this.websocket.close();
    this.websocket = null;
  }

  constructor(websocket) {
    this._inbuf = [];
    this._onmessage = null;
    this._onerror = null;
    this.websocket = websocket;
    websocket.binaryType = 'arraybuffer';
    websocket.addEventListener('message', (ev) => {
      if (!(ev.data instanceof ArrayBuffer))
        return;
      this._inbuf.push(ev.data);
      this._notifyMessage();
    });
    websocket.addEventListener('error', (err) => {
      this._error = err;
      this._notifyError(err);
    });
    websocket.addEventListener('close', () => {
      const err = new Error('closed');
      this._error = err;
      this._notifyError(err);
    });
  }
}

class WebsocketUDPConnection extends OCA.AbstractUDPConnection {
  _now() {
    return performance.now();
  }

  constructor(websocket, options) {
    super(new WebSocketUDP(websocket), options);
  }
}

class TokenBackend extends AES70Backend {
  async _connect() {
    const r = await fetch('/_api/token', {
      cache: 'no-store',
    });

    if (!r.ok)
      throw new Error(r.statusText);

    const token = await r.text();

    this.options.url += '?' + token;

    return await super._connect();
  }

  async _connectUDPDevice(options) {
    const websocket = await this._connectWebSocket();

    return new OCA.RemoteDevice(
      new WebsocketUDPConnection(websocket, options)
    );
  }

  _connectDevice(options) {
    const protocol = this.options.protocol;

    switch (protocol) {
    case 'tcp':
      return super._connectDevice(options);
    case 'udp':
      return this._connectUDPDevice(options);
    default:
      throw new Error(`Unsupported protocol ${protocol}.`);
    }
  }

  static argumentsFromNode(node) {
    const options = AES70Backend.argumentsFromNode(node);

    options.protocol = node.getAttribute('protocol');

    return options;
  }
}

registerBackendType('aes70-with-token', TokenBackend);

forEachAsync(
  Devices,
  (device) => {
    const key = makeDestinationKey(device);
    const backend = document.createElement('AWML-BACKEND');
    backend.setAttribute('src', '/_control/' + key);
    backend.setAttribute('name', key);
    backend.setAttribute('protocol', device.protocol);
    backend.setAttribute('type', 'aes70-with-token');

    document.head.appendChild(backend);

    return () => {
      backend.remove();
    };
  },
  makeDestinationKey
);
