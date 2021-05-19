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

  <span class="label">Temperature</span>
  <aux-label %bind={{ this.TemperatureBind }}></aux-label>
</div>
`;

class OcaTemperatureActuatorDetails extends TemplateComponent.fromString(template) {
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
    this.TemperatureBind = [{ src: '/Temperature', name: 'label',
      transformReceive: v => v.toFixed(3) }];
    this.MinBind = [{ src: '/Temperature/Min', name: 'label',
      transformReceive: v => v.toFixed(3) }];
    this.MaxBind = [{ src: '/Temperature/Max', name: 'label',
      transformReceive: v => v.toFixed(3) }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaTemperatureActuator, o);
  }
}

registerTemplateDetails(OcaTemperatureActuatorDetails, 'temperatureactuator');
