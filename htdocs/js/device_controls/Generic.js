import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { registerDeviceControlTemplate } from '../device_controls.js';

import { objectDetailPrefix } from '../object_details.js';

const template = `
Generic device:
<${objectDetailPrefix}-devicemanager prefix='/DeviceManager'></${objectDetailPrefix}-devicemanager>
`;

class GenericDeviceControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
  }

  static match(o) {
    return 0;
  }
}

registerDeviceControlTemplate(GenericDeviceControl, 'generic');
