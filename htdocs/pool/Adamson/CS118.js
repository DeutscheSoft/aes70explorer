import { TemplateComponent } from '../../../AWML/src/index.pure.js';
import { registerDeviceControlTemplate } from '../../device_controls.js';

import { objectControlPrefix } from '../../object_controls.js';

const template = `
<aux-label %bind={{ this.ManufacturerBind }} class=manufacturer></aux-label>
<aux-label %bind={{ this.LabelBind }} class=label></aux-label>
<aux-label %bind={{ this.VersionBind }} class=version></aux-label>
<aux-label %bind={{ this.SerialBind }} class=serial></aux-label>

<${objectControlPrefix}-gain prefix='/inputGain01'></${objectControlPrefix}-gain>
<${objectControlPrefix}-mute prefix='/inputMute01'></${objectControlPrefix}-mute>
<${objectControlPrefix}-delay prefix='/inputDelay01'></${objectControlPrefix}-delay>
<${objectControlPrefix}-filterparametric prefix='/inputParEq01'></${objectControlPrefix}-delay>

<link rel=stylesheet href="js/device_controls/Adamson/Adamson.css" type="text/css">
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
  
  static async match(device) {
    try {
      const modelDescription = await device.DeviceManager.GetModelDescription();
      const manufacturer = modelDescription.Manufacturer;

      if (!manufacturer.match(/Adamson/i))
        return -1;

      if (!modelDescription.Name.match(/Subwoofer/i))
        return -1;

      return 10;
    } catch (err) {
      console.error('Matching adamson device failed: %o\n', err);
      return -1;
    }
  }
}

registerDeviceControlTemplate(GenericDeviceControl, 'adamson-subwoofer');
