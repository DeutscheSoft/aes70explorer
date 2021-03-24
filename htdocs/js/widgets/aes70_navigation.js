import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { Devices } from '../devices.js';
import { forEachAsync } from '../utils.js';

const template = ``;

class AES70Navigation extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    
    forEachAsync(
      Devices,
      (info) => {
        const element = document.createElement('aes70-device');

        element.info = info;

        this.appendChild(element);

        return () => {
          element.remove();
        };
      },
      (device) => device.name
    );
  }
}

customElements.define('aes70-navigation', AES70Navigation);
