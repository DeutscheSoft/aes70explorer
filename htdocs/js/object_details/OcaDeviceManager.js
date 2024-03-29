import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectDetailTemplate } from '../object_details.js';

function extractManufaturerID (value) {
  let MfrCode = new Uint8Array(value.MfrCode);

  return MfrCode.map((c) => c.toString(16)).join('');
}

function extractModelID (value) {
  let ModelCode = new Uint8Array(value.ModelCode);

  return ModelCode.map((c) => c.toString(16)).join('');
}

const template = `
<div class="grid">
  <span class="label">Enabled</span>
  <aux-toggle icon=enabled %bind={{ this.EnabledBind }}></aux-toggle>

  <span class="label">ClassVersion</span>
  <aux-label %bind={{ this.ClassVersionBind }}></aux-label>

  <span class="label">Device State</span>
  <aux-label %bind={{ this.DeviceStateBind }}></aux-label>

  <span class="label">Device Name</span>
  <aux-marquee %bind={{ this.DeviceNameBind }}></aux-marquee>

  <span class="label">Device Revision ID</span>
  <aux-label %bind={{ this.DeviceRevisionIDBind }}></aux-label>
</div>
<div class="grid">
  <span class="label">Manufacturer</span>
  <aux-marquee %bind={{ this.ManufacturerBind }}></aux-marquee>

  <span class="label">Model</span>
  <aux-marquee %bind={{ this.ModelBind }}></aux-marquee>

  <span class="label">Version</span>
  <aux-label %bind={{ this.VersionBind }}></aux-label>

  <span class="label">Serial Number</span>
  <aux-marquee %bind={{ this.SerialNumberBind }}></aux-marquee>

  <span class="label">Manufacturer ID</span>
  <aux-label %bind={{ this.ManufacturerIDBind }}></aux-label>

  <span class="label">Model ID</span>
  <aux-label %bind={{ this.ModelIDBind }}></aux-label>
</div>
<div class="grid">
  <span class="label">OCA Version</span>
  <aux-label %bind={{ this.OCAVersionBind }}></aux-label>

  <span class="label">User Inventory Code</span>
  <aux-marquee %bind={{ this.UserInventoryCodeBind }}></aux-marquee>

  <span class="label">Last Reset Cause</span>
  <aux-marquee %bind={{ this.ResetCauseBind }}></aux-marquee>

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
    this.ManufacturerIDBind = [{ src: '/ModelGUID', name: 'label', readonly: true,
      transformReceive: extractManufaturerID }];
    this.ModelIDBind = [{ src: '/ModelGUID', name: 'label', readonly: true,
      transformReceive: extractModelID }];
    this.SerialNumberBind = [{ src: '/SerialNumber', name: 'label', readonly: true }];
    this.ManufacturerBind = [{ src: '/ModelDescription', name: 'label', readonly: true,
      transformReceive: v => v.Manufacturer }];
    this.ModelBind = [{ src: '/ModelDescription', name: 'label', readonly: true,
      transformReceive: v => v.Name }];
    this.VersionBind = [{ src: '/ModelDescription', name: 'label', readonly: true,
      transformReceive: v => v.Version }];
    this.DeviceNameBind = [{ src: '/DeviceName', name: 'label', readonly: true }];
    this.OCAVersionBind = [{ src: '/OcaVersion', name: 'label', readonly: true }];
    this.DeviceRoleBind = [{ src: '/DeviceRole', name: 'label', readonly: true }];
    this.UserInventoryCodeBind = [{ src: '/UserInventoryCode', name: 'label', readonly: true }];
    this.DeviceStateBind = [{ src: '/State', name: 'label', readonly: true }];
    this.MessageBind = [{ src: '/Message', name: 'label', readonly: true }];
    this.DeviceRevisionIDBind = [{ src: '/DeviceRevisionID', name: 'label', readonly: true }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaDeviceManager, o);
  }
}

registerObjectDetailTemplate(OcaDeviceManagerDetails, 'devicemanager');
