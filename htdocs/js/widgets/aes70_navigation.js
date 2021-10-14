import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { Devices } from '../devices.js';
import { forEachAsync } from '../utils.js';

const template = `
<div class=list>
  <div #scroller class=scroller></div>
  <div class=nodevice %if={{ !this.hasDevices }}>Searching for<br>Devices...<br><br><span %if={{ this.manualDevices }}>Add Devices<br>at the Bottom</span></div>
</div>
<aes70-add-device %if={{ this.manualDevices }}></aes70-add-device>
`;

class AES70Navigation extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return [
      {name: 'manualDevices', src: 'capabilities:manual_devices', readonly: true, sync: true},
    ];
  }

  constructor() {
    super();
    
    this.hasDevices = false;
    this.manualDevices = false;
    
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
