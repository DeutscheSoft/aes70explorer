import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectControlTemplate } from '../object_controls.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';
import { makeValueMinMaxBinding } from '../utils.js';

// knob.presets={{ "json:" + JSON.stringify(this.knobPresets) }}

const template = `
<aux-valueknob #knob
  value.format='sprintf:%d'
  knob.show_hand=false
  %bind={{ this.knobBindings }}
  knob.preset=medium
  snap=1
  >
</aux-valueknob>
<aux-button class=edit icon=edit (click)={{ this.editClicked }}></aux-button>
`;

class OcaIntActuatorControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.knobPresets = DynamicValue.fromConstant(AES70.knobPresets);
    this.knobBindings = [
      ...makeValueMinMaxBinding('Setting'),
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      },
      {
        src: '/Setting/Min',
        name: 'base',
        readonly: true,
        transformReceive: v => Number(v),
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
        readonly: true,
      },
      {
        src: ['/Setting/Min', '/Setting/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: function (arr) {
          let [min, max] = arr;
          min = Number(min);
          max = Number(max);
          return [{pos:min, label:min}, {pos:max, label:max}];
        }
      }
    ];
    this.editClicked = (e) => {
      this.knob.auxWidget.value._input.focus();
    }
  }
  static match(o) {
    return Math.max(
      matchClass(OCA.RemoteControlClasses.OcaInt8Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaInt16Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaInt32Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaInt64Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaUint8Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaUint16Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaUint32Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaUint64Actuator, o),
    );
  }
}

registerObjectControlTemplate(OcaIntActuatorControl, 'intactuator');
