import { TemplateComponent, getBackendValue, collectPrefix, fromSubscription } from '../../AWML/src/index.pure.js';

const Selected = getBackendValue('local:selected');

const template = `
<div class='head' (click)={{ this.onHeadClick }}>
  <aux-icon class='icon' icon={{ this._icon }} (click)={{ this.onIconClick }}></aux-icon>
  <aux-label class='name' label='{{ this.info.name }}'></aux-label>
  <aux-icon class='ihost' icon='ip'></aux-icon>
  <aux-icon class='iport' icon='port'></aux-icon>
  <aux-label class='host' label='{{ this.info.host }}'></aux-label>
  <aux-label class='port' label='{{ this.info.port }}'></aux-label>
</div>
<aes70-block-children %if={{ this.open }} prefix={{ this.info.name + ':' }}></aes70-block-children>
`;

class AES70Device extends TemplateComponent.fromString(template) {
  getHostBindings() {
    return [
      {
        backendValue: Selected,
        readonly: true,
        name: 'selectedClassName',
        transformReceive: (prefix) => prefix === this.info.name + ':/DeviceManager',
      }
    ];
  }

  awmlCreateBinding(name, options) {
    if (name === 'selectedClassName') {
      return fromSubscription(null, (value) => {
        this.classList.toggle('selected', !!value);
      });
    }

    return super.awmlCreateBinding(name, options);
  }

  constructor() {
    super();
    this._icon = 'ocadevice';
    
    this.onHeadClick = (ev) => {
      Selected.set(this.info.name + ':/DeviceManager');
    }
    
    this.onIconClick = (ev) => {
      this.open = !this.open;
    }
  }
}

customElements.define('aes70-device', AES70Device);
