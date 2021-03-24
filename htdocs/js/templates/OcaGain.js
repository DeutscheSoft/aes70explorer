import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { registerTemplateComponent } from '../template_components.js';

const template = `
<aux-fader
  %bind={{ this.faderBindings }}
  show_value="true"
  value.format="sprintf:%.2f">
</aux-fader>
`;

class OcaGainTemplate extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.faderBindings = [
      {
        src: '/Role',
        name: 'label',
      },
      {
        src: '/Gain',
        name: 'value',
      },
      {
        src: '/Gain/Min',
        name: 'min',
      },
      {
        src: '/Gain/Max',
        name: 'max',
      },
    ];
  }
  static match(o) {
    return o.ClassName === 'OcaGain';
  }
}

registerTemplateComponent(OcaGainTemplate);
