import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { registerTemplateComponent } from '../template_components.js';

const template = `
<aux-fader
  label='{{ this.Role }}'
  show_value="true"
  value.format="sprintf:%.2f">
  <awml-option type=bind src='/Gain' name=value></awml-option>
  <awml-option type=bind src='/Gain/Min' name=min readonly></awml-option>
  <awml-option type=bind src='/Gain/Max' name=max readonly></awml-option>
</aux-fader>
`;

class OcaGainTemplate extends TemplateComponent.fromString(template) {
  static match(o) {
    return o.ClassName === 'OcaGain';
  }
}

registerTemplateComponent(OcaGainTemplate);
