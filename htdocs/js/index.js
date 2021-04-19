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
import './widgets/aes70_control.js';
import './widgets/aes70_details.js';

import { findControl } from './template_components.js';

// for debugging
import * as AWML from '../AWML/src/index.js';
window.AWML = AWML;


import { getBackendValue } from '../AWML/src/index.pure.js';

document.getElementById('canvas').addEventListener('click', function (e) {
  let target = e.target;
  while (target) {
    if (target.tagName.startsWith('AES70-TEMPLATE-OCA')
      || target.tagName.startsWith('AES70-OBJECT'))
      return;
    target = target.parentElement;
  }
  getBackendValue('local:selected').set(null);
});

getBackendValue('local:selected').subscribe(v => {
  AES70.checkAddLineBreak(v);
  AES70.checkRemoveLineBreak(v);
});
