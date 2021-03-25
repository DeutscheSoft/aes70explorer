import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { registerTemplateControl } from '../template_components.js';

const template = `
<aux-toggle icon=polarity %bind={{ this.faderBindings }}></aux-toggle>
`;

class OcaPolarityControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.faderBindings = [
      {
        src: '/Role',
        name: 'label',
      },
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
    return o.ClassName === 'OcaPolarity';
  }
}

registerTemplateControl(OcaPolarityControl);
