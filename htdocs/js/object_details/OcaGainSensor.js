import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectDetailTemplate } from '../object_details.js';

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

  <span class="label">Min Reading</span>
  <aux-label %bind={{ this.MinBind }}></aux-label>

  <span class="label">Max Reading</span>
  <aux-label %bind={{ this.MaxBind }}></aux-label>
  
  <span class="label">Reading</span>
  <aux-label %bind={{ this.ReadingBind }}></aux-label>
</div>
`;

class OcaGainSensorDetails extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return [
      {name: 'implementsLabel', src: '/Label/Implemented', readonly: true, sync: true},
    ];
  }

  constructor() {
    super();

    this.LabelBind = [{ src: '/Label', name: 'value', readonly: true }];
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label', readonly: true }];
    this.LockableBind = [{ src: '/Lockable', name: 'label', readonly: true }];
    this.EnabledBind = [{ src: '/Enabled', name: 'state', readonly: true }];
    this.ReadingBind = [{ src: '/Reading', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'dB' }];
    this.MinBind = [{ src: '/Reading/Min', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'dB' }];
    this.MaxBind = [{ src: '/Reading/Max', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'dB' }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaGainSensor, o);
  }
}

registerObjectDetailTemplate(OcaGainSensorDetails, 'gainsensor');
