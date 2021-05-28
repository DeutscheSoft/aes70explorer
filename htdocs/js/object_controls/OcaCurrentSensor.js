import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { makeValueMinMaxBinding, limitValueDigits } from '../utils.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectControlTemplate } from '../object_controls.js';

const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label>
<aux-gauge
  %bind={{ this.gaugeBindings }}
  preset=gauge
  show_hand=true
  >
</aux-gauge>
<aux-label %bind={{ this.valueBindings }} class=value></aux-label>
`;

class OcaCurrentSensorControl extends TemplateComponent.fromString(template) {

  constructor() {
    super();
    this.gaugePresets = DynamicValue.fromConstant(AES70.gaugePresets);
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      },
    ]
    this.gaugeBindings = [
      ...makeValueMinMaxBinding('Reading'),
      {
        src: ['/Reading/Min','/Reading/Max'],
        name: 'labels',
        readonly: true,
      },
      {
        backendValue: this.gaugePresets,
        name: 'presets',
        readonly: true,
      },
    ];
    this.valueBindings = [
      {
        src: '/Reading',
        name: 'label',
        readonly: true,
        transformReceive: limitValueDigits(5, 'A'),
      },
    ];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaCurrentSensor, o);
  }
}

registerObjectControlTemplate(OcaCurrentSensorControl, 'currentsensor');
