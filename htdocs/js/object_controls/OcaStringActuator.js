import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectControlTemplate } from '../object_controls.js';

const template = `
<aux-label %bind={{ this.LabelBindings }}></aux-label>
<aux-value preset=string %bind={{ this.ValueBindings }}></aux-value>
`;

class OcaStringActuatorControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.LabelBindings = [
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      },
    ];
    this.ValueBindings = [
      {
        src: '/Setting',
        name: 'value',
      },
      {
        src: '/MaxLen',
        name: 'maxlength',
        readonly: true,
      },
    ];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaStringActuator, o);
  }
}

registerObjectControlTemplate(OcaStringActuatorControl, 'stringactuator');
