import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { registerTemplateControl } from '../template_components.js';

const template = `
<aux-valueknob #knob
  knob.presets={{ this.knobPresets }}
  value.format='sprintf:%.2f'
  knob.show_hand=false
  %bind={{ this.knobBindings }}
  >
</aux-valueknob>
<aux-button icon=edit (click)={{ this.editClicked }}></aux-button>
`;

const knobPresets = {
  tiny: {
    margin: 0,
    thickness: 4,
    hand: { width: 1, length: 6, margin: 8 },
    dots_defaults: { length: 4, margin: 0.5, width: 1 },
    markers_defaults: { thickness: 2, margin: 0 },
    show_labels: false,
  },
  small: {
    margin: 8,
    thickness: 4.5,
    hand: { width: 1, length: 8, margin: 17 },
    dots_defaults: { length: 4.5, margin: 8.5, width: 1 },
    markers_defaults: { thickness: 2, margin: 8 },
    labels_defaults: { margin: 9 },
    show_labels: true,
  },
  medium: {
    margin: 13,
    thickness: 6,
    hand: { width: 1, length: 10, margin: 25 },
    dots_defaults: { length: 6, margin: 13.5, width: 1 },
    markers_defaults: { thickness: 2, margin: 11 },
    show_labels: true,
  },
  large: { 
    margin: 13,
    thickness: 6,
    hand: { width: 1.5, length: 12, margin: 26 } },
    dots_defaults: { length: 6, margin: 13.5, width: 1 },
    markers_defaults: { thickness: 2, margin: 11 },
    show_labels: true,
  huge: {
    margin: 13,
    thickness: 6,
    hand: { width: 2, length: 12, margin: 28 } },
    dots_defaults: { length: 6, margin: 13.5, width: 1 },
    markers_defaults: { thickness: 2, margin: 11 },
    show_labels: true,
}
    
class OcaUint8ActuatorControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.knobPresets = DynamicValue.fromConstant(knobPresets);
    this.knobBindings = [
      {
        src: '/Role',
        name: 'label',
      },
      {
        src: '/Setting',
        name: 'value',
      },
      {
        src: '/Setting/Min',
        name: 'min',
      },
      {
        src: '/Setting/Max',
        name: 'max',
      },
      {
        src: '/Setting/Min',
        name: 'base',
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
        format: 'js',
      }
    ];
    this.editClicked = (e) => {
      this.knob.auxWidget.value._input.focus();
    }
  }
  static match(o) {
    return [
      'OcaInt8Actuator',
      'OcaInt16Actuator',
      'OcaInt32Actuator',
      'OcaInt64Actuator',
      'OcaUint8Actuator',
      'OcaUint16Actuator',
      'OcaUint32Actuator',
      'OcaUint64Actuator',
      'OcaFloat32Actuator',
      'OcaFloat64Actuator',
    ].indexOf(o.ClassName) >= 0;
  }
}

registerTemplateControl(OcaUint8ActuatorControl);
