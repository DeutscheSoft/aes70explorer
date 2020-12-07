import { BaseComponent } from '../../AWML/src/components/base_component.js';
import { Devices } from '../devices.js';
import { forEachAsync } from '../utils.js';

class AES70Navigation extends BaseComponent {
  connectedCallback() {
    super.connectedCallback();
    this.style.display = null;
  }

  _subscribe() {
    return forEachAsync(
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
