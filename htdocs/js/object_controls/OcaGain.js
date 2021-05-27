import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectControlTemplate } from '../object_controls.js';
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
        readonly: true,
      },
      {
        src: ['/Gain/Min', '/Gain/Max'],
        name: 'scale.fixed_labels',
        readonly: true,
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

registerObjectControlTemplate(OcaGainControl, 'gain');
