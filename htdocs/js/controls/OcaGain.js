import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';

const template = `
<aux-fader
  %bind={{ this.faderBindings }}
  show_value="true"
  value.format="sprintf:%.2f">
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
    return matchClass(OCA.RemoteControlClasses.OcaGain, o);
  }
}

registerTemplateControl(OcaGainControl);
