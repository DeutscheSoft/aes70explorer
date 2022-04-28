import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { Devices, makeDestinationKey } from '../devices.js';
import { forEachAsync } from '../utils.js';

const template = `
<div %if={{ this.hasLicenses }} style='white-space: nowrap;'>
Open source licenses:
<a target=_blank href='LICENSE.dependencies.html'>dependencies</a> | <a target=_blank href='LICENSES.chromium.html'>chromium</a> | <a target=_blank href='LICENSE.electron.txt'>electron</a>
</div>
`;

class AES70Licenses extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return [
      {name: 'hasLicenses', src: 'capabilities:license', readonly: true, sync: true},
    ];
  }

  constructor() {
    super();

    this.hasLicenses = false;
  }
}

customElements.define('aes70-licenses', AES70Licenses);
