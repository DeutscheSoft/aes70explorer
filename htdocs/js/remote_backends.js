import { Devices } from './devices.js';
import { forEachAsync, isEqual, callUnsubscribe } from './utils.js';

forEachAsync(
  Devices,
  (device) => {
    const backend = document.createElement('AWML-BACKEND');
    backend.setAttribute('src', '/_control/' + device.name);
    backend.setAttribute('name', device.name);
    backend.setAttribute('type', 'aes70');

    document.head.appendChild(backend);

    return () => {
      backend.remove();
    };
  },
  (device) => device.name
  );
