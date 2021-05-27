import { TemplateRegistry } from './utils/template_registry.js';

export const objectDetailTemplateRegistry = new TemplateRegistry('aes70-detail-');

export async function createObjectDetailComponent(o) {
  const tagName = await objectDetailTemplateRegistry.find(o);

  if (!tagName)
    return null;

  const element = document.createElement(tagName);

  if (element.setControlObject)
    element.setControlObject(o);

  return element;
}

export function registerObjectDetailTemplate(component, name) {
  objectDetailTemplateRegistry.register(name, component);
}
