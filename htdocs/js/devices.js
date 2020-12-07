import { fromSubscription } from '../AWML/src/index.pure.js';
import { isEqual, delay } from './utils.js';

async function fetchDevices() {
  const response = await fetch('/_api/destinations', { cache: 'no-store' });

  if (!response.ok) throw new Error('Failed to fetch destinations: ' + response.statusText);

  return await response.json();
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
        await delay(2000);
      } catch (err) {
        await delay(3000);
      }
    } while (active);
  };

  run();

  return () => {
    active = false;
  };
}

export const Devices = fromSubscription(subscribeFetchDevices);

