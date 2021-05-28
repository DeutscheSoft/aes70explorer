import { findControl } from './template_components.js';
import { getBackendValue } from './../AWML/src/index.pure.js';
import { registerControl, unregisterControl, getRegisteredControl } from './template_components.js';

function addToCanvas(node) {
  getBackendValue('local:selected').wait().then(v => {
    const path = v.prefix;
    const canvas = document.querySelector('#canvas');
    let selected, next;
    if (path && (selected = findControl(path)) && (next = selected.nextSibling)) {
      canvas.insertBefore(node, next);
    } else {
      canvas.appendChild(node);
    }
  });
}

export function addControlToCanvas(identifier) {
  const _node = getRegisteredControl(identifier.prefix);
  if (_node) return; 
  const node = document.createElement('aes70-control');
  node.identifier = identifier;
  addToCanvas(node);
  registerControl(identifier.prefix, node);
}

export function removeControlFromCanvas(identifier) {
  const _node = getRegisteredControl(identifier.prefix);
  if (!_node) return;
  _node.remove(); 
  unregisterControl(identifier.prefix);
}

export function getControlsOnCanvas() {
  const C = document.getElementById('canvas').children;
  const res = [];
  for (let i = 0, m = C.length; i < m; ++i) {
    const component = C[i];
    if (component.tagName == 'AES70-CONTROL') {
      const identifier = component.identifier;
      if (identifier)
        res.push(identifier);
    } else if (component.tagName == 'AES70-LINE-BREAK') {
      res.push('[LINEBREAK]');
    }
  }
  return res;
}

export function addLineBreakToCanvas() {
  getBackendValue('local:selected').wait().then(v => {
    const canvas = document.getElementById('canvas');
    const prec = canvas.querySelector('.selected');
    const lb = document.createElement('aes70-line-break');
    if (prec && prec.nextSibling) {
      canvas.insertBefore(lb, prec.nextSibling);
    } else { //  if (prec || canvas.children.length)
      canvas.appendChild(lb);
    }
    AES70.checkAddLineBreak(v.prefix);
    AES70.checkRemoveLineBreak(v.prefix);
    getBackendValue('local:selected').set({type:null, prefix:null});
  });
}

export function clearCanvas() {
  const C = Array.from(document.getElementById('canvas').children);
  const res = [];
  C.map(control => {
    if (!control || !control.tagName)
      return;
    if (control.tagName == 'AES70-LINE-BREAK')
      control.remove();
    else if (control.tagName == 'AES70-CONTROL') {
      const identifier = control.identifier;
      const prefix = identifier.prefix;
      const _node = getRegisteredControl(prefix);
      if (!_node) return;
      _node.remove(); 
      unregisterControl(prefix);
    }
  });
}
