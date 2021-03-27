import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { registerTemplateDetails } from '../template_components.js';

const template = `
<span class="label">ClassVersion</span>
<aux-label %bind={{ this.ClassVersionBind }}></aux-label>

<span class="label">Lockable</span>
<aux-label %bind={{ this.LockableBind }}></aux-label>

<span class="label">Enabled</span>
<aux-label %bind={{ this.EnabledBind }}></aux-label>

<span class="label">Gain</span>
<aux-label %bind={{ this.SettingBind }}></aux-label>

<span class="label">Min</span>
<aux-label %bind={{ this.MinBind }}></aux-label>

<span class="label">Max</span>
<aux-label %bind={{ this.MaxBind }}></aux-label>
`;

class OcaGainDetails extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label' }];
    this.LockableBind = [{ src: '/Lockable', name: 'label' }];
    this.EnabledBind = [{ src: '/Enabled', name: 'label' }];
    this.SettingBind = [{ src: '/Gain', name: 'label' }];
    this.MinBind = [{ src: '/Gain/Min', name: 'label' }];
    this.MaxBind = [{ src: '/Gain/Max', name: 'label' }];
  }
  static match(o) {
    return o.ClassName === 'OcaGain';
  }
}

registerTemplateDetails(OcaGainDetails);
