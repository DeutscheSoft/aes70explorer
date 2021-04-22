import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';

const template = `
<aux-valueknob #knob
  value.format='sprintf:%.3f'
  knob.show_hand=false
  %bind={{ this.knobBindings }}
  knob.preset=medium
  >
</aux-valueknob>
<aux-button icon=edit (click)={{ this.editClicked }}></aux-button>
`;

class OcaDelayControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.knobPresets = DynamicValue.fromConstant(AES70.knobPresets);
    this.knobBindings = [
      {
        src: '/Role',
        name: 'label',
      },
      {
        src: '/DelayTime',
        name: 'value',
      },
      {
        src: '/DelayTime/Min',
        name: 'min',
      },
      {
        src: '/DelayTime/Max',
        name: 'max',
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        src: ['/DelayTime/Min', '/DelayTime/Max'],
        name: 'labels',
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%.3f', min)}, {pos:max, label:sprintf('%.3f', max)}];
        }
      },
    ];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaDelay, o);
  }
}

registerTemplateControl(OcaDelayControl);
