import {
  DynamicValue,
  DynamicValuesBackend,
  registerBackend,
} from '../AWML/src/index.pure.js';

import { Devices } from './devices.js';

const modelBackend = new DynamicValuesBackend({
  name: 'model',
  values: {
    devices: Devices,
    selected: '',
  },
});

registerBackend('model', modelBackend);
