import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectControlTemplate } from '../object_controls.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';
import { makeValueMinMaxBinding, limitValueDigits } from '../utils.js';

const template = `
<aux-valueknob #knob
  value.format='sprintf:%.3f'
  knob.show_hand=false
  %bind={{ this.knobBindings }}
  knob.preset=medium
  >
</aux-valueknob>
<aux-button class=edit icon=edit (click)={{ this.editClicked }}></aux-button>
`;

class OcaDelayControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.knobPresets = DynamicValue.fromConstant(AES70.knobPresets);
    this.formatValueBinding = DynamicValue.fromConstant(limitValueDigits(4));
    
    this.knobBindings = [
      ...makeValueMinMaxBinding('DelayTime'),
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
        readonly: true,
      },
      {
        name: 'value.format',
        backendValue: this.formatValueBinding,
        readonly: true,
      },
      {
        src: ['/DelayTime/Min', '/DelayTime/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%.3f', min)}, {pos:max, label:sprintf('%.3f', max)}];
        }
      },
    ];
    this.editClicked = (e) => {
      this.knob.auxWidget.value._input.focus();
    }
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaDelay, o);
  }
}

registerObjectControlTemplate(OcaDelayControl, 'delay');
