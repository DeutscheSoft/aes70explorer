import { setPrefix, setPrefixBlock, getBackendValue, resolve, TemplateComponent, fromSubscription } from '../../AWML/src/index.pure.js';
import { createObjectControlComponent } from '../object_controls.js';
import { createDeviceControlComponent } from '../device_controls.js';

const Selected = getBackendValue('local:selected');

const template = `{{ this.controlComponent }}`;

class AES70Control extends TemplateComponent.fromString(template) {
  set identifier(identifier) {
    this._identifier = identifier;
    this.updateHostBindings();

    if (identifier) {
      setPrefix(this, identifier.prefix);
    } else {
      setPrefixBlock(this);
    }

  }

  get identifier() {
    return this._identifier;
  }

  getHostBindings() {
    const identifier = this.identifier;

    if (!identifier) return null;

    const objectSrc = identifier.type === 'object'
      ? identifier.prefix
      : (identifier.prefix + '/DeviceManager');


    return [
      {
        backendValue: Selected,
        readonly: true,
        name: 'selectedClassName',
        transformReceive: (selected) => {
          return selected && selected.prefix === identifier.prefix && selected.type === identifier.type;
        }
      },
      {
        backendValue: getBackendValue(objectSrc),
        readonly: true,
        name: 'controlComponent',
        sync: true,
        pipe: function (b) {
          return resolve(b, async (o) => {
            if (identifier.type === 'object') {
              return await createObjectControlComponent(o);
            } else {
              return await createDeviceControlComponent(o.device);
            }
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

    return selected && selected.type === identifier.type && selected.prefix === identifier.prefix;
  }
}

customElements.define('aes70-control', AES70Control);
