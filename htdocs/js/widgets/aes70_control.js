import { collectPrefix, getBackendValue } from '../../AWML/src/index.pure.js';
import { PrefixComponentBase } from '../../AWML/src/components/prefix_component_base.js';
import { callUnsubscribe } from '../utils.js';
import { findTemplateControl } from '../template_components.js';

class AES70Control extends PrefixComponentBase {
  constructor() {
    super();
    this._cloneControl = null;
    this.addEventListener('click', (e) => {
      getBackendValue('local:selected').set(collectPrefix(this));
    });
    
    getBackendValue('local:selected').subscribe((v) => {
      if (v && collectPrefix(this) === v) {
        this.classList.add('selected');
      } else {
        if (this.classList.contains('selected'))
          this.classList.remove('selected');
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.style.display = null;
    this.setAttribute('src', '');
  }

  _valueReceived(o) {
    if (this._cloneControl !== null) {
      this._cloneControl.remove();
      this._cloneControl = null;
    }

    const tagName = findTemplateControl(o);

    if (!tagName)
      return;

    this._cloneControl = document.createElement(tagName);
    this.appendChild(this._cloneControl);
  }
}

customElements.define('aes70-control', AES70Control);
