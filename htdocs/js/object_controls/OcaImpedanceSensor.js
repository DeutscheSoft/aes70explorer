import { TemplateComponent, DynamicValue } from '../../AWML/src/index.pure.js';
import { matchClass } from '../utils/match_class.js';
import { registerObjectControlTemplate } from '../object_controls.js';
import { makeValueMinMaxBinding, limitValueDigits } from '../utils.js';

const _limitValueDigitsMagnitude = limitValueDigits(5, 'Ω');
const _limitValueDigitsPhase = limitValueDigits(3, 'rad');
const _limitValueDigitsDeg = limitValueDigits(4, '°');

const template = `
<aux-label %bind={{ this.labelBindings }} class=label></aux-label>
<aux-gauge
  class=magnitudegauge
  %bind={{ this.magnitudeGaugeBindings }}
  preset=gauge
  show_hand=true
  >
</aux-gauge>
<aux-label %bind={{ this.magnitudeValueBindings }} class=magnitudevalue></aux-label>
<aux-gauge
  class=phasegauge
  %bind={{ this.phaseGaugeBindings }}
  preset=phase
  show_hand=true
  >
</aux-gauge>
<aux-label %bind={{ this.phaseRadBindings }} class=phaserad></aux-label>
<aux-label %bind={{ this.phaseDegBindings }} class=phasedeg></aux-label>
`;

class OcaImpedanceSensorControl extends TemplateComponent.fromString(template) {

  constructor() {
    super();
    this.gaugePresets = DynamicValue.fromConstant(AES70.gaugePresets);
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
        readonly: true,
      },
    ]
    this.magnitudeGaugeBindings = [
        ...makeValueMinMaxBinding('Reading', v => v.Magnitude),
      {
        src: ['/Reading/Min','/Reading/Max'],
        name: 'labels',
        readonly: true,
        transformReceive: v => [v[0].Magnitude, v[1].Magnitude],
      },
      {
        backendValue: this.gaugePresets,
        name: 'presets',
        readonly: true,
      },
    ];
    this.phaseGaugeBindings = [
      ...makeValueMinMaxBinding('Reading', v => v.Phase * (180 / Math.PI)),
      {
        backendValue: this.gaugePresets,
        name: 'presets',
        readonly: true,
      },
    ];
    this.magnitudeValueBindings = [
      {
        src: '/Reading',
        name: 'label',
        readonly: true,
        transformReceive: v => _limitValueDigitsMagnitude(v.Magnitude),
      },
    ];
    this.phaseRadBindings = [
      {
        src: '/Reading',
        name: 'label',
        readonly: true,
        transformReceive: v => _limitValueDigitsPhase(v.Phase),
      },
    ];
    this.phaseDegBindings = [
      {
        src: '/Reading',
        name: 'label',
        readonly: true,
        transformReceive: v => _limitValueDigitsDeg(v.Phase * (180 / Math.PI)),
      },
    ];
  }
  static match(o) {
    return matchClass(OCA.RemoteControlClasses.OcaImpedanceSensor, o);
  }
}

registerObjectControlTemplate(OcaImpedanceSensorControl, 'impedancesensor');
