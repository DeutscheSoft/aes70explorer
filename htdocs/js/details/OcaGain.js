import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateDetails } from '../template_components.js';

const template = `
<span class="label">Label</span>
<aux-value preset=string %bind={{ this.LabelBind }}></aux-value>

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

<span class="label">Gain</span>
<aux-label %bind={{ this.SettingBind }}></aux-label>
`;

class OcaGainDetails extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    
    this.LabelBind = [{ src: '/Label', name: 'value' }];
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label' }];
    this.LockableBind = [{ src: '/Lockable', name: 'label' }];
    this.EnabledBind = [{ src: '/Enabled', name: 'state' }];
    this.SettingBind = [{ src: '/Gain', name: 'label' }];
    this.MinBind = [{ src: '/Gain/Min', name: 'label' }];
    this.MaxBind = [{ src: '/Gain/Max', name: 'label' }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaGain, o);
  }
}

registerTemplateDetails(OcaGainDetails);
