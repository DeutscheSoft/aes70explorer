import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';

const template = `
<aux-label %bind={{ this.LabelBindings }}></aux-label>
<aux-bitstring %bind={{ this.BitstringBindings }}>
  <awml-class
    src="/BitString"
    transform-receive="function (v) {
      const len = v.length;
      let S = 3;
      if (len > 16) S--;
      if (len > 36) S--;
      if (len > 64) S--;
      return 'aes70-size-' + ['tiny','small','medium','large'][S];
    }">
  </awml-class>
  <awml-styles
    src="/BitString"
    transform-receive="function (v) {
      const len = v.length;
      return {
        'grid-template-columns': 'repeat(' + Math.ceil(Math.sqrt(len)) + ', 1fr)'};
    }">
  </awml-styles>
</aux-bitstring>
`;

class OcaBitstringSensorControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.LabelBindings = [
      {
        src: '/Role',
        name: 'label',
      },
    ];
    this.BitstringBindings = [
      {
        src: '/BitString',
        name: 'bitstring',
      },
      {
        src: '/BitString',
        name: 'length',
        transformReceive: v=>v.length
      },
    ];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaBitstringSensor, o);
  }
}

registerTemplateControl(OcaBitstringSensorControl, 'bitstringsensor');
