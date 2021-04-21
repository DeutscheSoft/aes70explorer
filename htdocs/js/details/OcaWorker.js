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
</div>
`;

class OcaWorkerDetails extends TemplateComponent.fromString(template) {
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
    
    this.LabelBind = [{ src: '/Label', name: 'value', readonly: true }];
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label', readonly: true }];
    this.LockableBind = [{ src: '/Lockable', name: 'label', readonly: true }];
    this.EnabledBind = [{ src: '/Enabled', name: 'state', readonly: true }];
    this.SettingBind = [{ src: '/Setting', name: 'label', readonly: true }];
    this.MinBind = [{ src: '/Setting/Min', name: 'label', readonly: true }];
    this.MaxBind = [{ src: '/Setting/Max', name: 'label', readonly: true }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaWorker, o);
  }
}

registerTemplateDetails(OcaWorkerDetails);
