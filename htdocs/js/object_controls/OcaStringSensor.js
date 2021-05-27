import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectControlTemplate } from '../object_controls.js';


const template = `
<aux-label %bind={{ this.labelBindings }} class=label></aux-label>
<aux-label %bind={{ this.sensorBindings }} class=value></aux-label>
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

registerObjectControlTemplate(OcaStringSensorControl, 'stringsensor');
