import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';
import { formatFrequency } from '../utils.js';

// knob.presets={{ "json:" + JSON.stringify(this.knobPresets) }}

const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label>

<div>
  <aux-valueknob #param
    class=small
    label="Parameter"
    value.format='sprintf:%.1f'
    knob.show_hand=false
    %bind={{ this.paramBindings }}
    knob.preset=small
    scale="linear"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.paramClicked }}></aux-button>
</div>

<div class=freq>
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

<div>
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
  <aux-buttons
    %bind={{ this.passbandBindings }}
    buttons="js:[{icon:'hipass'},{icon:'lopass'},{icon:'bandpass'},{icon:'bandreject'},{icon:'allpass'}]"
  ></aux-buttons>
  <aux-select
    %bind={{ this.shapeBindings }}
    auto_size=true
    entries="js:['ButterW','Bessel','ChebyS','LinkwR']"
  ></aux-select>
</div>
`;

class OcaFilterClassicalControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.knobPresets = DynamicValue.fromConstant(AES70.knobPresets);
    this.freqBindings = [
      {
        src: '/Frequency/Min',
        name: 'min',
      },
      {
        src: '/Frequency/Max',
        name: 'max',
      },
      {
        src: '/Frequency/Min',
        name: 'base',
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
    this.paramBindings = [
      {
        src: '/Parameter/Min',
        name: 'min',
      },
      {
        src: '/Parameter/Max',
        name: 'max',
      },
      {
        src: '/Parameter/Min',
        name: 'base',
      },
      {
        src: '/Parameter',
        name: 'value',
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        src: ['/Parameter/Min', '/Parameter/Max'],
        name: 'labels',
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      }
    ];
    this.orderBindings = [
      {
        src: '/Order/Min',
        name: 'min',
      },
      {
        src: '/Order/Max',
        name: 'max',
      },
      {
        src: '/Order/Min',
        name: 'base',
      },
      {
        src: '/Order',
        name: 'value',
      },
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        src: ['/Order/Min', '/Order/Max'],
        name: 'labels',
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
        transformReceive: function (arr) {
          const [min, max] = arr;
          const amnt = (max - min);
          const angle = amnt * 30;
          return 270 - angle / 2;
        }
      }
    ];
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
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
      this.freq.auxWidget.set('value.format', formatFrequency);
    });
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaFilterClassical, o);
  }
}

registerTemplateControl(OcaFilterClassicalControl, 'filterclassical');
