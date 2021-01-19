import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { registerTemplateComponent } from '../template_components.js';

const template = `
<awml-option sync type=bind src='/Role' name=Role readonly></awml-option>
<div>
  {{ this.Role }}<br>
  <aux-levelmeter
    style='height: 200px;' falling=100 show_value value.format='sprintf:%d'
    foreground='white' background='grey'
    >
    <awml-option type=bind src='/Reading' name=value readonly></awml-option>
    <awml-option type=bind src='/Reading/Min' name=min readonly></awml-option>
    <awml-option type=bind src='/Reading/Max' name=max readonly></awml-option>
  </aux-levelmeter>
</div>
`;

class OcaUint8SensorTemplate extends TemplateComponent.fromString(template) {
  static match(o) {
    return o.ClassName.endsWith('Sensor');
  }
}

registerTemplateComponent(OcaUint8SensorTemplate);
