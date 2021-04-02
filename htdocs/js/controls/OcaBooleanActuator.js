import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';

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

registerTemplateControl(OcaBooleanActuatorControl);
