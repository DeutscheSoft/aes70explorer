import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateDetails } from '../template_components.js';

function extractManufaturerID (value) {
  str = "";
  for (let i = 0; i < 3; ++i) {
    value = value >> 8;
    str += (value & 0xff).toString(16);
  }
}
function extractModelID (value) {
  str = "";
  value = value >> (8 * 4);
  for (let i = 0; i < 4; ++i) {
    str += (value & 0xff).toString(16);
    value = value >> 8;
  }
}

const template = `
<div class="grid">
  <span class="label">Enabled</span>
  <aux-toggle icon=power %bind={{ this.EnabledBind }}></aux-toggle>
  
  <span class="label">ClassVersion</span>
  <aux-label %bind={{ this.ClassVersionBind }}></aux-label>
  
  <span class="label">Device Busy</span>
  <aux-state %bind={{ this.BusyBind }}></aux-state>
  
  <span class="label">Device State</span>
  <aux-label %bind={{ this.DeviceStateBind }}></aux-label>
  
  <span class="label">Device Name</span>
  <aux-label %bind={{ this.DeviceNameBind }}></aux-label>
  
  <span class="label">Device Revision ID</span>
  <aux-label %bind={{ this.DeviceRevisionIDBind }}></aux-label>
</div>
<div class="grid">
  <span class="label">Manufacturer</span>
  <aux-label %bind={{ this.ManufacturerBind }}></aux-label>
  
  <span class="label">Model</span>
  <aux-label %bind={{ this.ModelBind }}></aux-label>
  
  <span class="label">Version</span>
  <aux-label %bind={{ this.VersionBind }}></aux-label>
  
  <span class="label">Serial Number</span>
  <aux-label %bind={{ this.SerialNumberBind }}></aux-label>
  
  <span class="label">Manufacturer ID</span>
  <aux-label %bind={{ this.ManufacturerIDBind }}></aux-label>
  
  <span class="label">Model ID</span>
  <aux-label %bind={{ this.ModelIDBind }}></aux-label>
</div>
<div class="grid">
  <span class="label">OCA Version</span>
  <aux-label %bind={{ this.OCAVersionBind }}></aux-label>
  
  <span class="label">User Inventory Code</span>
  <aux-label %bind={{ this.UserInventoryCodeBind }}></aux-label>
  
  <span class="label">Last Reset Cause</span>
  <aux-label %bind={{ this.ResetCauseBind }}></aux-label>
  
  <span class="label">Message</span>
  <aux-marquee %bind={{ this.MessageBind }}></aux-marquee>
</div>
`;

class OcaDeviceManagerDetails extends TemplateComponent.fromString(template) {
  constructor() {
    super();

    this.LabelBind = [{ src: '/Label', name: 'value' }];
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label' }];
    this.EnabledBind = [{ src: '/Enabled', name: 'state' }];
    this.BusyBind = [{ src: '/Busy', name: 'state' }];
    this.ManufacturerIDBind = [{ src: '/ModelGUID', name: 'label',
      transformReceive: extractManufaturerID }];
    this.ModelIDBind = [{ src: '/ModelGUID', name: 'label',
      transformReceive: extractModelID }];
    this.SerialNumberBind = [{ src: '/SerialNumber', name: 'label' }];
    this.ManufacturerBind = [{ src: '/ModelDescription', name: 'label',
      transformReceive: v => v.Manufacturer }];
    this.ModelBind = [{ src: '/ModelDescription', name: 'label',
      transformReceive: v => v.Name }];
    this.VersionBind = [{ src: '/ModelDescription', name: 'label',
      transformReceive: v => v.Version }];
    this.DeviceNameBind = [{ src: '/DeviceName', name: 'label' }];
    this.OCAVersionBind = [{ src: '/OcaVersion', name: 'label' }];
    this.DeviceRoleBind = [{ src: '/DeviceRole', name: 'label' }];
    this.UserInventoryCodeBind = [{ src: '/UserInventoryCode', name: 'label' }];
    this.DeviceStateBind = [{ src: '/State', name: 'label' }];
    this.MessageBind = [{ src: '/Message', name: 'label' }];
    this.DeviceRevisionIDBind = [{ src: '/DeviceRevisionID', name: 'label' }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaDeviceManager, o);
  }
}

registerTemplateDetails(OcaDeviceManagerDetails);
