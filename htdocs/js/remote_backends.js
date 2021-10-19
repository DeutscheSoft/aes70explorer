import { Devices } from './devices.js';
import { forEachAsync, isEqual, callUnsubscribe } from './utils.js';
import { AES70Backend } from '../AWML/src/backends/aes70.js';
import { registerBackendType } from '../AWML/src/components/backend.js';

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
}

registerBackendType('aes70-with-token', TokenBackend);

forEachAsync(
  Devices,
  (device) => {
    const backend = document.createElement('AWML-BACKEND');
    backend.setAttribute('src', '/_control/' + device.name);
    backend.setAttribute('name', device.name);
    backend.setAttribute('type', 'aes70-with-token');

    document.head.appendChild(backend);

    return () => {
      backend.remove();
    };
  },
  (device) => device.name
  );
