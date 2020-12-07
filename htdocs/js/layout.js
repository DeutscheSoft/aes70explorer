export function addToCanvas(node) {
  document.querySelector('#canvas').appendChild(node);

  // This might in the future return a layout-node which places its child
  // in a specific position on the canvas
  return node;
}
