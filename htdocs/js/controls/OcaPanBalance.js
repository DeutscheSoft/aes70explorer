import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';

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
    
class OcaPanBalanceControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.knobPresets = DynamicValue.fromConstant(knobPresets);
    this.knobBindings = [
      {
        src: '/Role',
        name: 'label',
      },
      {
        src: '/Position',
        name: 'value',
      },
      {
        src: '/Position/Min',
        name: 'min',
      },
      {
        src: '/Position/Max',
        name: 'max',
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        src: ['/Position/Min', '/Position/Max'],
        name: 'labels',
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

registerTemplateControl(OcaPanBalanceControl);
