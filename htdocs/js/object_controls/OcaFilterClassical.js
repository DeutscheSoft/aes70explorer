import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectControlTemplate } from '../object_controls.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';
import { makeValueMinMaxBinding, makeImplementedBindings, limitValueDigits } from '../utils.js';

// knob.presets={{ "json:" + JSON.stringify(this.knobPresets) }}

const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label>

<div %if={{ this.implementsParameter }}>
  <aux-valueknob #param
    class=small
    label="Parameter"
    knob.show_hand=false
    %bind={{ this.paramBindings }}
    knob.preset=small
    scale="linear"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.paramClicked }}></aux-button>
</div>

<div class=freq %if={{ this.implementsFrequency }}>
  <aux-valueknob #freq
    label="Frequency"
    value.format='sprintf:%d'
    knob.show_hand=false
    %bind={{ this.freqBindings }}
    knob.preset=medium
    scale="frequency"
    min="1"
    max="20000"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.freqClicked }}></aux-button>
</div>

<div class=order %if={{ this.implementsOrder }}>
  <aux-valueknob #order
    class=small
    label="Order"
    value.format='sprintf:%d'
    knob.show_hand=false
    %bind={{ this.orderBindings }}
    knob.preset=small
    snap=1
    scale="linear"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.orderClicked }}></aux-button>
</div>

<div class=switch>
  <aux-buttons %if={{ this.implementsPassband }}
    %bind={{ this.passbandBindings }}
    buttons="js:[{icon:'hipass'},{icon:'lopass'},{icon:'bandpass'},{icon:'bandreject'},{icon:'allpass'}]"
  ></aux-buttons>
  <aux-select %if={{ this.implementsShape }}
    %bind={{ this.shapeBindings }}
    auto_size=true
    entries="js:['ButterW','Bessel','ChebyS','LinkwR']"
  ></aux-select>
</div>
`;

class OcaFilterClassicalControl extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return makeImplementedBindings([
      'Parameter', 'Frequency', 'Order', 'Shape', 'Passband',
    ]);
  }
  
  constructor() {
    super();
    this.knobPresets = DynamicValue.fromConstant(AES70.knobPresets);
    this.formatValueBinding = DynamicValue.fromConstant(limitValueDigits(4));
    
    this.freqBindings = [
      ...makeValueMinMaxBinding('Frequency'),
      {
        src: '/Frequency/Min',
        name: 'base',
        readonly: true,
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
        readonly: true,
      },
      {
        src: ['/Frequency/Min', '/Frequency/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      }
    ];
    this.paramBindings = [
      ...makeValueMinMaxBinding('Parameter'),
      {
        src: '/Parameter/Min',
        name: 'base',
        readonly: true,
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
        readonly: true,
      },
      {
        name: 'value.format',
        readonly: true,
        backendValue: this.formatValueBinding,
      },
      {
        src: ['/Parameter/Min', '/Parameter/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      }
    ];
    this.orderBindings = [
      ...makeValueMinMaxBinding('Order'),
      {
        src: '/Order/Min',
        name: 'base',
        readonly: true,
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
        readonly: true,
      },
      {
        src: ['/Order/Min', '/Order/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          const a = [];
          for (let i = min, m = max; i <= m; ++i)
            a.push({pos:i, label:i});
          return a;
        }
      },
      {
        src: ['/Order/Min', '/Order/Max'],
        name: 'angle',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          const amnt = (max - min);
          const angle = amnt * 30;
          return angle;
        }
      },
      {
        src: ['/Order/Min', '/Order/Max'],
        name: 'start',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          const amnt = (max - min);
          const angle = amnt * 30;
          return 270 - angle / 2;
        }
      },
      {
        src: ['/Order/Min', '/Order/Max'],
        name: 'basis',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          const amnt = (max - min);
          return amnt * 40;
        }
      }
    ];
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      },
    ];
    this.passbandBindings = [
      {
        src: '/Passband',
        name: 'select',
        transformSend: v => v + 1,
        transformReceive: v => v - 1,
      },
    ];
    this.shapeBindings = [
      {
        src: '/Shape',
        name: 'selected',
        transformSend: v => v + 1,
        transformReceive: v => v - 1,
      },
    ];
    this.freqClicked = (e) => {
      this.freq.auxWidget.value._input.focus();
    }
    this.orderClicked = (e) => {
      this.order.auxWidget.value._input.focus();
    }
    this.paramClicked = (e) => {
      this.param.auxWidget.value._input.focus();
    }
    this.subscribeEvent('attached', () => {
      this.freq.auxWidget.set('value.format', limitValueDigits(5));
    });
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaFilterClassical, o);
  }
}

registerObjectControlTemplate(OcaFilterClassicalControl, 'filterclassical');
