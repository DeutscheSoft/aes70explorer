import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';
import { makeValueMinMaxBinding } from '../utils.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';

const colorMax = '#ff6600';
const colorMid = '#8b06a5';
const colorMin = '#280062';

const template = `
<aux-levelmeter
  show_value=true
  sync_value=true
  format_value="sprintf:%.2f"
  scale.labels='sprintf:%d'
  foreground='black'
  %bind={{ this.meterBindings }}
  >
</aux-levelmeter>
`;

class OcaLevelSensorControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.meterBindings = [
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      },
      {
        src: '/Reading',
        name: 'value',
        readonly: true,
      },
      {
        src: '/Reading/Min',
        name: 'min',
        readonly: true,
      },
      {
        src: '/Reading/Max',
        name: 'max',
        readonly: true,
      },
      {
        src: '/Reading/Min',
        name: 'base',
        readonly: true,
      },
      {
        src: ['/Reading/Min','/Reading/Max'],
        name: 'gradient',
        readonly: true,
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
    return matchClass(OCA.RemoteControlClasses.OcaLevelSensor, o);
  }
}

registerTemplateControl(OcaLevelSensorControl, 'levelsensor');
