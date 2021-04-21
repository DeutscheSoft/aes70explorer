import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateDetails } from '../template_components.js';

const template = `
<div class="grid">
  <div %if={{ this.implementsLabel }}>
    <span class="label">Label</span>
    <aux-value preset=string %bind={{ this.LabelBind }}></aux-value>
  </div>
  
  <span class="label">Enabled</span>
  <aux-toggle icon=power %bind={{ this.EnabledBind }}></aux-toggle>
  
  <span class="label">ClassVersion</span>
  <aux-label %bind={{ this.ClassVersionBind }}></aux-label>
  
  <span class="label">Lockable</span>
  <aux-label %bind={{ this.LockableBind }}></aux-label>
  
  <span class="label">Min</span>
  <aux-label %bind={{ this.MinBind }}></aux-label>
  
  <span class="label">Max</span>
  <aux-label %bind={{ this.MaxBind }}></aux-label>
  
  <span class="label">Position</span>
  <aux-label %bind={{ this.PositionBind }}></aux-label>
</div>
<div class="grid">
  <span class="label">MidpointGain Min</span>
  <aux-label %bind={{ this.MidMinBind }}></aux-label>
  
  <span class="label">MidpointGain Max</span>
  <aux-label %bind={{ this.MidMaxBind }}></aux-label>
  
  <span class="label">MidpointGain</span>
  <aux-label %bind={{ this.MidBind }}></aux-label>
</div>
`;

class OcaPanBalanceDetails extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return [
      {
        name: 'implementsLabel',
        src: '/Label/Implemented',
        readonly: true,
        sync: true,
      },
    ];
  }

  constructor() {
    super();
    this.LabelBind = [{ src: '/Label', name: 'value' }];
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label' }];
    this.LockableBind = [{ src: '/Lockable', name: 'label' }];
    this.EnabledBind = [{ src: '/Enabled', name: 'state' }];
    this.PositionBind = [{ src: '/Position', name: 'label',
      transformReceive: v => v.toFixed(3) }];
    this.MinBind = [{ src: '/Position/Min', name: 'label',
      transformReceive: v => v.toFixed(3) }];
    this.MaxBind = [{ src: '/Position/Max', name: 'label',
      transformReceive: v => v.toFixed(3) }];
    this.MidBind = [{ src: '/MidpointGain', name: 'label',
      transformReceive: v => v.toFixed(2) + 'dB'}];
    this.MidMinBind = [{ src: '/MidpointGain/Min', name: 'label',
      transformReceive: v => v.toFixed(2) + 'dB'}];
    this.MidMaxBind = [{ src: '/MidpointGain/Max', name: 'label',
      transformReceive: v => v.toFixed(2) + 'dB'}];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaPanBalance, o);
  }
}

registerTemplateDetails(OcaPanBalanceDetails);
