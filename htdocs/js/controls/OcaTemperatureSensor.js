import { TemplateComponent, getBackendValue } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';
import { sprintf } from '../../aux-widgets/src/utils/sprintf.js';
import { HSLToHex } from '../../aux-widgets/src/utils/colors.js';

const template = `
<aux-label %bind={{ this.labelBindings }} class=label></aux-label>
<aux-icon icon="ocatemperaturesensor" style={{ this.tempColor }}></aux-icon>
<aux-label %bind={{ this.tempBindings }} class=temp></aux-label>
`;

function tempcolor (arr) {
  const [val, min, max] = arr;
  let v = (1 - Math.max(0, Math.min(1, (val-min) / (max-min)))) * 0.6;
  return 'color: #' + HSLToHex(v, 1, 0.4);
}

class OcaTemperatureSensorControl extends TemplateComponent.fromString(template) {
  getHostBindings() {
    return [
      {
        src: ['/Reading', '/Reading/Min', '/Reading/Max'],
        readonly: true,
        name: 'tempColor',
        transformReceive: tempcolor,
        sync: true,
      },
    ];
  }
  constructor() {
    super();
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      },
    ];
    this.tempBindings = [
      {
        src: '/Reading',
        name: 'label',
        readonly: true,
        transformReceive: v => v.toFixed(2) + '°C',
      },
    ];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaTemperatureSensor, o);
  }
}

registerTemplateControl(OcaTemperatureSensorControl, 'temperaturesensor');
