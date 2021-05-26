import { TemplateComponent, getBackendValue, collectPrefix, fromSubscription } from '../../AWML/src/index.pure.js';
import { addControlToCanvas, removeControlFromCanvas } from '../layout.js';

const Selected = getBackendValue('local:selected');

const templateComponent = TemplateComponent.create({
  template: `
<div class='head' (click)={{ this.onHeadClick }}>
  <aux-icon class='icon' icon={{ this._icon }} (click)={{ this.onIconClick }}></aux-icon>
  <aux-label class='name' label='{{ this.info.name }}'></aux-label>
  <aux-icon class='ihost' icon='ip'></aux-icon>
  <aux-icon class='iport' icon='port'></aux-icon>
  <aux-label class='host' label='{{ this.info.host }}'></aux-label>
  <aux-label class='port' label='{{ this.info.port }}'></aux-label>
  <aux-button
    class=add
    icon=puzzle
    (click)={{ this.onAddClicked }}
    %if={{ !this._hasControl }}
  ></aux-button>
  <aux-confirmbutton timeout=3000
    class=remove
    icon=trash
    icon_confirm=confirm
    (confirmed)={{ this.onRemoveConfirmed }}
    (click)={{ this.onRemoveClicked }}
    (canceled)={{ this.onRemoveCanceled }}
    %if={{ !!this._hasControl }}
  ></aux-confirmbutton>
</div>
<aes70-block-children %if={{ this.open }} prefix={{ this.info.name + ':' }}></aes70-block-children>
`,
  properties: [ 'isSelected' ],
});

class AES70Device extends templateComponent {
  getHostBindings() {
    return [
      {
        backendValue: Selected,
        readonly: true,
        sync: true,
        name: 'isSelected',
        transformReceive: (selected) => selected && selected.prefix === this.info.name + ':/DeviceManager',
      }
    ];
  }

  select() {
    if (!this.isSelected)
      Selected.set({type:'device', prefix:this.info.name + ':/DeviceManager'});
  }

  constructor() {
    super();
    this._icon = 'ocadevice';
    this.subscribeEvent('isSelectedChanged', (value) => {
      this.classList.toggle('selected', value);
    });
    
    this.onHeadClick = (ev) => {
      if (!this.isSelected) {
        this.select();
      } else {
        this.open = !this.open;
      }
    }
    
    this.onIconClick = (ev) => {
      this.open = !this.open;
      ev.stopPropagation();
      this.select();
    }
    this.onAddClicked = (e) => {
      //this._addControl();
    }
    this.onRemoveConfirmed = (e) => {
      //this._removeControl();
    }
    this.onRemoveClicked = (e) => {
      //const node = getRegisteredControl(collectPrefix(this));
      //if (!node) return;
      //node.classList.add('scaffold');
    }
    this.onRemoveCanceled = (e) => {
      //const node = getRegisteredControl(collectPrefix(this));
      //if (!node) return;
      //node.classList.remove('scaffold');
    }
  }
}

customElements.define('aes70-device', AES70Device);
