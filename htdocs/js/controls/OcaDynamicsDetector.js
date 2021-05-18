import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';
import { makeValueMinMaxBinding, makeImplementedBindings, limitValueDigits } from '../utils.js';

const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label>

<div %if={{ this.implementsAttackTime }} class=attack>
  <aux-valueknob #attack
    label="Attack"
    knob.show_hand=false
    %bind={{ this.attackBindings }}
    knob.preset=medium
    scale="decibel"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.attackClicked }}></aux-button>
</div>
<div %if={{ this.implementsReleaseTime }} class=release>
  <aux-valueknob #release
    label="Release"
    knob.show_hand=false
    %bind={{ this.releaseBindings }}
    knob.preset=medium
    scale="decibel"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.releaseClicked }}></aux-button>
</div>
<div %if={{ this.implementsHoldTime }} class=hold>
  <aux-valueknob #hold
    label="Hold"
    knob.show_hand=false
    %bind={{ this.holdBindings }}
    knob.preset=medium
    scale="decibel"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.holdClicked }}></aux-button>
</div>

<aux-select %if={{ this.implementsLaw }}
  class=law
  entries="js:['None','RMS','Peak']"
  auto_size=true
  %bind={{ this.detectBindings }}
  >
</aux-select>
`;


class OcaDynamicsDetectorControl extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return makeImplementedBindings([
      'AttackTime',
      'ReleaseTime',
      'HoldTime',
      'Law',
    ]);
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
    this.attackBindings = [
      ...makeValueMinMaxBinding('AttackTime'),
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        name: 'value.format',
        backendValue: this.formatValueBinding,
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
        name: 'value.format',
        backendValue: this.formatValueBinding,
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
        name: 'value.format',
        backendValue: this.formatValueBinding,
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
    this.detectBindings = [
      {
        src: '/Law',
        name: 'selected',
        transformReceive: v => v.value,
      }
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
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaDynamicsDetector, o);
  }
}

registerTemplateControl(OcaDynamicsDetectorControl, 'dynamicsdetector');
