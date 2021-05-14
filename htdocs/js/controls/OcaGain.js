import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';
import { makeValueMinMaxBinding } from '../utils.js';

const template = `
<aux-fader
  %bind={{ this.faderBindings }}
  show_value="true"
  value.format="sprintf:%.2f"
  scale.fixed_dots="[]"
  >
</aux-fader>
`;

class OcaGainControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.faderBindings = [
      ...makeValueMinMaxBinding('Gain'),
      {
        src: '/Role',
        name: 'label',
      },
      {
        src: ['/Gain/Min', '/Gain/Max'],
        name: 'scale.fixed_labels',
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{value:min, label: min.toFixed(0) }, {value:max, label: max.toFixed(0)}];
        }
      },
    ];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaGain, o);
  }
}

registerTemplateControl(OcaGainControl, 'gain');
