import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateDetails } from '../template_components.js';
import { makeImplementedBindings } from '../utils.js';

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
  
  <span class="label">Law</span>
  <aux-label %bind={{ this.LawBind }}></aux-label>
  
  <span class="label">Attack Min</span>
  <aux-label %bind={{ this.AttackMinBind }}></aux-label>

  <span class="label">Attack Max</span>
  <aux-label %bind={{ this.AttackMaxBind }}></aux-label>

  <span class="label">Attack</span>
  <aux-label %bind={{ this.AttackBind }}></aux-label>
</div>
<div class="grid">
  <span class="label">Release Min</span>
  <aux-label %bind={{ this.ReleaseMinBind }}></aux-label>

  <span class="label">Release Max</span>
  <aux-label %bind={{ this.ReleaseMaxBind }}></aux-label>

  <span class="label">Release</span>
  <aux-label %bind={{ this.ReleaseBind }}></aux-label>
  
  <span class="label">Hold Min</span>
  <aux-label %bind={{ this.HoldMinBind }}></aux-label>

  <span class="label">Hold Max</span>
  <aux-label %bind={{ this.HoldMaxBind }}></aux-label>

  <span class="label">Hold</span>
  <aux-label %bind={{ this.HoldBind }}></aux-label>
</div>
`;

class OcaDynamicsDetectorDetails extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return makeImplementedBindings([
      'Label',
    ]);
  }
  
  constructor() {
    super();

    this.LabelBind = [{ src: '/Label', name: 'value' }];
    this.ClassVersionBind = [{ src: '/ClassVersion', name: 'label' }];
    this.LockableBind = [{ src: '/Lockable', name: 'label' }];
    this.EnabledBind = [{ src: '/Enabled', name: 'state' }];
    
    this.AttackBind = [{ src: '/AttackTime', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    this.AttackMinBind = [{ src: '/AttackTime/Min', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    this.AttackMaxBind = [{ src: '/AttackTime/Max', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    
    this.ReleaseBind = [{ src: '/ReleaseTime', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    this.ReleaseMinBind = [{ src: '/ReleaseTime/Min', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    this.ReleaseMaxBind = [{ src: '/ReleaseTime/Max', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    
    this.HoldBind = [{ src: '/HoldTime', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    this.HoldMinBind = [{ src: '/HoldTime/Min', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
    this.HoldMaxBind = [{ src: '/HoldTime/Max', name: 'label',
      transformReceive: v => v.toFixed(3) + 's' }];
      
    this.LawBind = [{ src: '/Law', name: 'label',
      transformReceive: v => v.name }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaDynamicsDetector, o);
  }
}

registerTemplateDetails(OcaDynamicsDetectorDetails, 'dynamicsdetector');
