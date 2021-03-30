import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { registerTemplateControl } from '../template_components.js';

// knob.presets={{ "json:" + JSON.stringify(this.knobPresets) }}

const template = `
<aux-valueknob #knob
  value.format='sprintf:%.2f'
  knob.show_hand=false
  %bind={{ this.knobBindings }}
  knob.preset=medium
  >
</aux-valueknob>
<aux-button icon=edit (click)={{ this.editClicked }}></aux-button>
`;

const knobPresets = {
  tiny: {
    margin: 0,
    thickness: 5,
    hand: { width: 1, length: 6, margin: 8 },
    dots_defaults: { length: 4, margin: 0.5, width: 1 },
    markers_defaults: { thickness: 2, margin: 0 },
    show_labels: false,
  },
  small: {
    margin: 8,
    thickness: 4,
    hand: { width: 1, length: 8, margin: 17 },
    dots_defaults: { length: 4.5, margin: 8.5, width: 1 },
    markers_defaults: { thickness: 2, margin: 8 },
    labels_defaults: { margin: 9 },
    show_labels: true,
  },
  medium: {
    margin: 13,
    thickness: 3,
    hand: { width: 1, length: 10, margin: 25 },
    dots_defaults: { length: 6, margin: 13.5, width: 1 },
    markers_defaults: { thickness: 2, margin: 11 },
    show_labels: true,
  },
  large: { 
    margin: 13,
    thickness: 2.2,
    hand: { width: 1.5, length: 12, margin: 26 },
    dots_defaults: { length: 6, margin: 13.5, width: 1 },
    markers_defaults: { thickness: 2, margin: 11 },
    show_labels: true,
  },
  huge: {
    margin: 13,
    thickness: 1.8,
    hand: { width: 2, length: 12, margin: 28 },
    dots_defaults: { length: 6, margin: 13.5, width: 1 },
    markers_defaults: { thickness: 2, margin: 11 },
    show_labels: true,
  },
}
    
class OcaFloatActuatorControl extends TemplateComponent.fromString(template) {
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
      }
    ];
    this.editClicked = (e) => {
      this.knob.auxWidget.value._input.focus();
    }
  }
  static match(o) {
    return [
      'OcaFloat32Actuator',
      'OcaFloat64Actuator',
      'OcaPanBalance',
      'OcaDelay',
      'OcaDelayExtended',
    ].indexOf(o.ClassName) >= 0;
  }
}

registerTemplateControl(OcaFloatActuatorControl);