const availableControls = new Map();

export function registerControl(path, node) {
  if (availableControls.has(path))
    return availableControls.get(path);
  availableControls.set(path, node);
  return node;
}

export function unregisterControl(path) {
  return availableControls.delete(path);
}

export function getRegisteredControl(path) {
  return availableControls.get(path);
}

export function findControl(path) {
  return availableControls.get(path);
}
