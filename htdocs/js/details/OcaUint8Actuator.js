import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { registerTemplateDetails } from '../template_components.js';

const template = `

`;

class OcaUint8ActuatorDetails extends TemplateComponent.fromString(template) {
  constructor() {
    super();
  }
  static match(o) {
    return [
      'OcaInt8Actuator',
      'OcaInt16Actuator',
      'OcaInt32Actuator',
      'OcaInt64Actuator',
      'OcaUint8Actuator',
      'OcaUint16Actuator',
      'OcaUint32Actuator',
      'OcaUint64Actuator',
      'OcaFloat32Actuator',
      'OcaFloat64Actuator',
    ].indexOf(o.ClassName) >= 0;
  }
}

registerTemplateDetails(OcaUint8ActuatorDetails);
