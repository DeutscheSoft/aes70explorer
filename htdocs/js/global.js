import { getBackendValue, collectPrefix, ListValue } from './../AWML/src/index.pure.js';
import { element } from './../aux-widgets/src/utils/dom.js';
import { findControl } from './template_components.js';
import { getControlsOnCanvas, addLineBreakToCanvas, removeLineBreakFromCanvas, addControlToCanvas, clearCanvas } from './layout.js';

const controlsSerializationVersion = 2;

window.AES70 = {
  storageDefaults: {
    "tips/show": true,
    "details/show": true,
    "list/show": true,
    "edit/show": false,
    "interface": "My Interface",
    "restore": null,
    "controls": { version: controlsSerializationVersion, list: {} },
    "navstate": {},
  },
  localDefaults: {
    "canRemoveLineBreak": false,
    "canAddLineBreak": false,
  },
  addLineBreak: function () {
    addLineBreakToCanvas();
  },

  removeLineBreak: function () {
    removeLineBreakFromCanvas();
  },

  closeHelp: function () {
    getBackendValue('storage:tips/show').set(false);
  },

  knobPresets: {
    tiny: {
      margin: 0,
      thickness: 5,
      hand: { width: 1, length: 6, margin: 8 },
      dots_defaults: { length: 4, margin: 0.5, width: 1 },
      markers_defaults: { thickness: 2, margin: 0 },
      show_labels: false,
    },
    small: {
      margin: 8,
      thickness: 3,
      hand: { width: 1, length: 8, margin: 17 },
      dots_defaults: { length: 4.5, margin: 8.5, width: 1 },
      markers_defaults: { thickness: 2, margin: 8 },
      labels_defaults: { margin: 7 },
      show_labels: true,
    },
    medium: {
      margin: 13,
      thickness: 3,
      hand: { width: 1, length: 10, margin: 25 },
      dots_defaults: { length: 6, margin: 13.5, width: 1 },
      markers_defaults: { thickness: 2, margin: 11 },
      labels_defaults: { margin: 11 },
      show_labels: true,
    },
    large: {
      margin: 13,
      thickness: 2.2,
      hand: { width: 1.5, length: 12, margin: 26 },
      dots_defaults: { length: 6, margin: 13.5, width: 1 },
      markers_defaults: { thickness: 2, margin: 11 },
      show_labels: true,
    },
    huge: {
      margin: 13,
      thickness: 1.8,
      hand: { width: 2, length: 12, margin: 28 },
      dots_defaults: { length: 6, margin: 13.5, width: 1 },
      markers_defaults: { thickness: 2, margin: 11 },
      show_labels: true,
    },
  },

  gaugePresets: {
    gauge: {
      margin: 10,
      y: -5,
      start: 210,
      angle: 120,
      labels_defaults: { margin: 10, align: 'outer' },
      hand: {width: 1, length: 24, margin: 17},
    },
    phase: {
      margin: 0,
      thickness: 50,
      start: 270,
      angle: 360,
      hand: {width: 3, length: 50, margin: 0,},
    },
  },

  deleteInterface: function () {
    const lv = new ListValue([
      getBackendValue('storage:controls'),
      getBackendValue('storage:interface'),
      getBackendValue('storage:restore')
    ]);
    lv.wait().then(arr => {
      const [struct, name, restore] = arr;
      if (!name || !struct) return;
      delete struct.list[name];
      getBackendValue('storage:controls').set(struct);
      if (name === restore)
        getBackendValue('storage:restore').set(null);
    });
  },
  saveInterface: function () {
    const controls = getControlsOnCanvas();
    const lv = new ListValue([
      getBackendValue('storage:controls'),
      getBackendValue('storage:interface')
    ]);
    lv.wait().then(arr => {
      const [struct, name] = arr;
      if (!name || !struct) return;
      getBackendValue('storage:restore').set(name);
      struct.list[name] = controls;
      getBackendValue('storage:controls').set(struct);
    });
  },
  loadInterface: function (iface) {
    clearCanvas();
    const I = typeof iface === 'string' ? iface : 'storage:interface';
    const lv = new ListValue([
      getBackendValue('storage:controls'),
      getBackendValue(I)
    ]);

    lv.wait().then(arr => {
      const [ struct, name ] = arr;
      if (!name || !struct) return;
      getBackendValue('storage:restore').set(name);
      if (typeof struct !== 'object' || struct.version !== controlsSerializationVersion) {
        console.warn('Ignoring old canvas storage: %o. Updating to latest structure, dropping the stored interface.', name);
        struct.version = 2;
        struct.list = {};
        getBackendValue('storage:controls').set(struct);
        return;
      }
      const list = struct.list[name];
      if (!list) {
        console.warn('Interface not found: %o', name);
      } else {
        list.forEach((control) => {
          if (control.type === 'linebreak') {
            addLineBreakToCanvas();
          } else {
            addControlToCanvas(control);
          }
        });
      }
    });
  },
  clearCanvas: function () {
    clearCanvas();
  },
  notify: function (content, icon) {
    const div = element('div',{class: 'content'});
    div.innerHTML = content;
    document.getElementById('notifications').auxWidget.notify({
      timeout: 5000,
      icon: icon,
      content: div,
    });
  },
}
