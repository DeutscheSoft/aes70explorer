const templateControls = new Map();
const templateDetails = new Map();
const availableControls = new Map();

export function registerTemplateControl(component) {
  const tagName = 'aes70-template-' + component.name.toLowerCase();

  templateControls.set(tagName, component);
  customElements.define(tagName, component);
}
export function registerTemplateDetails(component) {
  const tagName = 'aes70-template-' + component.name.toLowerCase();

  templateDetails.set(tagName, component);
  customElements.define(tagName, component);
}

export function findTemplateControl(o) {
  // We use the last match.

  let match;

  templateControls.forEach((component, tagName) => {
    if (!component.match(o))
      return;
    match = tagName;
  });

  return match;
}
export function findTemplateDetails(o) {
  // We use the last match.

  let match;

  templateDetails.forEach((component, tagName) => {
    if (!component.match(o))
      return;
    match = tagName;
  });

  return match;
}

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
