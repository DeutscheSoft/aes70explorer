import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';
import { makeValueMinMaxBinding } from '../utils.js';

const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label>

<div %if={{ this.implementsAttack }} class=attack>
  <aux-valueknob #attack
    class=small
    label="Attack"
    value.format='sprintf:%.3f'
    knob.show_hand=false
    %bind={{ this.attackBindings }}
    knob.preset=small
    scale="decibel"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.attackClicked }}></aux-button>
</div>
<div %if={{ this.implementsRelease }} class=release>
  <aux-valueknob #release
    class=small
    label="Release"
    value.format='sprintf:%.3f'
    knob.show_hand=false
    %bind={{ this.releaseBindings }}
    knob.preset=small
    scale="decibel"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.releaseClicked }}></aux-button>
</div>
<div %if={{ this.implementsHold }} class=hold>
  <aux-valueknob #hold
    class=small
    label="Hold"
    value.format='sprintf:%.3f'
    knob.show_hand=false
    %bind={{ this.holdBindings }}
    knob.preset=small
    scale="decibel"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.holdClicked }}></aux-button>
</div>

<aux-dynamics
  >
</aux-dynamics>

<div %if={{ this.implementsThreshold }} class=threshold>
  <aux-valueknob #thres
    class=small
    label="Threshold"
    value.format='sprintf:%.2f'
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
<div %if={{ this.implementsKnee }} class=knee>
  <aux-valueknob #knee
    class=small
    label="Knee"
    value.format='sprintf:%.2f'
    knob.show_hand=false
    %bind={{ this.kneeBindings }}
    knob.preset=small
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.kneeClicked }}></aux-button>
</div>
`;


class OcaDynamicsControl extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return [
      {name: 'implementsAttack', src: '/AttackTime/Implemented', readonly: true, sync: true},
      {name: 'implementsRelease', src: '/ReleaseTime/Implemented', readonly: true, sync: true},
      {name: 'implementsHold', src: '/HoldTime/Implemented', readonly: true, sync: true},
      {name: 'implementsThreshold', src: '/Threshold/Implemented', readonly: true, sync: true},
      {name: 'implementsSlope', src: '/Slope/Implemented', readonly: true, sync: true},
      {name: 'implementsKnee', src: '/KneeParameter/Implemented', readonly: true, sync: true},
    ];
  }
  
  constructor() {
    super();
    this.knobPresets = DynamicValue.fromConstant(AES70.knobPresets);
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
      },
    ];
    this.attackBindings = [
      ...makeValueMinMaxBinding('AttackTime'),
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        src: ['/AttackTime/Min', '/AttackTime/Max'],
        name: 'labels',
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
      },
      {
        src: ['/ReleaseTime/Min', '/ReleaseTime/Max'],
        name: 'labels',
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
      },
      {
        src: ['/HoldTime/Min', '/HoldTime/Max'],
        name: 'labels',
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%.2f', min)}, {pos:max, label:sprintf('%.2f', max)}];
        }
      },
    ];
    this.thresholdBindings = [
      ...makeValueMinMaxBinding('Threshold', v => v.Value, v => ({ Value:v, Ref:0 }) ),
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        src: ['/Threshold/Min', '/Threshold/Max'],
        name: 'labels',
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      },
    ];
    this.slopeBindings = [
      ...makeValueMinMaxBinding('Slope'),
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        src: ['/Slope/Min', '/Slope/Max'],
        name: 'labels',
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
      },
      {
        src: ['/KneeParameter/Min', '/KneeParameter/Max'],
        name: 'labels',
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%.2f', min)}, {pos:max, label:sprintf('%.2f', max)}];
        }
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
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaDynamics, o);
  }
}

registerTemplateControl(OcaDynamicsControl, 'dynamics');
