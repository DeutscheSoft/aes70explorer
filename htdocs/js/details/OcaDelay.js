import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateDetails } from '../template_components.js';

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

  <span class="label">Min</span>
  <aux-label %bind={{ this.MinBind }}></aux-label>

  <span class="label">Max</span>
  <aux-label %bind={{ this.MaxBind }}></aux-label>

  <span class="label">DelayTime</span>
  <aux-label %bind={{ this.DelayTimeBind }}></aux-label>
</div>
`;

class OcaDelayDetails extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return [
      {name: 'implementsLabel', src: '/Label/Implemented', readonly: true, sync: true},
    ];
  }

  constructor() {
    super();

    this.LabelBind = [{ src: '/Label', name: 'value' }];
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label' }];
    this.LockableBind = [{ src: '/Lockable', name: 'label' }];
    this.EnabledBind = [{ src: '/Enabled', name: 'state' }];
    this.DelayTimeBind = [{ src: '/DelayTime', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 's' }];
    this.MinBind = [{ src: '/DelayTime/Min', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 's' }];
    this.MaxBind = [{ src: '/DelayTime/Max', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 's' }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaDelay, o);
  }
}

registerTemplateDetails(OcaDelayDetails, 'delay');
