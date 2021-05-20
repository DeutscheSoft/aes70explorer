import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';
import { makeValueMinMaxBinding } from '../utils.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';

const colorMax = '#ff6600';
const colorMid = '#8b06a5';
const colorMin = '#280062';

const template = `
<aux-levelmeter
  falling=100
  show_value=true
  sync_value=true
  format_value="sprintf:%d"
  scale.labels='sprintf:%d'
  foreground='black'
  %bind={{ this.meterBindings }}
  >
</aux-levelmeter>
`;

class OcaIntSensorControl extends TemplateComponent.fromString(template) {
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
    return Math.max(
      matchClass(OCA.RemoteControlClasses.OcaInt8Sensor, o),
      matchClass(OCA.RemoteControlClasses.OcaInt16Sensor, o),
      matchClass(OCA.RemoteControlClasses.OcaInt32Sensor, o),
      matchClass(OCA.RemoteControlClasses.OcaInt64Sensor, o),
      matchClass(OCA.RemoteControlClasses.OcaUint8Sensor, o),
      matchClass(OCA.RemoteControlClasses.OcaUint16Sensor, o),
      matchClass(OCA.RemoteControlClasses.OcaUint32Sensor, o),
      matchClass(OCA.RemoteControlClasses.OcaUint64Sensor, o),
    );
  }
}

registerTemplateControl(OcaIntSensorControl, 'intsensor');