import { TemplateComponent } from '../../AWML/src/index.pure.js';

const template = `
<aux-button icon="plus" class="add" label="Add Device" (click)={{ this.onAddClick }}>
</aux-button>
<div class="container {{ this.open ? 'open':'close' }}">
  <aux-label label="URL" class=lurl></aux-label>
  <aux-label label="Port" class=lport></aux-label>
  <aux-value editmode=immediate class=url preset=string #url placeholder="URL or IP Address"></aux-value>
  <aux-value editmode=immediate class=port preset=string #port placeholder="Port"></aux-value>
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
    }
    
    this.onOKClick = (ev) => {
      this.open = false;
      const url = this.url.auxWidget.get('value');
      const port = this.port.auxWidget.get('value');
      // DO SOMETHING USEFUL
      console.log(url, port);
    }
    
    this.onCancelClick = (ev) => {
      this.open = false;
    }
  }
  
}


customElements.define('aes70-add-device', AES70AddDevice);