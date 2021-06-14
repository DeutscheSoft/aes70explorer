import { TemplateComponent, getBackendValue, collectPrefix, fromSubscription } from '../../AWML/src/index.pure.js';
import { addControlToCanvas, removeControlFromCanvas, hasControlOnCanvas } from '../layout.js';
import { getRegisteredControl } from '../template_components.js';

const Selected = getBackendValue('local:selected');

const templateComponent = TemplateComponent.create({
  template: `
<div class='head' (click)={{ this.onHeadClick }}>
  <aux-icon class='icon' icon={{ this.open ? 'ocadeviceopen' : 'ocadevice' }} (click)={{ this.onIconClick }}></aux-icon>
  <aux-label class='name' label='{{ this.info.name }}'></aux-label>
  <aux-icon class='ihost' icon='ip'></aux-icon>
  <aux-icon class='iport' icon='port'></aux-icon>
  <aux-label class='host' label='{{ this.info.host }}'></aux-label>
  <aux-label class='port' label='{{ this.info.port }}'></aux-label>
  <aux-button
    class=add
    icon=puzzle
    (click)={{ this.onAddClicked }}
    %if={{ !this.hasControl }}
  ></aux-button>
  <aux-confirmbutton timeout=3000
    class=remove
    icon=trash
    icon_confirm=confirm
    (confirmed)={{ this.onRemoveConfirmed }}
    (click)={{ this.onRemoveClicked }}
    (canceled)={{ this.onRemoveCanceled }}
    %if={{ !!this.hasControl }}
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
      },
      {
        backendValue: hasControlOnCanvas(this.identifier),
        readonly: true,
        sync: true,
        name: 'hasControl',
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
    this._identifier = null;
    this.subscribeEvent('isSelectedChanged', (value) => {
      this.classList.toggle('selected', value);
    });
    this.subscribeEvent('hasControlChanged', (value) => {
      this.classList.toggle('hascontrol', value);
    });

    this.onHeadClick = (ev) => {
      if (!this.isSelected) {
        this.select();
      } else {
        this.open = !this.open;
      }
    }

    this.onIconClick = (ev) => {
      ev.stopPropagation();
      this.open = !this.open;
      this.select();
    }
    this.onAddClicked = (ev) => {
      ev.stopPropagation();
      this._addControl();
    }
    this.onRemoveConfirmed = (ev) => {
      ev.stopPropagation();
      this._removeControl();
    }
    this.onRemoveClicked = (ev) => {
      ev.stopPropagation();
      const node = getRegisteredControl(this.identifier);
      if (!node) return;
      node.classList.add('scaffold');
    }
    this.onRemoveCanceled = () => {
      const node = getRegisteredControl(this.identifier);
      if (!node) return;
      node.classList.remove('scaffold');
    }
  }

  _addControl() {
    addControlToCanvas(this.identifier);
  }

  _removeControl() {
    removeControlFromCanvas(this.identifier);
  }
}

customElements.define('aes70-device', AES70Device);
