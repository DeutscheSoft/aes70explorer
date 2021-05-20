import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateDetails } from '../template_components.js';
import { makeImplementedBindings } from '../utils.js';

const template = `
<div class="grid">
  <span %if={{ this.implementsLabel }} class="label">Label</span>
  <aux-value %if={{ this.implementsLabel }} preset=string %bind={{ this.LabelBind }}></aux-value>

  <span class="label">Enabled</span>
  <aux-toggle icon=enabled %bind={{ this.EnabledBind }}></aux-toggle>

  <span class="label">ClassVersion</span>
  <aux-label %bind={{ this.ClassVersionBind }}></aux-label>

  <span class="label">Lockable</span>
  <aux-label %bind={{ this.LockableBind }}></aux-label>
  
  <span class="label">Level Min</span>
  <aux-label %bind={{ this.LevelMinBind }}></aux-label>

  <span class="label">Level Max</span>
  <aux-label %bind={{ this.LevelMaxBind }}></aux-label>

  <span class="label">Level</span>
  <aux-label %bind={{ this.LevelBind }}></aux-label>
  
  <span class="label">Waveform</span>
  <aux-label %bind={{ this.WaveformBind }}></aux-label>
  
  <span class="label">Generating</span>
  <aux-label %bind={{ this.GeneratingBind }}></aux-label>
</div>
<div class="grid">
  <span class="label">Frequency 1 Min</span>
  <aux-label %bind={{ this.Frequency1MinBind }}></aux-label>

  <span class="label">Frequency 1 Max</span>
  <aux-label %bind={{ this.Frequency1MaxBind }}></aux-label>

  <span class="label">Frequency 1</span>
  <aux-label %bind={{ this.Frequency1Bind }}></aux-label>
  
  <span class="label">Frequency 2 Min</span>
  <aux-label %bind={{ this.Frequency2MinBind }}></aux-label>

  <span class="label">Frequency 2 Max</span>
  <aux-label %bind={{ this.Frequency2MaxBind }}></aux-label>

  <span class="label">Frequency 2</span>
  <aux-label %bind={{ this.Frequency2Bind }}></aux-label>
  
  <span class="label">Sweep Time Min</span>
  <aux-label %bind={{ this.SweepTimeMinBind }}></aux-label>

  <span class="label">Sweep Time Max</span>
  <aux-label %bind={{ this.SweepTimeMaxBind }}></aux-label>

  <span class="label">Sweep Time</span>
  <aux-label %bind={{ this.SweepTimeBind }}></aux-label>
  
  <span class="label">Sweep Type</span>
  <aux-label %bind={{ this.SweepTypeBind }}></aux-label>
  
  <span class="label">Sweep Repeat</span>
  <aux-label %bind={{ this.SweepRepeatBind }}></aux-label>
</div>
`;

class OcaSignalGeneratorDetails extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return makeImplementedBindings([
      'Label',
    ]);
  }
  
  constructor() {
    super();

    this.LabelBind = [{ src: '/Label', name: 'value' }];
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label' }];
    this.LockableBind = [{ src: '/Lockable', name: 'label' }];
    this.EnabledBind = [{ src: '/Enabled', name: 'state' }];
    
    this.Frequency1Bind = [{ src: '/Frequency1', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'Hz' }];
    this.Frequency1MinBind = [{ src: '/Frequency1/Min', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'Hz' }];
    this.Frequency1MaxBind = [{ src: '/Frequency1/Max', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'Hz' }];
    
    this.Frequency2Bind = [{ src: '/Frequency2', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'Hz' }];
    this.Frequency2MinBind = [{ src: '/Frequency2/Min', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'Hz' }];
    this.Frequency2MaxBind = [{ src: '/Frequency2/Max', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'Hz' }];
    
    this.LevelBind = [{ src: '/Level', name: 'label',
      transformReceive: v => v.toFixed(3) + 'dB' }];
    this.LevelMinBind = [{ src: '/Level/Min', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'dB' }];
    this.LevelMaxBind = [{ src: '/Level/Max', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'dB' }];
      
    this.SweepTimeBind = [{ src: '/SweepTime', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 's' }];
    this.SweepTimeMinBind = [{ src: '/SweepTime/Min', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 's' }];
    this.SweepTimeMaxBind = [{ src: '/SweepTime/Max', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 's' }];
      
    this.SweepTypeBind = [{ src: '/SweepType', name: 'label', readonly: true,
      transformReceive: v => v.name }];
    this.SweepRepeatBind = [{ src: '/SweepRepeat', name: 'label', readonly: true, }];
    this.WaveformBind = [{ src: '/Waveform', name: 'label', readonly: true,
      transformReceive: v => v.name }];
    this.GeneratingBind = [{ src: '/Generating', name: 'label', readonly: true, }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaSignalGenerator, o);
  }
}

registerTemplateDetails(OcaSignalGeneratorDetails, 'signalgenerator');
