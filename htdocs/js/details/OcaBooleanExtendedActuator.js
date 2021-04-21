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
  
  <span class="label">State</span>
  <aux-label %bind={{ this.StateBind }}></aux-label>
</div>
`;

class OcaBooleanExtendedActuatorDetails extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    
    this.LabelBind = [{ src: '/Label', name: 'value' }];
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label' }];
    this.LockableBind = [{ src: '/Lockable', name: 'label' }];
    this.EnabledBind = [{ src: '/Enabled', name: 'state' }];
    this.StateBind = [{ src: '/State', name: 'label' }];
  }
  static match(o) {
    return Math.max(matchClass(OCA.RemoteControlClasses.OcaMute, o),
                    matchClass(OCA.RemoteControlClasses.OcaPolarity, o));
  }
}

registerTemplateDetails(OcaBooleanExtendedActuatorDetails);
