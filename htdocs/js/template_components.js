const controlsOnCanvas = new Map();

function formatKey(identifier) {
  return identifier.type + ':' + identifier.prefix;
}

export function registerControl(identifier, node) {
  const key = formatKey(identifier);
  if (controlsOnCanvas.has(key))
    return controlsOnCanvas.get(key);
  controlsOnCanvas.set(key, node);
  return node;
}

export function unregisterControl(identifier) {
  const key = formatKey(identifier);
  return controlsOnCanvas.delete(key);
}

export function getRegisteredControl(identifier) {
  const key = formatKey(identifier);
  return controlsOnCanvas.get(key);
}

export function findControl(identifier) {
  return getRegisteredControl(identifier);
}
