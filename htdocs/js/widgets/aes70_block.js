import { collectPrefix, DynamicValue, TemplateComponent, getBackendValue } from '../../AWML/src/index.pure.js';
import { callUnsubscribe } from '../utils.js';

const template = `
<div class=head (click)={{ this.onHeadClick }}>
  <aux-icon icon={{ this._icon }} (click)={{ this.onIconClick }} class=icon></aux-icon>
  <aux-label class=label %bind={{ this.labelBindings }}></aux-label>
</div>
`;

class AES70Block extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this._open = DynamicValue.from(false);
    this._icon = 'ocablock';
    
    this.onHeadClick = (ev) => {
      getBackendValue('local:selected').set(collectPrefix(this));
    }
    
    this.onIconClick = (ev) => {
      this.open = !this.open;
    }
    
    this.labelBindings = [
      {
        name: 'label',
        src: '/Role',
      }
    ]
    
    getBackendValue('local:selected').subscribe((v) => {
      if (v && collectPrefix(this) === v) {
        this.classList.add('selected');
      } else {
        if (this.classList.contains('selected'))
          this.classList.remove('selected');
      }
    });
    
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
      this._icon = isOpen ? 'ocablockopen' : 'ocablock';

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
