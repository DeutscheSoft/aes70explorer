import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { registerTemplateControl } from '../template_components.js';

const template = `
<aux-fader
  %bind={{ this.faderBindings }}
  show_value="true"
  value.format="sprintf:%.2f"
  scale="decibel"
  log_factor="3">
</aux-fader>
`;

class OcaGainControl extends TemplateComponent.fromString(template) {
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

registerTemplateControl(OcaGainControl);
