import './defines.js';
import '../AWML/src/index.js';
import '../AWML/src/backends/aes70.js';
import '../aux-widgets/src/index.js';

import './devices.js';
import './model_backend.js';
import './remote_backends.js';

import './widgets/aes70_device.js';
import './widgets/aes70_navigation.js';
import './widgets/aes70_block.js';
import './widgets/aes70_block_children.js';
import './widgets/aes70_object.js';
import './widgets/aes70_object_control.js';
import './widgets/aes70_object_details.js';

// for debugging
import * as AWML from '../AWML/src/index.js';
window.AWML = AWML;


import { getBackendValue } from '../AWML/src/index.pure.js';

document.addEventListener('mouseup', function (e) {
  const path = e.path;
  for (let i = 0; i < path.length; ++i) {
    if (!path[i].tagName)
      continue;
    if (path[i].tagName.startsWith('AES70-TEMPLATE-OCA')
      || path[i].tagName.startsWith('AES70-OBJECT'))
      return;
  }
  getBackendValue('local:selected').set(null);
});
