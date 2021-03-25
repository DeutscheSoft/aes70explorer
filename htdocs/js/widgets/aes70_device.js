import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { callUnsubscribe } from '../utils.js';

const template = `
<div class='head' (click)={{ this.onHeadClick }}>
  <aux-icon class='icon' icon='ocadevice'></aux-icon>
  <aux-label class='name' label='{{ this.info.name }}'></aux-label>
  <aux-icon class='ihost' icon='ip'></aux-icon>
  <aux-icon class='iport' icon='port'></aux-icon>
  <aux-label class='host' label='{{ this.info.host }}'></aux-label>
  <aux-label class='port' label='{{ this.info.port }}'></aux-label>
</div>
`;

class AES70Device extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this._open = DynamicValue.from(false);
    
    this.onHeadClick = (e) => {
      this.open = !this.open;
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
  }

  set info(info) {
    this._info = info;
    console.log(info)
    // @Arne: gibt es im TemplateComponent nicht?
    //this._resubscribe();
    //
    // ersetze für den Moment durch:
    this._subscribe();
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
  
  connectedCallback() {
    super.connectedCallback();
    this.style.display = null;
  }
}

customElements.define('aes70-device', AES70Device);
