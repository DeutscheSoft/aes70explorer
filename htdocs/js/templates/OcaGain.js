import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { registerTemplateComponent } from '../template_components.js';

const template = `
<div>
  <aux-fader style='height: 200px'>
    <awml-option type=bind src='/Gain' name=value></awml-option>
    <awml-option type=bind src='/Gain/Min' name=min readonly></awml-option>
    <awml-option type=bind src='/Gain/Max' name=max readonly></awml-option>
  </aux-fader>
</div>
`;

class OcaGainTemplate extends TemplateComponent.fromString(template) {
  static match(o) {
    return o.ClassName === 'OcaGain';
  }
}

registerTemplateComponent(OcaGainTemplate);
