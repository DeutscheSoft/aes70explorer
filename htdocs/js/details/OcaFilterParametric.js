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

  <span class="label">Gain Min</span>
  <aux-label %bind={{ this.GainMinBind }}></aux-label>

  <span class="label">Gain Max</span>
  <aux-label %bind={{ this.GainMaxBind }}></aux-label>

  <span class="label">Gain</span>
  <aux-label %bind={{ this.GainBind }}></aux-label>
</div>
<div class="grid">
  <span class="label">Width Min</span>
  <aux-label %bind={{ this.WidthMinBind }}></aux-label>

  <span class="label">Width Max</span>
  <aux-label %bind={{ this.WidthMaxBind }}></aux-label>

  <span class="label">Width</span>
  <aux-label %bind={{ this.WidthBind }}></aux-label>
  
  <span class="label">ShapeParameter Min</span>
  <aux-label %bind={{ this.ShapeParameterMinBind }}></aux-label>

  <span class="label">ShapeParameter Max</span>
  <aux-label %bind={{ this.ShapeParameterMaxBind }}></aux-label>

  <span class="label">ShapeParameter</span>
  <aux-label %bind={{ this.ShapeParameterBind }}></aux-label>
  
  <span class="label">Shape</span>
  <aux-label %bind={{ this.ShapeBind }}></aux-label>
</div>
`;

class OcaFilterParametricDetails extends TemplateComponent.fromString(template) {
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
    this.FrequencyBind = [{ src: '/Frequency', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'Hz' }];
    this.FrequencyMinBind = [{ src: '/Frequency/Min', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'Hz' }];
    this.FrequencyMaxBind = [{ src: '/Frequency/Max', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'Hz' }];
    this.GainBind = [{ src: '/InbandGain', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'dB' }];
    this.GainMinBind = [{ src: '/InbandGain/Min', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'dB' }];
    this.GainMaxBind = [{ src: '/InbandGain/Max', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) + 'dB' }];
    this.WidthBind = [{ src: '/WidthParameter', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) }];
    this.WidthMinBind = [{ src: '/WidthParameter/Min', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) }];
    this.WidthMaxBind = [{ src: '/WidthParameter/Max', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) }];
    this.ShapeParameterBind = [{ src: '/ShapeParameter', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) }];
    this.ShapeParameterMinBind = [{ src: '/ShapeParameter/Min', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) }];
    this.ShapeParameterMaxBind = [{ src: '/ShapeParameter/Max', name: 'label', readonly: true,
      transformReceive: v => v.toFixed(3) }];
    this.ShapeBind = [{ src: '/Shape', name: 'label', readonly: true,
      transformReceive: v => v.name }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaFilterParametric, o);
  }
}

registerTemplateDetails(OcaFilterParametricDetails, 'filterparametric');
