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
import './widgets/aes70_add_device.js';
import './widgets/aes70_empty.js';
import './widgets/aes70_edit.js';
import './widgets/aes70_licenses.js';

import { findControl } from './template_components.js';
import { registerValueTimer } from './value_timer.js';

// for debugging
import * as AWML from '../AWML/src/index.js';
window.AWML = AWML;

import { getBackendValue, LocalStorageBackend } from '../AWML/src/index.pure.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('canvas');
  let canvasdown;
  canvas.addEventListener('mousedown', function (e) {
    canvasdown = e;
  });
  canvas.addEventListener('mouseup', function (e) {
    if (!canvasdown) return;

    const x1 = canvasdown.screenX;
    const y1 = canvasdown.screenY;
    const x2 = e.screenX;
    const y2 = e.screenY;
    const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    if (d > 5) return;

    canvasdown = null;

    let target = e.target;
    while (target) {
      if (target.tagName.startsWith('AES70-CONTROL')
        || target.tagName.startsWith('AES70-OBJECT'))
        return;
      target = target.parentElement;
    }
    getBackendValue('local:selected').set(null);
  });

  window.setTimeout(function () {
    AES70.loadInterface('storage:restore');
    getBackendValue('local:selected').set(null);
    document.getElementById("loading").style.display = "none";
  }, 500);
});

registerValueTimer('local:tips/icons/interface', ['folder','trash', 'savecontrols'], 1500);
registerValueTimer('local:tips/icons/ocadevice', ['ocadevice','ocadeviceopen'], 1500);
registerValueTimer('local:tips/icons/ocablock', ['ocablock','ocablockopen'], 1500);
registerValueTimer('local:tips/icons/ocaworker', [
  'ocabooleanactuator',
  'ocastringactuator',
  'ocabitstringactuator',
  'ocamute',
  'ocapolarity',
  'ocatemperatureactuator',
  'ocaswitch',
  'ocagain',
  'ocapanbalance',
  'ocadynamics',
  'ocaidentificationactuator',
  'ocasummingpoint',
  'ocasensor',
  'ocafrequencyactuator',
  'ocastringsensor',
  'ocatimeintervalsensor',
  'ocatemperaturesensor',
], 1500);
