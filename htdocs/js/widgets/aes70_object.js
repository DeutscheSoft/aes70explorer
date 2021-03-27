import { collectPrefix, TemplateComponent, getBackendValue } from '../../AWML/src/index.pure.js';
import { addToCanvas } from '../layout.js';
import { registerControl, unregisterControl, getRegisteredControl } from '../template_components.js';

const template = `
<div
  class=head
  (click)={{ this.onHeaderClicked }}
  (dblclick)={{ this.onHeaderDblClicked }}
  >
  <aux-icon %bind={{this.iconBindings}} class=icon></aux-icon>
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

class AES70Object extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    
    getBackendValue('local:selected').subscribe((v) => {
      if (v && collectPrefix(this) === v) {
        this.classList.add('selected');
      } else {
        this.classList.remove('selected');
      }
    });
    
    this.iconBindings = [{
      src: '',
      name: 'icon',
      transformReceive: v=>v.ClassName.toLowerCase(),
    }];
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
      console.log(collectPrefix(this))
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
