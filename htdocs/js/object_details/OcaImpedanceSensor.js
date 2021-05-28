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
  
  <span class="label">Min Magnitude</span>
  <aux-label %bind={{ this.MinMagnitudeBind }}></aux-label>

  <span class="label">Max Magnitude</span>
  <aux-label %bind={{ this.MaxMagnitudeBind }}></aux-label>
  
  <span class="label">Magnitude</span>
  <aux-label %bind={{ this.MagnitudeBind }}></aux-label>
  
  <span class="label">Min Phase</span>
  <aux-label %bind={{ this.MinPhaseBind }}></aux-label>

  <span class="label">Max Reading</span>
  <aux-label %bind={{ this.MaxPhaseBind }}></aux-label>
  
  <span class="label">Reading</span>
  <aux-label %bind={{ this.PhaseBind }}></aux-label>
</div>
`;

class OcaImpedanceSensorDetails extends TemplateComponent.fromString(template) {
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
    this.MagnitudeBind = [{ src: '/Reading', name: 'label', readonly: true,
      transformReceive: v => v.Magnitude.toFixed(3) + 'Ω' }];
    this.MinMagnitudeBind = [{ src: '/Reading/Min', name: 'label', readonly: true,
      transformReceive: v => v.Magnitude.toFixed(3) + 'Ω' }];
    this.MaxMagnitudeBind = [{ src: '/Reading/Max', name: 'label', readonly: true,
      transformReceive: v => v.Magnitude.toFixed(3) + 'Ω' }];
    this.PhaseBind = [{ src: '/Reading', name: 'label', readonly: true,
      transformReceive: v => v.Phase.toFixed(3) + 'rad / ' + (v.Phase * (180/Math.PI)).toFixed(3) + '°' }];
    this.MinPhaseBind = [{ src: '/Reading/Min', name: 'label', readonly: true,
      transformReceive: v => v.Phase.toFixed(3) + 'rad / ' + (v.Phase * (180/Math.PI)).toFixed(3) + '°' }];
    this.MaxPhaseBind = [{ src: '/Reading/Max', name: 'label', readonly: true,
      transformReceive: v => v.Phase.toFixed(3) + 'rad / ' + (v.Phase * (180/Math.PI)).toFixed(3) + '°'}];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaImpedanceSensor, o);
  }
}

registerTemplateDetails(OcaImpedanceSensorDetails, 'impedancesensor');
