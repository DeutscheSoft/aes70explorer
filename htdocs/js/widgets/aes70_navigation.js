import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { Devices, makeDestinationKey } from '../devices.js';
import { forEachAsync } from '../utils.js';

const template = `
<div class=list>
  <aux-scroller #scroller scroll_x="false" (pointerup)={{ this.onClick }}></aux-scroller>
  <div class=nodevice %if={{ !this.hasDevices }}><span %if={{ this.mdns }}>Searching for<br>Devices...<br><br></span><span %if={{ this.manualDevices }}>Add Devices<br>at the Bottom</span></div>
</div>
<aes70-add-device %if={{ this.manualDevices }}></aes70-add-device>
`;

class AES70Navigation extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return [
      {name: 'manualDevices', src: 'capabilities:manual_devices', readonly: true, sync: true},
      {name: 'mdns', src: 'capabilities:mdns', readonly: true, sync: true},
    ];
  }

  constructor() {
    super();

    this.hasDevices = false;
    this.manualDevices = false;
    this.mdns = false;

    this.onClick = e => {
      setTimeout(() => {
        this.scroller.auxWidget.resize();
      }, 100);
    }

    forEachAsync(
      Devices,
      (info) => {
        const element = document.createElement('aes70-device');

        element.info = info;

        this.scroller.firstChild.appendChild(element);

        return () => {
          element.remove();
        };
      },
      makeDestinationKey
    );

    Devices.subscribe((data) => {
      this.hasDevices = data && data.length;
    });
  }
}

customElements.define('aes70-navigation', AES70Navigation);
