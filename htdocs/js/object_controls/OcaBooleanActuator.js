import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectControlTemplate } from '../object_controls.js';

const template = `
<aux-toggle %bind={{ this.faderBindings }}></aux-toggle>
`;

class OcaBooleanActuatorControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.faderBindings = [
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      },
      {
        src: '/Setting',
        name: 'state',
      },
    ];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaBooleanActuator, o);
  }
}

registerObjectControlTemplate(OcaBooleanActuatorControl, 'booleanactuator');
