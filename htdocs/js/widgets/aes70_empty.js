import { TemplateComponent } from '../../AWML/src/index.pure.js';

const template = `
Empty
`;


class AES70Empty extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return [
      
    ];
  }
  
  constructor() {
    super();
  }
}


customElements.define('aes70-empty', AES70Empty);
