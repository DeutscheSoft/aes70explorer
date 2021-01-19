const templateComponents = new Map();

export function registerTemplateComponent(component) {
  const tagName = 'aes70-template-' + component.name.toLowerCase();

  templateComponents.set(tagName, component);
  customElements.define(tagName, component);
}

export function findTemplateComponent(o) {
  // We use the last match.

  let match;

  templateComponents.forEach((component, tagName) => {
    if (!component.match(o))
      return;


    match = tagName;
  });

  return match;
}

