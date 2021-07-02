import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { Devices } from '../devices.js';
import { forEachAsync } from '../utils.js';

const template = `
<div class=list>
  <div #scroller class=scroller></div>
  <div class=nodevice %if={{ !this.hasDevices }}>Add a Device<br>at the Bottom</div>
</div>
`;

class AES70Navigation extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    
    this.hasDevices = false;
    
    forEachAsync(
      Devices,
      (info) => {
        const element = document.createElement('aes70-device');

        element.info = info;

        this.scroller.appendChild(element);

        return () => {
          element.remove();
        };
      },
      (device) => device.name
    );
    
    Devices.subscribe((data) => {
      this.hasDevices = data && data.length;
    });
  }
}

customElements.define('aes70-navigation', AES70Navigation);
