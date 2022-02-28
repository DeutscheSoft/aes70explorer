import { getBackendValue, DynamicValue, TemplateComponent, switchMap, map, fromSubscription, resolve } from '../../AWML/src/index.pure.js';
import { callUnsubscribe, classIDToString } from '../utils.js';
import { createObjectControlComponent } from '../object_controls.js';
import { createObjectDetailComponent } from '../object_details.js';

const template = `
<aux-button icon=savecontrols label="Save Controls"
  >
  <awml-event type=click callback="AES70.saveControlsOnCanvas"></awml-event>
</aux-button>

<aux-confirmbutton
  icon=wipecontrols
  label="Wipe Controls"
  icon_confirm="confirm"
  >
  <awml-event type=confirmed callback="AES70.clearCanvas"></awml-event>
</aux-confirmbutton>

<div class="separator"></div>

<aux-button icon=addlinebreak label="Add Line Break"
  >
  <awml-event type=click callback="AES70.addLineBreak"></awml-event>
  <awml-option
    type=bind
    name=disabled
    src="local:canAddLineBreak"
    transform-receive="v=>!v">
  </awml-option>
</aux-button>

<aux-button icon=deletelinebreak label="Remove Line Break"
  >
  <awml-event type=click callback="AES70.removeLineBreak"></awml-event>
  <awml-option
    type=bind
    name=disabled
    src="local:canRemoveLineBreak"
    transform-receive="v=>!v">
  </awml-option>
</aux-button>
`

class AES70Edit extends TemplateComponent.fromString(template) {
  constructor() {
    super();

  }
}

customElements.define('aes70-edit', AES70Edit);
