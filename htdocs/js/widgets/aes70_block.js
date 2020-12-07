import { BaseComponent } from '../../AWML/src/components/base_component.js';
import { DynamicValue } from '../../AWML/src/index.pure.js';
import { callUnsubscribe } from '../utils.js';

const template = `
  <aux-label>
    <awml-option name=label type=bind readonly src='/Role'></aux-option>
  </aux-label>
`;

class AES70Block extends BaseComponent {
  constructor() {
    super();
    this._open = DynamicValue.from(false);
  }

  connectedCallback() {
    super.connectedCallback();
    this.style.display = null;
  }

  set open(v) {
    v = !!v;

    if (this._open.value === v) return;
    this._open.set(v);
  }

  get open() {
    return this._open.value;
  }

  _subscribe() {
    const info = this.info; 
    let blockNode = null;

    this.innerHTML = template;
    this.querySelector('aux-label').addEventListener('click', (ev) => {
      this.open = !this.open;
      ev.preventDefault();
      ev.stopPropagation();
      return false;
    });

    const sub = this._open.subscribe((isOpen) => {
      if (isOpen === !!blockNode) return;

      this.classList.toggle('aes70-open', isOpen);

      if (isOpen) {
        blockNode = document.createElement('aes70-block-children');
        this.appendChild(blockNode);
      } else {
        blockNode.remove();
        blockNode = null;
      }
    });

    return () => {
      callUnsubscribe(sub);
      while (this.lastChild) this.lastChild.remove();
      blockNode = null;
    };
  }
}

customElements.define('aes70-block', AES70Block);
