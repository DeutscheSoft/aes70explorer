import { PrefixComponentBase } from '../../AWML/src/components/prefix_component_base.js';
import { callUnsubscribe } from '../utils.js';

class AES70ObjectTemplate extends PrefixComponentBase {
  constructor() {
    super();
    this._cloneNode = document.createElement('awml-clone');
    this._cloneNode.fetch = true;
    this._cloneNode.setAttribute('debug', '');
  }

  connectedCallback() {
    super.connectedCallback();
    this.style.display = null;
    this.setAttribute('src', '');
    this.appendChild(this._cloneNode);
  }

  _valueReceived(o) {
    this._cloneNode.className = o.ClassName;
    this._cloneNode.template = '/templates/' + o.ClassName + '.html';
  }
}

customElements.define('aes70-object-template', AES70ObjectTemplate);
