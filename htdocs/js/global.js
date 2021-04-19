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
}
