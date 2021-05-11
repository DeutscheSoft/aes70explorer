import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';
import { formatFrequency } from '../utils.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';

const template = `
<aux-label class=label %bind={{ this.labelBindings }}></aux-label>
<div class="Freq">
  <aux-valueknob #freq
    %bind={{ this.frequencyBindings }}
    label="Frequency"
    knob.show_hand=false
    knob.preset=medium
    scale=frequency
    min=1
    max=20000>
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.freqClicked }}></aux-button>
</div>
<div class="gain">
  <aux-valueknob #gain
    %bind={{ this.gainBindings }}
    label="Gain"
    knob.show_hand=false
    knob.preset=medium
    value.format='sprintf:%.2f'>
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.gainClicked }}></aux-button>
</div>
<div class="width">
  <aux-valueknob #width
    class="small"
    %bind={{ this.widthBindings }}
    label="Width"
    knob.show_hand=false
    knob.preset=small
    value.format='sprintf:%.1f'>
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.widthClicked }}></aux-button>
</div>
<div class="shapep">
  <aux-valueknob #shapep
    class="small"
    %bind={{ this.shapepBindings }}
    label="ShapeParam"
    knob.show_hand=false
    knob.preset=small
    value.format='sprintf:%.2f'>
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.shapepClicked }}></aux-button>
</div>
<div class="shape">
  <aux-select
    %bind={{ this.shapeBindings }}
    auto_size=true
    entries="js:[
      'None',
      'PEQ',
      'LowShelv',
      'HighShelv',
      'LowPass',
      'HighPass',
      'BandPass',
      'AllPass',
      'Notch',
      'ToneControlLowFixed',
      'ToneControlLowSliding',
      'ToneControlHighFixed',
      'ToneControlHighSliding'
    ]"
  ></aux-select>
  
`;

class OcaFilterParametricControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.knobPresets = DynamicValue.fromConstant(AES70.knobPresets);
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
      },
    ];
    this.frequencyBindings = [
      {
        src: '/Frequency/Min',
        name: 'min',
      },
      {
        src: '/Frequency/Max',
        name: 'max',
      },
      {
        src: '/Frequency',
        name: 'value',
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        src: ['/Frequency/Min', '/Frequency/Max'],
        name: 'labels',
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      }
    ];
    this.gainBindings = [
      {
        src: '/InbandGain/Min',
        name: 'min',
      },
      {
        src: '/InbandGain/Max',
        name: 'max',
      },
      {
        src: '/InbandGain',
        name: 'value',
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        src: ['/InbandGain/Min', '/InbandGain/Max'],
        name: 'labels',
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      }
    ];
    this.widthBindings = [
      {
        src: '/WidthParameter/Min',
        name: 'min',
      },
      {
        src: '/WidthParameter/Max',
        name: 'max',
      },
      {
        src: '/WidthParameter',
        name: 'value',
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        src: ['/WidthParameter/Min', '/WidthParameter/Max'],
        name: 'labels',
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      }
    ];
    this.shapepBindings = [
      {
        src: '/ShapeParameter/Min',
        name: 'min',
      },
      {
        src: '/ShapeParameter/Max',
        name: 'max',
      },
      {
        src: '/ShapeParameter',
        name: 'value',
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        src: ['/ShapeParameter/Min', '/ShapeParameter/Max'],
        name: 'labels',
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      }
    ];
    this.shapeBindings = [
      {
        src: '/Shape',
        name: 'selected',
        transformReceive: v => v.value,
      },
    ];
    this.freqClicked = (e) => {
      this.freq.auxWidget.value._input.focus();
    }
    this.widthClicked = (e) => {
      this.width.auxWidget.value._input.focus();
    }
    this.shapepClicked = (e) => {
      this.shapep.auxWidget.value._input.focus();
    }
    this.gainClicked = (e) => {
      this.gain.auxWidget.value._input.focus();
    }
    this.subscribeEvent('attached', () => {
      this.freq.auxWidget.set('value.format', formatFrequency);
    });
  }

  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaFilterParametric, o);
  }
}

registerTemplateControl(OcaFilterParametricControl, 'filterparametric');
