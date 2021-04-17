import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';


const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label>
`;

class OcaStringSensorControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.labelBindings = [
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

registerTemplateControl(OcaStringSensorControl);
