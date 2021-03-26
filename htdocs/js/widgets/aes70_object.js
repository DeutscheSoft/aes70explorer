import { collectPrefix, TemplateComponent, getBackendValue } from '../../AWML/src/index.pure.js';
import { addToCanvas } from '../layout.js';

const template = `
<div
  class={{ this.classes }}
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
    %if={{ !this._controlNode }}
  ></aux-button>
  <aux-confirmbutton timeout=3000
    class=remove
    icon=trash
    icon_confirm=confirm
    (confirmed)={{ this.onRemoveConfirmed }}
    (click)={{ this.onRemoveClicked }}
    (canceled)={{ this.onRemoveCanceled }}
    %if={{ !!this._controlNode }}
  ></aux-confirmbutton>
</div>
`;

class AES70Object extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this._controlNode = null;
    this._classesSet = new Set();
    this._classesSet.add('head');
    this.classes = 'head';
    
    getBackendValue('local:selected').subscribe((v) => {
      if (v && collectPrefix(this) === v) {
        this._classesSet.add('selected');
        if (this._controlNode)
          this._controlNode.classList.add('selected');
      } else {
        this._classesSet.delete('selected');
        if (this._controlNode)
          this._controlNode.classList.remove('selected');
      }
      this.setClasses();
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
      if (!this._controlNode) return;
      this._controlNode.classList.add('scaffold');
    }
    this.onRemoveCanceled = (e) => {
      if (!this._controlNode) return;
      this._controlNode.classList.remove('scaffold');
    }
  }
  
  _addControl() {
    if (this._controlNode) return; 
    const node = this._createControlNode();
    this._controlNode = addToCanvas(node);
    this._classesSet.add('hascontrol');
    this.setClasses();
  }
  
  _removeControl() {
    if (!this._controlNode) return;
    this._controlNode.remove(); 
    this._controlNode = null;
    this._classesSet.delete('hascontrol');
    this.setClasses();
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
  }
  
  setClasses() {
    this.classes = Array.from(this._classesSet).join(' ');
  }
}

customElements.define('aes70-object', AES70Object);
