import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { registerDeviceControlTemplate } from '../device_controls.js';

import { objectDetailPrefix } from '../object_details.js';

const template = `
<aux-label %bind={{ this.ManufacturerBind }} class=manufacturer></aux-label>
<aux-label %bind={{ this.LabelBind }} class=label></aux-label>
<aux-label %bind={{ this.VersionBind }} class=version></aux-label>
<aux-label %bind={{ this.SerialBind }} class=serial></aux-label>
`;

class GenericDeviceControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    
    this.LabelBind = [
      {
        src: ['/DeviceManager/DeviceName', '/DeviceManager/ModelDescription'],
        name: 'label',
        readonly: true,
        transformReceive: arr => {
          const [name, desc] = arr;
          return name ? name : desc.Model;
        },
      }
    ];
    this.ManufacturerBind = [
      {
        src: '/DeviceManager/ModelDescription',
        name: 'label',
        readonly: true,
        transformReceive: v => v.Manufacturer,
      }
    ];
    this.SerialBind = [
      {
        src: '/DeviceManager/SerialNumber',
        name: 'label',
        readonly: true,
      }
    ];
    this.VersionBind = [
      {
        src: '/DeviceManager/ModelDescription',
        name: 'label',
        readonly: true,
        transformReceive: v => v.Version,
      }
    ];
  }

  static match(o) {
    return 0;
  }
}

registerDeviceControlTemplate(GenericDeviceControl, 'generic');
