import { collectPrefix, TemplateComponent } from '../../AWML/src/index.pure.js';
import { addToCanvas } from '../layout.js';

const template = `
<div class=head (dblclick)={{ this.onHeadDblClick }}>
  <aux-icon %bind={{this.iconBindings}} class=icon></aux-icon>
  <aux-label %bind={{this.labelBindings}} class=label></aux-label>
  <aux-label %bind={{this.classBindings}} class=class></aux-label>
</div>
`;

class AES70Object extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this._templateNode = null;
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
    this.onHeadDblClick = (e) => {
      if (this._templateNode) return; 
      const node = this._createTemplateNode();
      this._templateNode = addToCanvas(node);
    }
  }
  _createTemplateNode() {
    const node = document.createElement('aes70-object-template');

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
}

customElements.define('aes70-object', AES70Object);
