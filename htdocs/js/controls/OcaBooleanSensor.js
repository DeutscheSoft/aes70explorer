import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';


const template = `
<aux-state %bind={{ this.stateBindings }}></aux-state>
`;

class OcaBooleanSensorControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.stateBindings = [
      {
        src: '/Reading',
        name: 'state',
        readonly: true,
      }
    ];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaBooleanSensor, o);
  }
}

registerTemplateControl(OcaBooleanSensorControl, 'booleansensor');
