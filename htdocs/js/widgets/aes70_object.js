import { collectPrefix, TemplateComponent, getBackendValue } from '../../AWML/src/index.pure.js';
import { Bindings } from '../../AWML/src/bindings.js';
import { fromSubscription } from '../../AWML/src/operators/from_subscription.js';
import { addControlToCanvas, removeControlFromCanvas } from '../layout.js';
import { getRegisteredControl } from '../template_components.js';

const template = `
<div
  class=head
  (click)={{ this.onHeaderClicked }}
  >
  <aux-icon #icon class='icon'></aux-icon>
  <aux-label %bind={{this.labelBindings}} class=label></aux-label>
  <aux-label %bind={{this.classBindings}} class=class></aux-label>
  <aux-button
    class=add
    icon=puzzle
    (click)={{ this.onAddClicked }}
    %if={{ !this._hasControl }}
  ></aux-button>
  <aux-confirmbutton timeout=3000
    class=remove
    icon=trash
    icon_confirm=confirm
    (confirmed)={{ this.onRemoveConfirmed }}
    (click)={{ this.onRemoveClicked }}
    (canceled)={{ this.onRemoveCanceled }}
    %if={{ !!this._hasControl }}
  ></aux-confirmbutton>
</div>
`;

const Selected = getBackendValue('local:selected');

function classListBinding(node) {
  let lastList = [];
  return fromSubscription(null, (list) => {
    list = list || [];
    lastList.forEach((name) => {
      if (list.includes(name)) return;
      node.classList.remove(name);
    });
    list.forEach((name) => {
      if (lastList.includes(name)) return;
      node.classList.add(name);
    });
    lastList = list;
  });
}

class AES70Object extends TemplateComponent.fromString(template) {
  get identifier() {
    if (!this._identifier) {
      this._identifier = {
        type: 'object',
        prefix: collectPrefix(this),
      };
    }

    return this._identifier;
  }

  select() {
    Selected.set(this.identifier);
  }

  get isSelected() {
    if (!Selected.hasValue)
      return;

    const selected = Selected.value;

    return selected.type === 'object' && selected.prefix === this.identifier.prefix;
  }

  getHostBindings() {
    return [
      {
        src: '',
        name: 'iconClassNames',
        readonly: true,
        sync: true,
        transformReceive: (o) => {
          const names = [];
          for (; o.constructor.ClassName; o = Object.getPrototypeOf(o))
          {
            names.push(o.constructor.ClassName.toLowerCase());
          }
          return names;
        },
      },
      {
        backendValue: Selected,
        readonly: true,
        name: 'selectedClassName',
        transformReceive: (selected) => {
          return selected && selected.type === 'object' && selected.prefix === this.identifier.prefix;
        },
      }
    ];
  }

  awmlCreateBinding(name, options) {
    if (name === 'selectedClassName') {
      return fromSubscription(null, (value) => {
        this.classList.toggle('selected', !!value);
      });
    } else if (name === 'iconClassNames') {
      return classListBinding(this.icon);
    }

    return super.awmlCreateBinding(name, options);
  }

  _updatePrefix(handle) {
    super._updatePrefix(handle);
    this._bindings.updatePrefix(handle);
  }

  constructor() {
    super();
    this._bindings = null;
    this._identifier = null;

    this.labelBindings = [{
      src: '/Role',
      name: 'label',
    }];
    this.classBindings = [{
      src: '',
      name: 'label',
      transformReceive: v=>v.ClassName,
    }];
    this.onHeaderClicked = (e) => {
      if (!this.isSelected)
        this.select();
    };
    this.onAddClicked = (e) => {
      this._addControl();
    };
    this.onRemoveConfirmed = (e) => {
      this._removeControl();
    };
    this.onRemoveClicked = (e) => {
      const node = getRegisteredControl(this.identifier);
      if (!node) return;
      node.classList.add('scaffold');
    };
    this.onRemoveCanceled = (e) => {
      const node = getRegisteredControl(this.identifier);
      if (!node) return;
      node.classList.remove('scaffold');
    };
  }
  
  _addControl() {
    addControlToCanvas(this.identifier);
    this.classList.add('hascontrol');
    this._hasControl = true;
  }
  
  _removeControl() {
    removeControlFromCanvas(this.identifier);
    this.classList.remove('hascontrol');
    this._hasControl = false;
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.style.display = null;
    this._hasControl = getRegisteredControl(this.identifier);
    if (this._hasControl)
      this.classList.add('hascontrol');
  }
}

customElements.define('aes70-object', AES70Object);
