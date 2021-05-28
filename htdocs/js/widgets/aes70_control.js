import { setPrefix, getBackendValue, resolve, TemplateComponent, fromSubscription } from '../../AWML/src/index.pure.js';
import { createObjectControlComponent } from '../object_controls.js';

const Selected = getBackendValue('local:selected');

const template = `{{ this.controlComponent }}`;

class AES70Control extends TemplateComponent.fromString(template) {
  set identifier(identifier) {
    this._identifier = identifier;
    this.updateHostBindings();
    if (identifier)
      setPrefix(this, identifier.prefix);
  }

  get identifier() {
    return this._identifier;
  }

  getHostBindings() {
    const identifier = this.identifier;

    if (!identifier) return null;

    return [
      {
        backendValue: Selected,
        readonly: true,
        name: 'selectedClassName',
        transformReceive: (selected) => selected.prefix === identifier.prefix && selected.type === identifier.type,
      },
      {
        backendValue: getBackendValue(identifier.prefix),
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
      this.select();
    });
    this._identifier = null;
  }

  select() {
    if (this.identifier && !this.isSelected)
      Selected.set(this.identifier);
  }

  get isSelected() {
    const identifier = this.identifier;

    if (!identifier)
      return false;

    if (!Selected.hasValue)
      return false;

    const selected = Selected.value;

    return selected.type === identifier.type && selected.prefix === identifier.prefix;
  }
}

customElements.define('aes70-control', AES70Control);
