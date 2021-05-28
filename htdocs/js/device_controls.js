import { TemplateRegistry } from './utils/template_registry.js';

export const deviceControlTemplateRegistry = new TemplateRegistry('aes70-device-control');

export async function createDeviceControlComponent(o) {
  const tagName = await deviceControlTemplateRegistry.find(o);

  if (!tagName)
    return null;

  const element = document.createElement(tagName);

  if (element.setControlDevice)
    element.setControlDevice(o);

  return element;
}

export function registerDeviceControlTemplate(component, name) {
  deviceControlTemplateRegistry.register(name, component);
}
