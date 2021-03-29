import { TemplateComponent } from '../../AWML/src/index.pure.js';
import { registerTemplateControl } from '../template_components.js';

const template = `
<aux-label %bind={{ this.labelBindings }}></aux-label>
<aux-select %bind={{ this.selectBindings }}></aux-select>
`;

class OcaSwitchControl extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this.selectBindings = [
      {
        src: '/Position',
        name: 'value',
      },
      {
        src: ['/PositionNames','/PositionEnableds','/Position/Min','/Position/Max'],
        name: 'entries',
        debounce: 10,
        partial: true,
        transformReceive: (arr) => {
          let [names, enable, min, max] = arr;
          if (typeof min === 'undefined')
            min = 1;
          if (typeof max === 'undefined')
            max = names.length;
          let entries = [];
          for (let i = 0, m = names.length; i < m; ++i) {
            if (enable[i] && i + min <= max) {
              const key = min + i;
              const value = names[i];
              entries.push({ value: key, label: value });
            }
          }
          return entries;
        }
      },
    ];
    this.labelBindings = [
      {
        src: '/Role',
        name: 'label',
      },
    ];
  }
  static match(o) {
    return o.ClassName === 'OcaSwitch';
  }
}

registerTemplateControl(OcaSwitchControl);
