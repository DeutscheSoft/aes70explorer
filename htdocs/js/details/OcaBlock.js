import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateDetails } from '../template_components.js';

function extractOrganizationID (value) {
  let OrgCode = new Uint8Array(value.Authority);

  return OrgCode.map((c) => c.toString(16)).join('');
}

const template = `
<div class="grid">
  <span class="label">ClassVersion</span>
  <aux-label %bind={{ this.ClassVersionBind }}></aux-label>

  <span class="label">Type</span>
  <aux-label %bind={{ this.TypeBind }}></aux-label>

  <span class="label">Members</span>
  <aux-label %bind={{ this.MembersBind }}></aux-label>

  <span class="label">Latest Param Set Library</span>
  <aux-label %bind={{ this.MostRecentParamSetIDLibraryBind }}></aux-label>
  
  <span class="label">Latest Param Set ID</span>
  <aux-label %bind={{ this.MostRecentParamSetIDIDBind }}></aux-label>
</div>
<div %if={{ this.implementsV2 }}>
  
  <h4>Global Type</h4>
  
  <div class="grid">
    <span class="label">Authority</span>
    <aux-label %bind={{ this.GlobalTypeAuthorityBind }}></aux-label>
    
    <span class="label">ID</span>
    <aux-label %bind={{ this.GlobalTypeIDBind }}></aux-label>
  </div>
  
</div>
`;

class OcaBlockDetails extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return [
      {
        name: 'implementsV2',
        src: '/ClassVersion',
        readonly: true,
        sync: true,
        transformReceive: v => v >= 2,
      },
    ];
  }
  constructor() {
    super();

    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label' }];
    this.TypeBind = [{ src: '/Type', name: 'label' }];
    this.MembersBind = [{ src: '/Members', name: 'label',
      transformReceive: v => v.length }];
    this.MostRecentParamSetIDLibraryBind = [{ src: '/MostRecentParamSetIdentifierBind', name: 'label',
      transformReceive: v => v.Library }];
    this.MostRecentParamSetIDIDBind = [{ src: '/MostRecentParamSetIdentifierBind', name: 'label',
      transformReceive: v => v.Library }];
    this.GlobalTypeAuthorityBind = [{ src: '/GlobalType', name: 'label',
      transformReceive: extractOrganizationID }];
    this.GlobalTypeIDBind = [{ src: '/GlobalType', name: 'label',
      transformReceive: v => v.ID }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaBlock, o);
  }
}

registerTemplateDetails(OcaBlockDetails, 'block');
