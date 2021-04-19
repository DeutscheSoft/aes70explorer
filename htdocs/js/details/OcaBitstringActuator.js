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

<span class="label">Bitstring</span>
<aux-label %bind={{ this.BitstringBind }}></aux-label>
`;

class OcaBitstringActuatorDetails extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    
    this.LabelBind = [{ src: '/Label', name: 'value' }];
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label' }];
    this.LockableBind = [{ src: '/Lockable', name: 'label' }];
    this.EnabledBind = [{ src: '/Enabled', name: 'state' }];
    this.BitstringBind = [{ src: '/Bitstring', name: 'label' }];
  }

  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaBitstringActuator, o);
  }
}

registerTemplateDetails(OcaBitstringActuatorDetails);