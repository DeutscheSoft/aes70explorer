import { fromSubscription } from '../AWML/src/index.pure.js';
import { isEqual, delay } from './utils.js';

async function fetchDevices() {
  const response = await fetch('/_api/destinations', { cache: 'no-store' });

  if (!response.ok) throw new Error('Failed to fetch destinations: ' + response.statusText);

  return await response.json();
}

let triggerCallback = null;

function delayOrTrigger(n) {
  return Promise.race([
    delay(n),
    new Promise((resolve) => {
      triggerCallback = resolve;
    })
  ]);
}

function triggerReload() {
  if (triggerCallback) {
    triggerCallback();
    triggerCallback = null;
  }
}

function subscribeFetchDevices(callback) {
  let active = true;
  let lastResult = null;

  const run = async () => {
    do {
      try {
        const result = await fetchDevices(); 
        if (!active) break;

        if (!isEqual(result, lastResult))
        {
          lastResult = result;
          callback(result);
        }
        await delayOrTrigger(2000);
      } catch (err) {
        await delayOrTrigger(3000);
      }
    } while (active);
  };

  run();

  return () => {
    active = false;
  };
}

export const Devices = fromSubscription(subscribeFetchDevices);

export async function addDevice(host, port) {
  const name = `${host}_${port}`;
  const response = await fetch(`/_api/destinations/${name}`, {
    cache: 'no-store',
    method: 'PUT',
    body: JSON.stringify({
      name: name,
      port: port,
      host: host,
      protocol: 'tcp',
    }),
  });

  if (!response.ok) throw new Error('Failed to add destination: ' + response.statusText);

  const result = await response.json();

  if (!result.ok)
    throw new Error('Failed to add destination: ' + result.error);

  triggerReload();
}

export async function deleteDevice(name) {
  const response = await fetch(`/_api/destinations/${name}`, {
    cache: 'no-store',
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Failed to delete destination: ' + response.statusText);

  const result = await response.json();

  if (!result.ok)
    throw new Error('Failed to delete destination: ' + result.error);

  triggerReload();
}
