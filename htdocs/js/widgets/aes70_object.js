import { collectPrefix, TemplateComponent, getBackendValue } from '../../AWML/src/index.pure.js';
import { Bindings } from '../../AWML/src/bindings.js';
import { fromSubscription } from '../../AWML/src/operators/from_subscription.js';
import { addToCanvas } from '../layout.js';
import { registerControl, unregisterControl, getRegisteredControl } from '../template_components.js';

const template = `
<div
  class=head
  (click)={{ this.onHeaderClicked }}
  (dblclick)={{ this.onHeaderDblClicked }}
  >
  <aux-icon icon='ocaroot' class='icon aux-icon {{ this.typeClassNames }}'></aux-icon>
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

class AES70Object extends TemplateComponent.fromString(template) {
  getHostBindings() {
    return [
      {
        src: '',
        name: 'typeClassNames',
        readonly: true,
        sync: true,
        transformReceive: (o) => {
          const names = [];
          for (; o.constructor.ClassName; o = Object.getPrototypeOf(o))
          {
            names.push(o.constructor.ClassName.toLowerCase());
          }
          return names.reverse().join(' ');
        },
      },
      {
        backendValue: Selected,
        readonly: true,
        name: 'selectedClassName',
        transformReceive: (prefix) => prefix === collectPrefix(this),
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

  _updatePrefix(handle) {
    super._updatePrefix(handle);
    this._bindings.updatePrefix(handle);
  }

  constructor() {
    super();
    this._bindings = null;

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
      getBackendValue('local:selected').set(collectPrefix(this));
    }
    this.onHeaderDblClicked = (e) => {
      this._addControl();
    }
    
    this.onAddClicked = (e) => {
      this._addControl();
    }
    this.onRemoveConfirmed = (e) => {
      this._removeControl();
    }
    this.onRemoveClicked = (e) => {
      const node = getRegisteredControl(collectPrefix(this));
      if (!node) return;
      node.classList.add('scaffold');
    }
    this.onRemoveCanceled = (e) => {
      const node = getRegisteredControl(collectPrefix(this));
      if (!node) return;
      node.classList.remove('scaffold');
    }
  }
  
  _addControl() {
    const _node = getRegisteredControl(collectPrefix(this));
    if (_node) return; 
    const node = this._createControlNode();
    registerControl(collectPrefix(this), addToCanvas(node));
    this.classList.add('hascontrol');
    this._hasControl = true;
  }
  
  _removeControl() {
    const _node = getRegisteredControl(collectPrefix(this));
    if (!_node) return;
    _node.remove(); 
    unregisterControl(collectPrefix(this));
    this.classList.remove('hascontrol');
    this._hasControl = false;
  }
  
  _createControlNode() {
    const node = document.createElement('aes70-object-control');

    node.setAttribute('prefix', collectPrefix(this));

    return node;
  }

  _subscribe() {
    return () => {
      while (this.lastChild) this.lastChild.remove();
    };
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.style.display = null;
    this._hasControl = getRegisteredControl(collectPrefix(this));
    if (this._hasControl)
      this.classList.add('hascontrol');
  }
}

customElements.define('aes70-object', AES70Object);
