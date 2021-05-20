import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';

const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label>
<aux-toggle icon=unmuted icon_active=muted %bind={{ this.toggleBindings }}></aux-toggle>
`;

class OcaMuteControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      },
    ];
    this.toggleBindings = [
      {
        src: '/State',
        name: 'state',
        // muted: 1, unmuted: 2
        transformReceive: v => v == 1,
        transformSend: v => v ? 1 : 2,
      },
    ];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaMute, o);
  }
}

registerTemplateControl(OcaMuteControl, 'mute');
