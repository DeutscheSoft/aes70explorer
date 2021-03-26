import { collectPrefix, getBackendValue } from '../../AWML/src/index.pure.js';
import { PrefixComponentBase } from '../../AWML/src/components/prefix_component_base.js';
import { callUnsubscribe } from '../utils.js';
import { findTemplateDetails, findTemplateControl } from '../template_components.js';

const template = `
<div class=control #control></div>
<div class=details #details></div>
`
class AES70ObjectDetails extends PrefixComponentBase {
  constructor() {
    super();
    this._cloneControl = null;
    this._cloneDetails = null;
    
    this.innerHTML = template;
    this.control = this.querySelector('.control');
    this.details = this.querySelector('.details');
  }

  connectedCallback() {
    super.connectedCallback();
    this.style.display = null;
    this.setAttribute('src', 'local:selected');
  }

  _valueReceived(path) {
    this.setAttribute('prefix', path);
    getBackendValue(path).wait().then((function (o) {
      
      if (this._cloneControl !== null) {
        this._cloneControl.remove();
        this._cloneControl = null;
      }
      
      if (this._cloneDetails !== null) {
        this._cloneDetails.remove();
        this._cloneDetails = null;
      }
  
      const ctrlTagName = findTemplateControl(o);
      if (ctrlTagName) {
        this._cloneControl = document.createElement(ctrlTagName);
        this.control.appendChild(this._cloneControl);
      }
      
      const dtlsTagName = findTemplateDetails(o);
      if (dtlsTagName) {
        this._cloneDetails = document.createElement(dtlsTagName);
        this.details.appendChild(this._cloneDetails);
      }
      
    }).bind(this));
  }
}

customElements.define('aes70-object-details', AES70ObjectDetails);
