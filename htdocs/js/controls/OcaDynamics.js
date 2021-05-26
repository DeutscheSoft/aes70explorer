import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';
import { makeValueMinMaxBinding, makeImplementedBindings, limitValueDigits } from '../utils.js';

const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label>

<div %if={{ this.implementsAttackTime }} class=attack>
  <aux-valueknob #attack
    class=small
    label="Attack"
    knob.show_hand=false
    %bind={{ this.attackBindings }}
    knob.preset=small
    scale="decibel"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.attackClicked }}></aux-button>
</div>
<div %if={{ this.implementsReleaseTime }} class=release>
  <aux-valueknob #release
    class=small
    label="Release"
    knob.show_hand=false
    %bind={{ this.releaseBindings }}
    knob.preset=small
    scale="decibel"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.releaseClicked }}></aux-button>
</div>
<div %if={{ this.implementsHoldTime }} class=hold>
  <aux-valueknob #hold
    class=small
    label="Hold"
    knob.show_hand=false
    %bind={{ this.holdBindings }}
    knob.preset=small
    scale="decibel"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.holdClicked }}></aux-button>
</div>

<aux-dynamics %bind={{ this.dynamicsBindings }}>
</aux-dynamics>

<aux-levelmeter
  %if={{ this.implementsDynamicGain }}
  %bind={{ this.gainBindings }}
  max=-96
  min=0
  scale="decibel"
  label="Gain"
  reverse=true
  gradient="js:{'-96':'#280062', '-32':'#8b06a5', '0':'#ff6600'}"
  >
</aux-levelmeter>

<div %if={{ this.implementsTriggered }} class=triggered>
  <aux-label label="Triggered"></aux-label>
  <aux-state %bind={{ this.triggeredBindings }}></aux-state>
</div>

<div %if={{ this.implementsThreshold }} class=threshold>
  <aux-valueknob #thres
    class=small
    label="Threshold"
    knob.show_hand=false
    %bind={{ this.thresholdBindings }}
    knob.preset=small
    scale="decibel"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.thresholdClicked }}></aux-button>
</div>
<div %if={{ this.implementsSlope }} class=slope>
  <aux-valueknob #slope
    class=small
    label="Slope"
    value.format='sprintf:%.2f'
    knob.show_hand=false
    %bind={{ this.slopeBindings }}
    knob.preset=small
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.slopeClicked }}></aux-button>
</div>
<div %if={{ this.implementsRatio }} class=slope>
  <aux-valueknob #ratio
    class=small
    label="Ratio"
    knob.show_hand=false
    %bind={{ this.ratioBindings }}
    knob.preset=small
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.slopeClicked }}></aux-button>
</div>
<div %if={{ this.implementsKneeParameter }} class=knee>
  <aux-valueknob #knee
    class=small
    label="Knee"
    knob.show_hand=false
    %bind={{ this.kneeBindings }}
    knob.preset=small
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.kneeClicked }}></aux-button>
</div>
<div %if={{ this.implementsDynamicGainCeiling }} class=gainceiling>
  <aux-valueknob #gainceiling
    class=small
    label="Gain Ceiling"
    knob.show_hand=false
    %bind={{ this.gainceilingBindings }}
    knob.preset=small
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.gainceilingClicked }}></aux-button>
</div>
<div %if={{ this.implementsDynamicGainFloor }} class=gainfloor>
  <aux-valueknob #gainfloor
    class=small
    label="Gain Floor"
    knob.show_hand=false
    %bind={{ this.gainfloorBindings }}
    knob.preset=small
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.gainfloorClicked }}></aux-button>
</div>

<aux-select %if={{ this.implementsFunction}}
  class=function
  entries="js:['None','Comp','Limit','Expand','Gate']"
  auto_size=true
  %bind={{ this.functionBindings }}
  >
</aux-select>
<aux-select %if={{ this.implementsDetectorLaw }}
  class=detect
  entries="js:['None','RMS','Peak']"
  auto_size=true
  %bind={{ this.detectBindings }}
  >
</aux-select>
`;


class OcaDynamicsControl extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return makeImplementedBindings([
      'AttackTime',
      'ReleaseTime',
      'HoldTime',
      'Threshold',
      'Slope',
      'Ratio',
      'KneeParameter',
      'DynamicGainCeiling',
      'DynamicGainFloor',
      'DetectorLaw',
      'Function',
      'DynamicGain',
      'Triggered',
    ]);
  }
  
  constructor() {
    super();
    
    this.threshold = 0;
    this.reference = 0;
    
    this.knobPresets = DynamicValue.fromConstant(AES70.knobPresets);
    this.formatValueBinding = DynamicValue.fromConstant(limitValueDigits(4));
    
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      },
    ];
    this.gainBindings = [
      {
        src: '/DynamicGain',
        name: 'value',
      },
    ];
    this.triggeredBindings = [
      {
        src: '/Triggered',
        name: 'state',
      },
    ];
    this.attackBindings = [
      ...makeValueMinMaxBinding('AttackTime'),
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
        readonly: true,
      },
      {
        name: 'value.format',
        backendValue: this.formatValueBinding,
        readonly: true,
      },
      {
        src: ['/AttackTime/Min', '/AttackTime/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%.2f', min)}, {pos:max, label:sprintf('%.2f', max)}];
        }
      },
    ];
    this.releaseBindings = [
      ...makeValueMinMaxBinding('ReleaseTime'),
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
        src: ['/ReleaseTime/Min', '/ReleaseTime/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%.2f', min)}, {pos:max, label:sprintf('%.2f', max)}];
        }
      },
    ];
    this.holdBindings = [
      ...makeValueMinMaxBinding('HoldTime'),
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
        src: ['/HoldTime/Min', '/HoldTime/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%.2f', min)}, {pos:max, label:sprintf('%.2f', max)}];
        }
      },
    ];
    this.thresholdBindings = [
      ...makeValueMinMaxBinding(
        'Threshold',
        v => v.Value,
        v => ({ Value:v, Ref:0 })
      ),
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
        src: ['/Threshold/Min', '/Threshold/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      },
      {
        src: '/Threshold/Max',
        name: 'base',
        readonly: true,
      },
    ];
    this.slopeBindings = [
      ...makeValueMinMaxBinding('Slope'),
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
        src: ['/Slope/Min', '/Slope/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d:1', min)}, {pos:max, label:sprintf('%d:1', max)}];
        }
      },
    ];
    this.kneeBindings = [
      ...makeValueMinMaxBinding('KneeParameter'),
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
        src: ['/KneeParameter/Min', '/KneeParameter/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      },
    ];
    this.gainceilingBindings = [
      ...makeValueMinMaxBinding('DynamicGainCeiling'),
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
        readonly: true,
      },
      {
        src: ['/DynamicGainCeiling/Min', '/DynamicGainCeiling/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      },
      {
        src: '/DynamicGainCeiling/Max',
        name: 'base',
        readonly: true,
      },
      {
        name: 'value.format',
        readonly: true,
        backendValue: this.formatValueBinding,
      },
    ];
    this.gainfloorBindings = [
      ...makeValueMinMaxBinding('DynamicGainFloor'),
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
        src: ['/DynamicGainFloor/Min', '/DynamicGainFloor/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      },
      {
        src: '/DynamicGainFloor/Min',
        name: 'base',
        readonly: true,
      },
    ];
    this.detectBindings = [
      {
        src: '/DetectorLaw',
        name: 'selected',
        transformReceive: v => v.value,
      }
    ];
    this.functionBindings = [
      {
        src: '/Function',
        name: 'selected',
        transformReceive: v => v.value,
      }
    ];
    this.dynamicsBindings = [
      {
        src: '/Threshold',
        name: 'threshold',
        transformReceive: v => {
          this.reference = v.Ref;
          return v.Value
        },
        transformSend: v => {
          return { Value: v, Ref: this.reference }
        },
      },
      {
        src: '/Threshold',
        name: 'reference',
        transformReceive: v => {
          this.threshold = v.Value;
          return v.Ref
        },
        readonly: true,
      },
      {
        src: '/Slope',
        name: 'ratio',
      },
      {
        src: '/Ratio',
        name: 'ratio',
      },
      {
        src: '/KneeParameter',
        name: 'knee',
        readonly: true,
      },
      {
        src: '/Function',
        name: 'type',
        readonly: true,
        transformReceive: v => ['compressor', 'compressor', 'limiter', 'expander', 'gate'][v.value],
      },
      {
        src: ['/Slope/Min', '/Slope/Max'],
        name: 'range_z',
        readonly: true,
        transformReceive: v => ({
          min:v[0], max: v[1], reverse: false, snap: 0.01,
        }),
      },
      {
        src: ['/Ratio/Min', '/Ratio/Max'],
        name: 'range_z',
        readonly: true,
        transformReceive: v => ({
          min:v[0], max: v[1], reverse: false, snap: 0.01,
        }),
      },
      {
        src: '/Function',
        name: 'disabled',
        readonly: true,
        transformReceive: v => !v.value,
      },
    ];
    this.attackClicked = (e) => {
      this.attack.auxWidget.value._input.focus();
    }
    this.releaseClicked = (e) => {
      this.release.auxWidget.value._input.focus();
    }
    this.holdClicked = (e) => {
      this.hold.auxWidget.value._input.focus();
    }
    this.thresholdClicked = (e) => {
      this.thres.auxWidget.value._input.focus();
    }
    this.slopeClicked = (e) => {
      this.slope.auxWidget.value._input.focus();
    }
    this.kneeClicked = (e) => {
      this.knee.auxWidget.value._input.focus();
    }
    this.gainceilingClicked = (e) => {
      this.gainceiling.auxWidget.value._input.focus();
    }
    this.gainfloorClicked = (e) => {
      this.gainfloor.auxWidget.value._input.focus();
    }
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaDynamics, o);
  }
}

registerTemplateControl(OcaDynamicsControl, 'dynamics');
