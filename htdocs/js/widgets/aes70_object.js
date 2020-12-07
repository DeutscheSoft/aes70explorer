import { BaseComponent } from '../../AWML/src/components/base_component.js';
import { collectPrefix } from '../../AWML/src/index.pure.js';
import { callUnsubscribe } from '../utils.js';
import { addToCanvas } from '../layout.js';

const template = `
  <div>
    <aux-label>
      <awml-option name=label type=bind readonly src='/Role'></aux-option>
    </aux-label> (<aux-label>
      <awml-option name=label type=bind readonly src='' transform-receive='(o) => o.ClassName'></aux-option>
    </aux-label>)
  </div>
`;

class AES70Object extends BaseComponent {
  constructor() {
    super();
    this._templateNode = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.style.display = null;
  }

  _createTemplateNode() {
    const node = document.createElement('aes70-object-template');

    node.setAttribute('prefix', collectPrefix(this));

    return node;
  }

  _subscribe() {
    this.innerHTML = template;

    this.querySelector('div').addEventListener('dblclick', () => {
      if (this._templateNode) return; 

      const node = this._createTemplateNode();

      this._templateNode = addToCanvas(node);
    });

    return () => {
      while (this.lastChild) this.lastChild.remove();
    };
  }
}

customElements.define('aes70-object', AES70Object);
