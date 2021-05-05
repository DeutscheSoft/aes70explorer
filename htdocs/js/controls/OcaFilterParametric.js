import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { matchClass, registerTemplateControl } from '../template_components.js';

const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label><br>
<aux-valueknob scale=frequency %bind={{ this.frequencyBindings }} #frequencyknob></aux-valueknob><br>
<aux-valueknob %bind={{ this.gainBindings }} value.format='sprintf:%.1f dB'></aux-valueknob><br>
<aux-valueknob %bind={{ this.widthBindings }} #qknob value.format='sprintf:%.1f'></aux-valueknob>
`;

class OcaFilterParametricControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
      },
    ];
    this.frequencyBindings = [
      {
        src: '/Frequency/Min',
        name: 'min',
      },
      {
        src: '/Frequency/Max',
        name: 'max',
      },
      {
        src: '/Frequency',
        name: 'value',
      },
    ];
    this.gainBindings = [
      {
        src: '/InbandGain/Min',
        name: 'min',
      },
      {
        src: '/InbandGain/Max',
        name: 'max',
      },
      {
        src: '/InbandGain',
        name: 'value',
      },
    ];
    this.widthBindings = [
      {
        src: '/WidthParameter/Min',
        name: 'min',
      },
      {
        src: '/WidthParameter/Max',
        name: 'max',
      },
      {
        src: '/WidthParameter',
        name: 'value',
      },
    ];

    this.subscribeEvent('attached', () => {
      this.frequencyknob.auxWidget.set('value.format', (f) => {
        if (f < 1000)
          return f.toFixed(1) + ' Hz';

        return (f / 1000).toFixed(2) + ' kHz';
      });
    });
  }

  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaFilterParametric, o);
  }
}

registerTemplateControl(OcaFilterParametricControl, 'filterparametric');
