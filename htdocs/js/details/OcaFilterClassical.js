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

  <span class="label">Frequency Min</span>
  <aux-label %bind={{ this.FrequencyMinBind }}></aux-label>

  <span class="label">Frequency Max</span>
  <aux-label %bind={{ this.FrequencyMaxBind }}></aux-label>

  <span class="label">Frequency</span>
  <aux-label %bind={{ this.FrequencyBind }}></aux-label>
</div>
<div class="grid">
  <span class="label">Parameter Min</span>
  <aux-label %bind={{ this.ParameterMinBind }}></aux-label>

  <span class="label">Parameter Max</span>
  <aux-label %bind={{ this.ParameterMaxBind }}></aux-label>

  <span class="label">Parameter</span>
  <aux-label %bind={{ this.ParameterBind }}></aux-label>
  
  <span class="label">Order Min</span>
  <aux-label %bind={{ this.OrderMinBind }}></aux-label>

  <span class="label">Order Max</span>
  <aux-label %bind={{ this.OrderMaxBind }}></aux-label>

  <span class="label">Order</span>
  <aux-label %bind={{ this.OrderBind }}></aux-label>
  
  <span class="label">Shape</span>
  <aux-label %bind={{ this.ShapeBind }}></aux-label>
  
  <span class="label">Passband</span>
  <aux-label %bind={{ this.PassbandBind }}></aux-label>
</div>
`;

class OcaFilterClassicalDetails extends TemplateComponent.fromString(template) {
  constructor() {
    super();

    this.LabelBind = [{ src: '/Label', name: 'value' }];
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label' }];
    this.LockableBind = [{ src: '/Lockable', name: 'label' }];
    this.EnabledBind = [{ src: '/Enabled', name: 'state' }];
    this.FrequencyBind = [{ src: '/Frequency', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'Hz' }];
    this.FrequencyMinBind = [{ src: '/Frequency/Min', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'Hz' }];
    this.FrequencyMaxBind = [{ src: '/Frequency/Max', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'Hz' }];
    this.ParameterBind = [{ src: '/Parameter', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) }];
    this.ParameterMinBind = [{ src: '/Parameter/Min', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) }];
    this.ParameterMaxBind = [{ src: '/Parameter/Max', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) }];
    this.OrderBind = [{ src: '/Order', name: 'label',
      transformReceive: v => v.toFixed(0) }];
    this.OrderMinBind = [{ src: '/Order/Min', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(0) }];
    this.OrderMaxBind = [{ src: '/Order/Max', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(0) }];
    this.ShapeBind = [{ src: '/Shape', name: 'label', readonly: true,
      transformReceive: v => v.name }];
    this.PassbandBind = [{ src: '/Passband', name: 'label', readonly: true,
      transformReceive: v => v.name }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaFilterClassical, o);
  }
}

registerTemplateDetails(OcaFilterClassicalDetails, 'filterclassical');
