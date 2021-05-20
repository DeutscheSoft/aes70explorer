import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';

const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label>
<aux-toggle icon=ocaidentificationactuator %bind={{ this.toggleBindings }}></aux-toggle>
`;

class OcaIdentificationActuatorControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      },
    ];
    this.toggleBindings = [
      {
        src: '/Active',
        name: 'state',
      },
    ];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaIdentificationActuator, o);
  }
}

registerTemplateControl(OcaIdentificationActuatorControl, 'identificationactuator');
