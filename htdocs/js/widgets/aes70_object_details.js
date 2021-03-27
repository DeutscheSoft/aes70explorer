import { collectPrefix, getBackendValue, TemplateComponent } from '../../AWML/src/index.pure.js';
import { callUnsubscribe, classIDToString } from '../utils.js';
import { findTemplateDetails, findTemplateControl } from '../template_components.js';

const template = `
<awml-prefix src="local:selected"></awml-prefix>
<div class=head>
  <aux-icon %if={{ this._path }} class=icon %bind={{ this.IconBind }}></aux-icon>
  <aux-label %if={{ this._path }} class=role %bind={{ this.RoleBind }}></aux-label>
  <aux-label %if={{ this._path }} class=classid %bind={{ this.ClassIDBind }}></aux-label>
  <aux-label %if={{ this._path }} class=classname %bind={{ this.ClassNameBind }}></aux-label>
</div>
<div class=details #details></div>
<div class=control #control></div>
<div class=noselect %if={{ !this._path }}>Select An Object From The List</div>
`
class AES70ObjectDetails extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this._cloneControl = null;
    this._cloneDetails = null;
    this._path = null;
    
    this.IconBind = [{ src: '', name: 'icon',
      transformReceive: v=>v.ClassName.toLowerCase(), }];
    this.RoleBind = [{ src: '/Role', name: 'label' }];
    this.ClassIDBind = [{ src: '/ClassID', name: 'label',
      transformReceive: classIDToString, }];
    this.ClassNameBind = [{ src: '', name: 'label',
      transformReceive: v=>v.ClassName }];
    
    getBackendValue('local:selected').subscribe((function (path) {
      if (path === this._path)
        return;
      this._path = path;
      this._clearClones();
      if (!path)
        return;
      
      getBackendValue(path).wait().then((function (o) {
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
    }).bind(this));
  }

  _clearClones() {
    if (this._cloneControl !== null) {
      this._cloneControl.remove();
      this._cloneControl = null;
    }
    if (this._cloneDetails !== null) {
      this._cloneDetails.remove();
      this._cloneDetails = null;
    }
  }
}

customElements.define('aes70-object-details', AES70ObjectDetails);
