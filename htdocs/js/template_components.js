const templateControls = new Map();
const templateDetails = new Map();
const availableControls = new Map();

export function matchClass(Class, object) {
  if (!(object instanceof Class)) return -1;

  return Class.ClassID.length;
}

export function registerTemplateControl(component, name) {
  const tagName = 'aes70-control-' + name;

  if (templateControls.has(tagName))
    throw new Error(`Control component with name ${tagName} already defined.`)

  customElements.define(tagName, component);
  templateControls.set(tagName, component);
}
export function registerTemplateDetails(component, name) {
  const tagName = 'aes70-details-' + name;

  if (templateDetails.has(tagName))
    throw new Error(`Details component with name ${tagName} already defined.`);

  customElements.define(tagName, component);
  templateDetails.set(tagName, component);
}

function findBestMatch(set, o) {
  let bestMatch = null;
  let bestScore = -1;

  set.forEach((component, tagName) => {
    const score = component.match(o);

    if (score <= bestScore)
      return;

    bestScore = score;
    bestMatch = tagName;
  });

  return bestMatch;
}

export function findTemplateControl(o) {
  return findBestMatch(templateControls, o);
}
export function findTemplateDetails(o) {
  return findBestMatch(templateDetails, o);
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

export function findControl(path) {
  return availableControls.get(path);
}
