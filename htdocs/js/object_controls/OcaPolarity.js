import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectControlTemplate } from '../object_controls.js';

const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label>
<aux-toggle icon=polarity %bind={{ this.toggleBindings }}></aux-toggle>
`;

class OcaPolarityControl extends TemplateComponent.fromString(template) {
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
        src: '/State',
        name: 'state',
        // non-inverted: 1, inverted: 2
        transformReceive: v => !!(v - 1),
        transformSend: v => v ? 2 : 1,
      },
    ];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaPolarity, o);
  }
}

registerObjectControlTemplate(OcaPolarityControl, 'polarity');
