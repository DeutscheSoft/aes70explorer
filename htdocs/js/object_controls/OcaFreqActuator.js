import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectControlTemplate } from '../object_controls.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';
import { makeValueMinMaxBinding, limitValueDigits } from '../utils.js';

// knob.presets={{ "json:" + JSON.stringify(this.knobPresets) }}

const template = `
<aux-valueknob #knob
  value.format='sprintf:%d'
  knob.show_hand=false
  %bind={{ this.knobBindings }}
  knob.preset=medium
  scale="frequency"
  min="1"
  max="20000"
  >
</aux-valueknob>
<aux-button class=edit icon=edit (click)={{ this.editClicked }}></aux-button>
`;

class OcaFreqActuatorControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.knobPresets = DynamicValue.fromConstant(AES70.knobPresets);
    this.formatValueBinding = DynamicValue.fromConstant(limitValueDigits(4));
    
    this.knobBindings = [
      ...makeValueMinMaxBinding('Frequency'),
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      },
      {
        src: '/Frequency/Min',
        name: 'base',
        readonly: true,
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
        readonly: true,
      },
      {
        name: 'value.format',
        readonly: true,
        backendValue: this.formatValueBinding,
      },
      {
        src: ['/Frequency/Min', '/Frequency/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      }
    ];
    this.editClicked = (e) => {
      this.knob.auxWidget.value._input.focus();
    }
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaFrequencyActuator, o);
  }
}

registerObjectControlTemplate(OcaFreqActuatorControl, 'frequencyactuator');
