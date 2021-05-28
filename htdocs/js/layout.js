import { findControl } from './template_components.js';
import { DynamicValue, combineLatest, map, getBackendValue } from './../AWML/src/index.pure.js';
import { registerControl, unregisterControl, getRegisteredControl } from './template_components.js';

const Selected = getBackendValue('local:selected');
const ItemsOnCanvas = DynamicValue.fromConstant([]);

function addToCanvas(node) {
  const selected = Selected.hasValue && Selected.value;

  const selectedNode = selected && findControl(selected);
  const canvas = document.querySelector('#canvas');

  canvas.insertBefore(node, selectedNode && selectedNode.nextSibling);
  ItemsOnCanvas.set(Array.from(canvas.children));
}

export function addControlToCanvas(identifier) {
  const _node = getRegisteredControl(identifier);
  if (_node) return;
  const node = document.createElement('aes70-control');
  node.identifier = identifier;
  addToCanvas(node);
  registerControl(identifier, node);
}

function isLinebreak(node) {
  return node && node.tagName === 'AES70-LINE-BREAK';
}

function isControl(node) {
  return node && node.tagName === 'AES70-CONTROL';
}

export function removeControlFromCanvas(identifier) {
  const _node = getRegisteredControl(identifier);
  if (!_node) return;
  _node.remove();
  unregisterControl(identifier);
  const canvas = document.querySelector('#canvas');
  ItemsOnCanvas.set(Array.from(canvas.children));
}

export function getControlsOnCanvas() {
  const C = document.getElementById('canvas').children;
  const res = [];
  for (let i = 0, m = C.length; i < m; ++i) {
    const component = C[i];
    if (isControl(component)) {
      const identifier = component.identifier;
      if (identifier)
        res.push(identifier);
    } else if (isLinebreak(component)) {
      res.push('[LINEBREAK]');
    }
  }
  return res;
}

export function addLineBreakToCanvas() {
  const canvas = document.getElementById('canvas');
  const selected = Selected.hasValue && Selected.value;
  const selectedNode = selected && findControl(selected);
  const lb = document.createElement('aes70-line-break');

  canvas.insertBefore(lb, selectedNode && selectedNode.nextSibling);
  Selected.set(null);
  ItemsOnCanvas.set(Array.from(canvas.children));
}

export function removeLineBreakFromCanvas() {
  const canvas = document.getElementById('canvas');
  const selected = Selected.hasValue && Selected.value;
  const selectedNode = selected && findControl(selected);

  if (selectedNode && isLinebreak(selectedNode.nextSibling)) {
    selectedNode.nextSibling.remove();
  } else if (isLinebreak(canvas.lastChild)) {
    canvas.lastChild.remove();
  }
  ItemsOnCanvas.set(Array.from(canvas.children));
}

export function clearCanvas() {
  const C = Array.from(document.getElementById('canvas').children);
  C.forEach(control => {
    if (!control || !control.tagName)
      return;

    control.remove();

    if (isControl(control)) {
      const identifier = control.identifier;
      const _node = getRegisteredControl(identifier);
      if (!_node) return;
      unregisterControl(identifier);
    }
  });
}

export const CanAddLinebreak = map(
  combineLatest([ Selected, ItemsOnCanvas ]),
  ([ selected, items]) => {
    const selectedControl = selected && findControl(selected);

    if (selectedControl) {
      return !isLinebreak(selectedControl.nextSibling);
    }

    return !isLinebreak(items[items.length - 1]);
  },
);

export const CanRemoveLinebreak = map(
  combineLatest([ Selected, ItemsOnCanvas ]),
  ([ selected, items]) => {
    const selectedControl = selected && findControl(selected);

    if (selectedControl) {
      return isLinebreak(selectedControl.nextSibling);
    }

    return items.length ? isLinebreak(items[items.length - 1]) : false;
  },
);

CanAddLinebreak.subscribe((value) => getBackendValue('local:canAddLineBreak').set(value));
CanRemoveLinebreak.subscribe((value) => getBackendValue('local:canRemoveLineBreak').set(value));
