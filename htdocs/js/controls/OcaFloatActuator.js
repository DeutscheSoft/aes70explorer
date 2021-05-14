import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';
import { makeValueMinMaxBinding } from '../utils.js';

// knob.presets={{ "json:" + JSON.stringify(this.knobPresets) }}

const template = `
<aux-valueknob #knob
  value.format='sprintf:%.2f'
  knob.show_hand=false
  %bind={{ this.knobBindings }}
  knob.preset=medium
  >
</aux-valueknob>
<aux-button class=edit icon=edit (click)={{ this.editClicked }}></aux-button>
`;

class OcaFloatActuatorControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.knobPresets = DynamicValue.fromConstant(AES70.knobPresets);
    this.knobBindings = [
      ...makeValueMinMaxBinding('Setting'),
      {
        src: '/Role',
        name: 'label',
      },
      {
        src: '/Setting/Min',
        name: 'base',
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        src: ['/Setting/Min', '/Setting/Max'],
        name: 'labels',
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%.2f', min)}, {pos:max, label:sprintf('%.2f', max)}];
        }
      }
    ];
    this.editClicked = (e) => {
      this.knob.auxWidget.value._input.focus();
    }
  }
  static match(o) {
    return Math.max(
      matchClass(OCA.RemoteControlClasses.OcaFloat32Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaFloat64Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaDelayExtended, o)
    );
  }
}

registerTemplateControl(OcaFloatActuatorControl, 'floatactuator');
