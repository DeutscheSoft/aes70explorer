import { TemplateRegistry } from './utils/template_registry.js';

export const objectControlTemplateRegistry = new TemplateRegistry('aes70-control-');

export async function createObjectControlComponent(o) {
  const tagName = await objectControlTemplateRegistry.find(o);

  if (!tagName)
    return null;

  const element = document.createElement(tagName);

  if (element.setControlObject)
    element.setControlObject(o);

  return element;
}

export function registerObjectControlTemplate(component, name) {
  objectControlTemplateRegistry.register(name, component);
}
