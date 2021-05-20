import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';


const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label>
<aux-label %bind={{ this.sensorBindings }}></aux-label>
`;

class OcaStringSensorControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      }
    ];
    this.sensorBindings = [
      {
        src: '/String',
        name: 'label',
        readonly: true,
      }
    ];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaStringSensor, o);
  }
}

registerTemplateControl(OcaStringSensorControl, 'stringsensor');
