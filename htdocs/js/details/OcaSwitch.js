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

  <span class="label">Position</span>
  <aux-label %bind={{ this.PositionBind }}></aux-label>
</div>
<div class="grid">
  <span class="label">PositionNames</span>
  <aux-marquee %bind={{ this.NamesBind }}></aux-marquee>

  <span class="label">PositionEnableds</span>
  <aux-marquee %bind={{ this.EnabledsBind }}></aux-marquee>
</div>
`;

class OcaSwitchDetails extends TemplateComponent.fromString(template) {
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
    this.PositionBind = [{ src: '/Position', name: 'label' }];
    this.MinBind = [{ src: '/Position/Min', name: 'label' }];
    this.MaxBind = [{ src: '/Position/Max', name: 'label' }];
    this.NamesBind = [{ src: '/PositionNames', name: 'label',
      transformReceive: v => v.join(',') }];
    this.EnabledsBind = [{ src: '/PositionEnableds', name: 'label',
      transformReceive: v => v.join(',') }];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaSwitch, o);
  }
}

registerTemplateDetails(OcaSwitchDetails, 'switch');
