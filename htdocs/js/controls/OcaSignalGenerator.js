import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';
import { makeValueMinMaxBinding, makeImplementedBindings, limitValueDigits } from '../utils.js';

const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label>

<div %if={{ this.implementsFrequency1 }} class=freq1>
  <aux-valueknob #freq1
    class=small
    label="Frequency 1"
    knob.show_hand=false
    %bind={{ this.frequency1Bindings }}
    knob.preset=small
    scale="frequency"
    min="1"
    max="20000"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.frequency1Clicked }}></aux-button>
</div>

<div %if={{ this.implementsFrequency2 }} class=freq2>
  <aux-valueknob #freq2
    class=small
    label="Frequency 2"
    knob.show_hand=false
    %bind={{ this.frequency2Bindings }}
    knob.preset=small
    scale="frequency"
    min="1"
    max="20000"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.frequency2Clicked }}></aux-button>
</div>


<div %if={{ this.implementsLevel }} class=level>
  <aux-valueknob #level
    label="Level"
    knob.show_hand=false
    %bind={{ this.levelBindings }}
    knob.preset=medium
    scale="decibel"
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.levelClicked }}></aux-button>
</div>

<div %if={{ this.implementsSweepTime }} class=sweeptime>
  <aux-valueknob #sweeptime
    class=small
    label="Sweep Time"
    knob.show_hand=false
    %bind={{ this.sweeptimeBindings }}
    knob.preset=small
    >
  </aux-valueknob>
  <aux-button class=edit icon=edit (click)={{ this.sweeptimeClicked }}></aux-button>
</div>

<div class=sweeptype>
  <aux-label label="Sweep Type"></aux-label>
  <aux-select %if={{ this.implementsSweepType }}
    class=sweeptype
    entries="js:['None','Lin','Log']"
    auto_size=true
    %bind={{ this.sweeptypeBindings }}
    >
  </aux-select>
</div>

<aux-buttons %if={{ this.implementsWaveform }}
  class=waveform
  %bind={{ this.waveformBindings }}
  buttons="js:[{icon:'enabled'},{icon:'dc'},{icon:'sine'},{icon:'square'},{icon:'impulse'},{icon:'pinknoise'},{icon:'whitenoise'},{icon:'polaritytest'}]"
></aux-buttons>

<aux-toggle #repeat %bind={{ this.sweeprepeatBindings }} %if={{ this.implementsSweepRepeat }}
  class=sweeprepeat
  label="SwRepeat"
  >
</aux-toggle>

<div class=generating %if={{ this.implementsGenerating }}>
  <aux-label label="Generating"></aux-label>
  <aux-state %bind={{ this.generatingBindings}}></aux-state>
</div>
`;


class OcaSignalGeneratorControl extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return makeImplementedBindings([
      'Frequency1',
      'Frequency2',
      'Level',
      'SweepTime',
      'SweepType',
      'SweepRepeat',
      'Waveform',
      'Generating',
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
    this.frequency1Bindings = [
      ...makeValueMinMaxBinding('Frequency1'),
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        name: 'value.format',
        backendValue: this.formatValueBinding,
      },
      {
        src: ['/Frequency1/Min', '/Frequency1/Max'],
        name: 'labels',
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      },
    ];
    this.frequency2Bindings = [
      ...makeValueMinMaxBinding('Frequency2'),
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        name: 'value.format',
        backendValue: this.formatValueBinding,
      },
      {
        src: ['/Frequency2/Min', '/Frequency2/Max'],
        name: 'labels',
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      },
    ];
    this.levelBindings = [
      ...makeValueMinMaxBinding('Level'),
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        name: 'value.format',
        backendValue: this.formatValueBinding,
      },
      {
        name: 'base',
        src: '/Level/Min',
      },
      {
        src: ['/Level/Min', '/Level/Max'],
        name: 'labels',
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%d', min)}, {pos:max, label:sprintf('%d', max)}];
        }
      },
    ];
    this.sweeptimeBindings = [
      ...makeValueMinMaxBinding('SweepTime'),
      {
        backendValue: this.knobPresets,
        name: 'knob.presets',
      },
      {
        name: 'value.format',
        backendValue: this.formatValueBinding,
      },
      {
        src: ['/SweepTime/Min', '/SweepTime/Max'],
        name: 'labels',
        transformReceive: function (arr) {
          const [min, max] = arr;
          return [{pos:min, label:sprintf('%.1f', min)}, {pos:max, label:sprintf('%.1f', max)}];
        }
      },
    ];
    this.sweeptypeBindings = [
      {
        src: '/SweepType',
        name: 'selected',
        transformReceive: v => v.value,
      }
    ];
    this.waveformBindings = [
      {
        src: '/Waveform',
        name: 'select',
        transformReceive: v => v.value,
      }
    ];
    this.sweeprepeatBindings = [
      {
        src: '/SweepRepeat',
        name: 'state',
      }
    ];
    this.generatingBindings = [
      {
        src: '/Generating',
        name: 'state',
      }
    ];
    this.frequency1Clicked = (e) => {
      this.freq1.auxWidget.value._input.focus();
    }
    this.frequency2Clicked = (e) => {
      this.freq2.auxWidget.value._input.focus();
    }
    this.levelClicked = (e) => {
      this.level.auxWidget.value._input.focus();
    }
    this.sweeptimeClicked = (e) => {
      this.sweeptime.auxWidget.value._input.focus();
    }
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaSignalGenerator, o);
  }
}

registerTemplateControl(OcaSignalGeneratorControl, 'signalgenerator');
