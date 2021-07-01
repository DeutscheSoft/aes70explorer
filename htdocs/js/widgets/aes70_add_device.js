import { TemplateComponent } from '../../AWML/src/index.pure.js';

const template = `
<aux-button icon="plus" class="add" label="Add Device" (click)={{ this.onAddClick }}>
</aux-button>
<div class="container {{ this.open ? 'open':'close' }}">
  <aux-label label="URL" class=lurl></aux-label>
  <aux-label label="Port" class=lport></aux-label>
  <aux-value editmode=immediate class=url preset=string #url placeholder="URL or IP Address" (keyup)={{ this.inputKeyup }}></aux-value>
  <aux-value editmode=immediate class=port preset=string #port placeholder="Port" (keyup)={{ this.inputKeyup }}></aux-value>
  <aux-button class=ok icon="ok" label="Add Device" (click)={{ this.onOKClick }}>
  </aux-button>
  <aux-button class=cancel icon="cancel" label="Cancel" (click)={{ this.onCancelClick }}>
  </aux-button>
</div>
`;


class AES70AddDevice extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return [
      
    ];
  }
  
  constructor() {
    super();
    
    this.open = false;
    
    this.onAddClick = (ev) => {
      this.open = !this.open;
      if (this.open)
        this.url.auxWidget._input.focus();
    }
    
    this.onOKClick = (ev) => {
      this.open = false;
      this.addDevice();
    }
    
    this.onCancelClick = (ev) => {
      this.open = false;
    }
    
    this.inputKeyup = (ev) => {
      if(ev.key === "Enter") {
        this.addDevice();
        this.url.auxWidget._input.focus();
      }
    }
    this.addDevice = () => {
      const url = this.url.auxWidget.get('value');
      const port = this.port.auxWidget.get('value');
      // DO SOMETHING USEFUL
      console.log(url, port);
    }
  }
  
}


customElements.define('aes70-add-device', AES70AddDevice);
