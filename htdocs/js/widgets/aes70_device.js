import { BaseComponent } from '../../AWML/src/components/base_component.js';
import { DynamicValue } from '../../AWML/src/index.pure.js';
import { callUnsubscribe } from '../utils.js';

function renderTemplate(info) {
  return `
<div class='head'>
  <aux-label class='name' label='${info.name}'></aux-label>
  <aux-icon class='icon' icon='device'></aux-icon>
  <aux-label class='host' label='${info.host}'></aux-label>
  <aux-label class='port' label='${info.port}'></aux-label>
</div>
`;
}

class AES70Device extends BaseComponent {
  constructor() {
    super();
    this._open = DynamicValue.from(false);
  }

  connectedCallback() {
    super.connectedCallback();
    this.style.display = null;
  }

  set info(info) {
    this._info = info;
    this._resubscribe();
  }

  get info() {
    return this._info;
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

    this.innerHTML = renderTemplate(info);
    this.querySelector('aux-label').addEventListener('click', (ev) => {
      this.open = !this.open;
      ev.stopPropagation();
      ev.preventDefault();
      return false;
    });

    const sub = this._open.subscribe((isOpen) => {
      if (isOpen === !!blockNode) return;

      this.classList.toggle('aes70-open', isOpen);

      if (isOpen) {
        blockNode = document.createElement('aes70-block-children');
        blockNode.setAttribute('prefix', info.name + ':');
        blockNode.setAttribute('src', '/');
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

customElements.define('aes70-device', AES70Device);
