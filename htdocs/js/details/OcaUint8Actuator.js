import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { registerTemplateDetails } from '../template_components.js';

const template = `
<span class="label">Role</span>
<aux-label %bind={{ this.RoleBind }}></aux-label>

<span class="label">ClassID</span>
<aux-label %bind={{ this.ClassIDBind }}></aux-label>

<span class="label">ClassVersion</span>
<aux-label %bind={{ this.ClassVersionBind }}></aux-label>

<span class="label">Lockable</span>
<aux-label %bind={{ this.LockableBind }}></aux-label>

<span class="label">Enabled</span>
<aux-label %bind={{ this.EnabledBind }}></aux-label>

<span class="label">Setting</span>
<aux-label %bind={{ this.SettingBind }}></aux-label>

<span class="label">Min</span>
<aux-label %bind={{ this.MinBind }}></aux-label>

<span class="label">Max</span>
<aux-label %bind={{ this.MaxBind }}></aux-label>

`;

class OcaUint8ActuatorDetails extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    
    this.RoleBind = [{ src: '/Role', name: 'label' }];
    this.ClassIDBind = [{ src: '/ClassID', name: 'label' }];
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label' }];
    this.LockableBind = [{ src: '/Lockable', name: 'label' }];
    this.EnabledBind = [{ src: '/Enabled', name: 'label' }];
    this.SettingBind = [{ src: '/Setting', name: 'label' }];
    this.MinBind = [{ src: '/Min', name: 'label' }];
    this.MaxBind = [{ src: '/Max', name: 'label' }];
  }
  static match(o) {
    return [
      'OcaActuator',
      'OcaBasicActuator',
      'OcaBooleanActuator',
      'OcaInt8Actuator',
      'OcaInt16Actuator',
      'OcaInt32Actuator',
      'OcaInt64Actuator',
      'OcaUint8Actuator',
      'OcaUint16Actuator',
      'OcaUint32Actuator',
      'OcaUint64Actuator',
      'OcaFloat32Actuator',
      'OcaFloat64Actuator',
      'OcaGain',
      'OcaMute',
      'OcaPolarity',
      'OcaSwitch',
      'OcaPanBalance',
      'OcaDelay',
      'OcaDelayExtended',
      'OcaFrequencyActuator',
    ].indexOf(o.ClassName) >= 0;
  }
}

registerTemplateDetails(OcaUint8ActuatorDetails);
