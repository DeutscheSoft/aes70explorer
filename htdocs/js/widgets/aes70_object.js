import { collectPrefix, TemplateComponent } from '../../AWML/src/index.pure.js';
import { addToCanvas } from '../layout.js';

const template = `
<div class={{ this.classes }}>
  <aux-icon %bind={{this.iconBindings}} class=icon></aux-icon>
  <aux-label %bind={{this.labelBindings}} class=label></aux-label>
  <aux-label %bind={{this.classBindings}} class=class></aux-label>
  <aux-button
    class=add
    icon=puzzle
    (click)={{ this.onAddClicked }}
    %if={{ !this._controlNode }}
  ></aux-button>
  <aux-confirmbutton
    class=remove
    icon=trash
    icon_confirm=confirm
    (confirmed)={{ this.onRemoveClicked }}
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
    this.onAddClicked = (e) => {
      if (this._controlNode) return; 
      const node = this._createControlNode();
      this._controlNode = addToCanvas(node);
      this._classesSet.add('hascontrol');
      this.setClasses();
    }
    this.onRemoveClicked = (e) => {
      if (!this._controlNode) return;
      this._controlNode.remove(); 
      this._controlNode = null;
      this._classesSet.delete('hascontrol');
      this.setClasses();
    }
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
