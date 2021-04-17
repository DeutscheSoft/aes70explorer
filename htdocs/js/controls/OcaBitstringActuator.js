import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';

const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label>
<aux-bitstring %bind={{ this.bitstringBindings }}></aux-bitstring>
`;

class OcaBitstringActuatorControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
      },
    ];
    this.bitstringBindings = [
      {
        src: '/NrBits',
        name: 'length',
      },
      {
        src: '/Bitstring',
        name: 'bitstring',
      },
    ];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaBitstringActuator, o);
  }
}

registerTemplateControl(OcaBitstringActuatorControl);
