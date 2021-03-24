import { DynamicValue, TemplateComponent } from '../../AWML/src/index.pure.js';
import { callUnsubscribe } from '../utils.js';

const template = `
<div class=head (click)={{ this.onHeadClick }}>
  <aux-icon icon=ocablock class=icon></aux-icon>
  <aux-label class=label %bind={{ this.labelBindings }}></aux-label>
</div>
`;

class AES70Block extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this._open = DynamicValue.from(false);
    
    this.onHeadClick = (ev) => {
      this.open = !this.open;
      ev.preventDefault();
      ev.stopPropagation();
      return false;
    }
    
    this.labelBindings = [
      {
        name: 'label',
        src: '/Role',
      }
    ]
    
    this._subscribe();
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
    let blockNode = null;

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
