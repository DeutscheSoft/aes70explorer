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
  
  <span class="label">Coefficients</span>
  <aux-marquee %bind={{ this.CoefficientsBind }}></aux-marquee>
  
  <span class="label">Length</span>
  <aux-marquee %bind={{ this.LengthBind }}></aux-marquee>
  
  <span class="label">Min Sample Rate</span>
  <aux-label %bind={{ this.SampleRateMinBind }}></aux-label>

  <span class="label">Max Sample Rate</span>
  <aux-label %bind={{ this.SampleRateMaxBind }}></aux-label>
  
  <span class="label">Sample Rate</span>
  <aux-label %bind={{ this.SampleRateBind }}></aux-label>
</div>
`;

class OcaFilterFIRDetails extends TemplateComponent.fromString(template) {
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
    this.CoefficientsBind = [{ src: '/Coefficients', name: 'label', readonly: true,
      transformReceive: v => v.map(i => i.toExponential(2)).join(',') }];
    this.LengthBind = [{ src: '/Length', name: 'label', readonly: true }];
    this.SampleRateBind = [{ src: '/SampleRate', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(0) }];
    this.SampleRateMinBind = [{ src: '/SampleRate/Min', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(0) }];
    this.SampleRateMaxBind = [{ src: '/SampleRate/Max', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(0) }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaFilterFIR, o);
  }
}

registerObjectDetailTemplate(OcaFilterFIRDetails, 'filterfir');
