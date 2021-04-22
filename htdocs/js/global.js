import { getBackendValue } from './../AWML/src/index.pure.js';
import { findControl } from './template_components.js';

window.AES70 = {
  
  addLineBreak: function () {
    const canvas = document.getElementById('canvas');
    const prec = canvas.querySelector('.selected');
    const lb = document.createElement('aes70-line-break');
    if (prec && prec.nextSibling) {
      canvas.insertBefore(lb, prec.nextSibling);
    } else if (prec || canvas.children.length) {
      canvas.appendChild(lb);
    }
    getBackendValue('local:selected').wait().then(v => {
      AES70.checkAddLineBreak(v);
      AES70.checkRemoveLineBreak(v);
      getBackendValue('local:selected').set(null);
    });
  },
  
  removeLineBreak: function () {
    const canvas = document.getElementById('canvas');
    const lb = canvas.querySelector('.selected ~ aes70-line-break');
    if (!lb)
      return;
    lb.parentElement.removeChild(lb);
    getBackendValue('local:selected').wait().then(v => {
      AES70.checkAddLineBreak(v);
      AES70.checkRemoveLineBreak(v);
    });
  },
  
  checkRemoveLineBreak: function (v) {
    const control = findControl(v);
    if (!control || !control.nextSibling) {
      getBackendValue('local:canRemoveLineBreak').set(false);
      return;
    }
    const hasLineBreak = control.nextSibling.tagName === 'AES70-LINE-BREAK';
    getBackendValue('local:canRemoveLineBreak').set(hasLineBreak);
  },
  
  checkAddLineBreak: function (v) {
    const control = findControl(v);
    const canvas = document.getElementById('canvas');
    const canAdd = (control && (
      (control.nextSibling && control.nextSibling.tagName !== 'AES70-LINE-BREAK')
      ||
      !control.nextSibling
    )) || (
      !control && (canvas.lastChild && canvas.lastChild.tagName !== 'AES70-LINE-BREAK')
    );
    getBackendValue('local:canAddLineBreak').set(canAdd);
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
      thickness: 4,
      hand: { width: 1, length: 8, margin: 17 },
      dots_defaults: { length: 4.5, margin: 8.5, width: 1 },
      markers_defaults: { thickness: 2, margin: 8 },
      labels_defaults: { margin: 9 },
      show_labels: true,
    },
    medium: {
      margin: 13,
      thickness: 3,
      hand: { width: 1, length: 10, margin: 25 },
      dots_defaults: { length: 6, margin: 13.5, width: 1 },
      markers_defaults: { thickness: 2, margin: 11 },
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
  }
}
