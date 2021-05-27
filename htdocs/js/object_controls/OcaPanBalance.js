import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectControlTemplate } from '../object_controls.js';
import { makeValueMinMaxBinding } from '../utils.js';

// knob.presets={{ "json:" + JSON.stringify(this.knobPresets) }}

const template = `
<aux-valueknob #knob
  value.format='sprintf:%.2f'
  knob.show_hand=false
  %bind={{ this.knobBindings }}
  knob.preset=medium
  base=0
  >
</aux-valueknob>
<aux-button class=edit icon=edit (click)={{ this.editClicked }}></aux-button>
`;

class OcaPanBalanceControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.knobPresets = DynamicValue.fromConstant(AES70.knobPresets);
    this.knobBindings = [
      ...makeValueMinMaxBinding('Position'),
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
        src: ['/Position/Min', '/Position/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:'L'}, {pos:max, label:'R'}, {pos:0, label:'C'}];
        }
      }
    ];
    this.editClicked = (e) => {
      this.knob.auxWidget.value._input.focus();
    }
  }
  static match(o) {
    return Math.max(
      matchClass(OCA.RemoteControlClasses.OcaPanBalance, o),
    );
  }
}

registerObjectControlTemplate(OcaPanBalanceControl, 'panbalance');
