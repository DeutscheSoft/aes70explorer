import { collectPrefix, getBackendValue, TemplateComponent, fromSubscription } from '../../AWML/src/index.pure.js';
import { findTemplateControl } from '../template_components.js';

const Selected = getBackendValue('local:selected');

const template = `{{ this.controlComponent }}`;

class AES70Control extends TemplateComponent.fromString(template) {
  getHostBindings() {
    return [
      {
        backendValue: Selected,
        readonly: true,
        name: 'selectedClassName',
        transformReceive: (prefix) => prefix === collectPrefix(this),
      },
      {
        src: '',
        readonly: true,
        name: 'controlComponent',
        sync: true,
        transformReceive: (o) => {
          const tagName = findTemplateControl(o);

          if (!tagName)
            return null;

          return document.createElement(tagName);
        },
      }
    ];
  }

  awmlCreateBinding(name, options) {
    if (name === 'selectedClassName') {
      return fromSubscription(null, (value) => {
        this.classList.toggle('selected', !!value);
      });
    }

    return super.awmlCreateBinding(name, options);
  }

  constructor() {
    super();
    this.addEventListener('click', (e) => {
      getBackendValue('local:selected').set(collectPrefix(this));
    });
  }
}

customElements.define('aes70-control', AES70Control);
