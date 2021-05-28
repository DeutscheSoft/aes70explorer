import { getBackendValue, collectPrefix } from './../AWML/src/index.pure.js';
import { findControl } from './template_components.js';
import { getControlsOnCanvas, addLineBreakToCanvas, removeLineBreakFromCanvas, addControlToCanvas, clearCanvas } from './layout.js';

const controlsSerializationVersion = 1;

window.AES70 = {
  storageDefaults: {
    "tips/show": true,
    "controls": [],
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
  showHelp: function () {
    getBackendValue('storage:tips/show').set(true);
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
  
  saveControlsOnCanvas: function () {
    const value = {
      version: controlsSerializationVersion,
      list: getControlsOnCanvas(),
    };
    getBackendValue('storage:controls').set(value);
  },
  restoreControlsOnCanvas: function () {
    getBackendValue('storage:controls').wait().then(v => {
      if (!v) return;
      if (typeof v !== 'object' || v.version !== controlsSerializationVersion) {
        console.warn('Ignoring old canvas storage: %o', v);
        return;
      }
      const list = v.list;

      list.forEach((control) => {
        if (control === '[LINEBREAK]') {
          addLineBreakToCanvas();
        } else {
          addControlToCanvas(control);
        }
      });
    });
  },
  clearCanvas: function () {
    clearCanvas();
    getBackendValue('storage:controls').set({
      version: controlsSerializationVersion,
      list: [],
    });
  },
}
