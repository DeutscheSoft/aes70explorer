import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';
import { makeValueMinMaxBinding, limitValueDigits } from '../utils.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';

const template = `
<aux-label class=label %bind={{ this.labelBindings }}></aux-label>
<div class="Freq" %if={{ this.implementsFrequency }}>
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
<div class="gain" %if={{ this.implementsGain }}>
  <aux-valueknob #gain
    %bind={{ this.gainBindings }}
    label="Gain"
    knob.show_hand=false
    knob.preset=medium
    value.format='sprintf:%.2f'>
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.gainClicked }}></aux-button>
</div>
<div class="width" %if={{ this.implementsWidth }}>
  <aux-valueknob #width
    class="small"
    %bind={{ this.widthBindings }}
    label="Width"
    knob.show_hand=false
    knob.preset=small>
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.widthClicked }}></aux-button>
</div>
<div class="shapep" %if={{ this.implementsShapeParameter }}>
  <aux-valueknob #shapep
    class="small"
    %bind={{ this.shapepBindings }}
    label="ShapeParam"
    knob.show_hand=false
    knob.preset=small>
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.shapepClicked }}></aux-button>
</div>
<div class="shape" %if={{ this.implementsShape }}>
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
  static getHostBindings() {
    return [
      {name: 'implementsWidth', src: '/WidthParameter/Implemented', readonly: true, sync: true},
      {name: 'implementsFrequency', src: '/Frequency/Implemented', readonly: true, sync: true},
      {name: 'implementsGain', src: '/InbandGain/Implemented', readonly: true, sync: true},
      {name: 'implementsShapeParameter', src: '/ShapeParameter/Implemented', readonly: true, sync: true},
      {name: 'implementsShape', src: '/Shape/Implemented', readonly: true, sync: true},
    ];
  }
  
  constructor() {
    super();
    this.knobPresets = DynamicValue.fromConstant(AES70.knobPresets);
    this.formatValueBinding = DynamicValue.fromConstant(limitValueDigits(4));
    
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
      },
    ];
    this.frequencyBindings = [
      ...makeValueMinMaxBinding('Frequency'),
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
      ...makeValueMinMaxBinding('InbandGain'),
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
      ...makeValueMinMaxBinding('WidthParameter'),
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        name: 'value.format',
        backendValue: this.formatValueBinding,
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
      ...makeValueMinMaxBinding('ShapeParameter'),
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        name: 'value.format',
        backendValue: this.formatValueBinding,
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
      this.freq.auxWidget.set('value.format', limitValueDigits(5));
    });
  }

  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaFilterParametric, o);
  }
}

registerTemplateControl(OcaFilterParametricControl, 'filterparametric');
