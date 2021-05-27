import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectControlTemplate } from '../object_controls.js';

const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label>
<aux-state %bind={{ this.stateBindings }}></aux-state>
`;

class OcaBooleanSensorControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      }
    ];
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

registerObjectControlTemplate(OcaBooleanSensorControl, 'booleansensor');
