import { findControl } from './template_components.js';
import { getBackendValue, collectPrefix } from './../AWML/src/index.pure.js';
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

export function addControlToCanvas(URI) {
  const _node = getRegisteredControl(URI);
  if (_node) return; 
  const node = document.createElement('aes70-control');
  node.setAttribute('prefix', URI);
  addToCanvas(node);
  registerControl(URI, node);
}

export function removeControlFromCanvas(URI) {
  const _node = getRegisteredControl(URI);
  if (!_node) return;
  _node.remove(); 
  unregisterControl(URI);
}

export function getControlsOnCanvas() {
  const C = document.getElementById('canvas').children;
  const res = [];
  for (let i = 0, m = C.length; i < m; ++i) {
    if (C[i].tagName == 'AES70-CONTROL')
      res.push(collectPrefix(C[i]));
    else if (C[i].tagName == 'AES70-LINE-BREAK')
      res.push('[LINEBREAK]');
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
      const URI = collectPrefix(control);
      const _node = getRegisteredControl(URI);
      if (!_node) return;
      _node.remove(); 
      unregisterControl(URI);
    }
  });
}
