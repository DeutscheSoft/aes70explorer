import { TemplateComponent, getBackendValue, collectPrefix, fromSubscription } from '../../AWML/src/index.pure.js';
import { addControlToCanvas, removeControlFromCanvas } from '../layout.js';
import { getRegisteredControl } from '../template_components.js';

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
        transformReceive: (selected) => {
          const identifier = this.identifier;
          if (!identifier || !selected)
            return false;

          return identifier.type === selected.type && identifier.prefix === selected.prefix;
        },
      }
    ];
  }

  get identifier() {
    if (!this._identifier && this.info) {
      this._identifier = {
        type: 'device',
        prefix: this.info.name + ':',
      };
    }

    return this._identifier;
  }

  select() {
    if (!this.isSelected)
      Selected.set(this.identifier);
  }

  constructor() {
    super();
    this._icon = 'ocadevice';
    this._identifier = null;
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
    this.onAddClicked = (ev) => {
      this._addControl();
    }
    this.onRemoveConfirmed = () => {
      this._removeControl();
    }
    this.onRemoveClicked = (ev) => {
      const node = getRegisteredControl(this.identifier);
      if (!node) return;
      node.classList.add('scaffold');
    }
    this.onRemoveCanceled = (e) => {
      const node = getRegisteredControl(this.identifier);
      if (!node) return;
      node.classList.remove('scaffold');
    }
  }

  _addControl() {
    addControlToCanvas(this.identifier);
    this.classList.add('hascontrol');
    this._hasControl = true;
  }

  _removeControl() {
    removeControlFromCanvas(collectPrefix(this));
    this.classList.remove('hascontrol');
    this._hasControl = false;
  }
}

customElements.define('aes70-device', AES70Device);
