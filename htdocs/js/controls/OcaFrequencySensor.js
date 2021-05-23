import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';
import { limitValueDigits } from '../utils.js';

const template = `
<aux-label %bind={{ this.labelBindings }} class=label></aux-label>
<aux-label %bind={{ this.readingBindings }} class=value></aux-label>
`;

class OcaFrequencySensorControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      },
    ]
    this.readingBindings = [
      {
        src: '/Reading',
        name: 'label',
        readonly: true,
        transformReceive: limitValueDigits(6),
      },
    ];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaFrequencySensor, o);
  }
}

registerTemplateControl(OcaFrequencySensorControl, 'frequencysensor');
