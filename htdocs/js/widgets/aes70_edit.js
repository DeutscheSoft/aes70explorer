import { getBackendValue, DynamicValue, TemplateComponent, switchMap, map, fromSubscription, resolve } from '../../AWML/src/index.pure.js';
import { callUnsubscribe, classIDToString } from '../utils.js';
import { createObjectControlComponent } from '../object_controls.js';
import { createObjectDetailComponent } from '../object_details.js';

const template = `


`

class AES70Edit extends TemplateComponent.fromString(template) {
  constructor() {
    super();

  }
}

customElements.define('aes70-edit', AES70Edit);
