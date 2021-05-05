import { findControl } from './template_components.js';
import { getBackendValue } from './../AWML/src/index.pure.js';

export function addToCanvas(node) {
  const path = getBackendValue('local:selected')._value.prefix;
  const canvas = document.querySelector('#canvas');
  let selected, next;
  if (path && (selected = findControl(path)) && (next = selected.nextSibling)) {
    canvas.insertBefore(node, next);
  } else {
    canvas.appendChild(node);
  }
  // This might in the future return a layout-node which places its child
  // in a specific position on the canvas
  return node;
}
