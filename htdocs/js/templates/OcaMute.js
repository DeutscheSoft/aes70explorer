import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { registerTemplateComponent } from '../template_components.js';

const template = `
<aux-toggle icon=unmuted icon_active=muted %bind={{ this.faderBindings }}></aux-toggle>
`;

class OcaMuteTemplate extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.faderBindings = [
      {
        src: '/Role',
        name: 'label',
      },
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
    return o.ClassName === 'OcaMute';
  }
}

registerTemplateComponent(OcaMuteTemplate);
