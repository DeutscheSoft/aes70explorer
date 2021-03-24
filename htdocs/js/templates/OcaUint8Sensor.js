import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { registerTemplateComponent } from '../template_components.js';

const colorMax = '#ff6600';
const colorMid = '#8b06a5';
const colorMin = '#280062';

const template = `
<awml-option sync type=bind src='/Role' name=Role readonly></awml-option>
<aux-levelmeter
  style='height: 200px;'
  falling=100
  show_value=true
  value.format='sprintf:%.1f'
  foreground='black'
  >
</aux-levelmeter>
`;

class OcaUint8SensorTemplate extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.meterBindings = [
      {
        src: '/Role',
        name: 'label',
      },
      {
        src: '/Reading',
        name: 'value',
      },
      {
        src: '/Reading/Min',
        name: 'min',
      },
      {
        src: '/Reading/Max',
        name: 'max',
      },
      {
        src: '/Reading/Min,/Reading/Max',
        name: 'gradient',
        transformReceive: (arr) => {
          const [min, max] = arr;
          let grad = {};
          grad[String(min)] = colorMin;
          grad[String(min + (max - min) / 2)] = colorMid;
          grad[max] = colorMax;
          return grad;
        },
      },
    ];
  }
  static match(o) {
    return o.ClassName.endsWith('Sensor');
  }
}

registerTemplateComponent(OcaUint8SensorTemplate);
