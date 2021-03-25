import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { registerTemplateControl } from '../template_components.js';

const colorMax = '#ff6600';
const colorMid = '#8b06a5';
const colorMin = '#280062';

const template = `
<aux-levelmeter
  falling=100
  show_value=true
  value.format='sprintf:%.2f'
  foreground='black'
  %bind={{ this.meterBindings }}
  >
</aux-levelmeter>
`;

class OcaUint8SensorControl extends TemplateComponent.fromString(template) {
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
        src: '/Reading/Min',
        name: 'base',
      },
      {
        src: ['/Reading/Min','/Reading/Max'],
        name: 'gradient',
        transformReceive: function (arr) {
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

registerTemplateControl(OcaUint8SensorControl);
