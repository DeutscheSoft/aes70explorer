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

  <span class="label">Min Setting</span>
  <aux-label %bind={{ this.MinBind }}></aux-label>

  <span class="label">Max Setting</span>
  <aux-label %bind={{ this.MaxBind }}></aux-label>

  <span class="label">Setting</span>
  <aux-label %bind={{ this.SettingBind }}></aux-label>
</div>
`;

class OcaIntActuatorDetails extends TemplateComponent.fromString(template) {
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
    this.SettingBind = [{ src: '/Setting', name: 'label', readonly: true,
      transformReceive: v => Number(v) }];
    this.MinBind = [{ src: '/Setting/Min', name: 'label', readonly: true,
      transformReceive: v => Number(v) }];
    this.MaxBind = [{ src: '/Setting/Max', name: 'label', readonly: true,
      transformReceive: v => Number(v) }];
  }
  static match(o) {
    return Math.max(
      matchClass(OCA.RemoteControlClasses.OcaInt8Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaInt16Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaInt32Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaInt64Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaUint8Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaUint16Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaUint32Actuator, o),
      matchClass(OCA.RemoteControlClasses.OcaUint64Actuator, o),
    );
  }
}

registerObjectDetailTemplate(OcaIntActuatorDetails, 'intactuator');
