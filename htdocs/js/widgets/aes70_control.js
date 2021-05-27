import { collectPrefix, getBackendValue, resolve, TemplateComponent, fromSubscription } from '../../AWML/src/index.pure.js';
import { createObjectControlComponent } from '../object_controls.js';

const Selected = getBackendValue('local:selected');

const template = `{{ this.controlComponent }}`;

class AES70Control extends TemplateComponent.fromString(template) {
  getHostBindings() {
    return [
      {
        backendValue: Selected,
        readonly: true,
        name: 'selectedClassName',
        transformReceive: (selected) => selected.prefix === collectPrefix(this),
      },
      {
        src: '',
        readonly: true,
        name: 'controlComponent',
        sync: true,
        pipe: function (b) {
          return resolve(b, async (o) => {
            return await createObjectControlComponent(o);
          });
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
      const prefix = collectPrefix(this);
      if (Selected._value && Selected._value.prefix === prefix)
        return;
      Selected.set({type:'object', prefix:prefix});
    });
  }
}

customElements.define('aes70-control', AES70Control);
