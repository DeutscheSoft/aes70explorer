import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { registerTemplateDetails } from '../template_components.js';

const template = `
<span class="label">ClassVersion</span>
<aux-label %bind={{ this.ClassVersionBind }}></aux-label>

<span class="label">Lockable</span>
<aux-label %bind={{ this.LockableBind }}></aux-label>

<span class="label">Enabled</span>
<aux-label %bind={{ this.EnabledBind }}></aux-label>

<span class="label">State</span>
<aux-label %bind={{ this.StateBind }}></aux-label>
`;

class OcaBooleanExtendedActuatorDetails extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label' }];
    this.LockableBind = [{ src: '/Lockable', name: 'label' }];
    this.EnabledBind = [{ src: '/Enabled', name: 'label' }];
    this.StateBind = [{ src: '/State', name: 'label' }];
  }
  static match(o) {
    return o.ClassName == 'OcaMute' || o.ClassName == 'OcaPolarity';
  }
}

registerTemplateDetails(OcaBooleanExtendedActuatorDetails);
