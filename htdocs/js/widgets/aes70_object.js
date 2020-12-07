import { BaseComponent } from '../../AWML/src/components/base_component.js';
import { DynamicValue } from '../../AWML/src/index.pure.js';
import { callUnsubscribe } from '../utils.js';

const template = `
  <aux-label>
    <awml-option name=label type=bind readonly src='/Role'></aux-option>
  </aux-label> (<aux-label>
    <awml-option name=label type=bind readonly src='' transform-receive='(o) => o.ClassName'></aux-option>
  </aux-label>)
`;

class AES70Object extends BaseComponent {
  connectedCallback() {
    super.connectedCallback();
    this.style.display = null;
  }

  _subscribe() {
    this.innerHTML = template;
    return () => {
      while (this.lastChild) this.lastChild.remove();
    };
  }
}

customElements.define('aes70-object', AES70Object);
