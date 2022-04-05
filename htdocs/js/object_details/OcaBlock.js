import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectDetailTemplate } from '../object_details.js';

function extractOrganizationID (value) {
  let OrgCode = new Uint8Array(value.Authority);

  return OrgCode.map((c) => c.toString(16)).join('');
}

const template = `
<div class="grid">
  <span %if={{ this.implementsLabel }} class="label">Label</span>
  <aux-value %if={{ this.implementsLabel }} preset=string %bind={{ this.LabelBind }}></aux-value>

  <span class="label">Enabled</span>
  <aux-toggle icon=enabled %bind={{ this.EnabledBind }}></aux-toggle>

  <span class="label">ClassVersion</span>
  <aux-label %bind={{ this.ClassVersionBind }}></aux-label>

  <span class="label">Members</span>
  <aux-label %bind={{ this.MembersBind }}></aux-label>
</div>
`;

class OcaBlockDetails extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return [
      {name: 'implementsLabel', src: '/Label/Implemented', readonly: true, sync: true},
    ];
  }
  constructor() {
    super();

    this.LabelBind = [{ src: '/Label', name: 'value' }];
    this.EnabledBind = [{ src: '/Enabled', name: 'state' }];
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label' }];
    this.MembersBind = [{ src: '/Members', name: 'label', readonly: true,
      transformReceive: v => v.length }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaBlock, o);
  }
}

registerObjectDetailTemplate(OcaBlockDetails, 'block');
