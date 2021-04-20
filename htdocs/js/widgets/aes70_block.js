import { collectPrefix, TemplateComponent, getBackendValue, fromSubscription } from '../../AWML/src/index.pure.js';

const Selected = getBackendValue('local:selected');

const template = `
<div class=head (click)={{ this.onHeadClick }}>
  <aux-icon icon={{ this._icon }} (click)={{ this.onIconClick }} class=icon></aux-icon>
  <aux-label class=label %bind={{ this.labelBindings }}></aux-label>
</div>
<aes70-block-children %if={{ this.open }}></aes70-block-children>
`;

class AES70Block extends TemplateComponent.fromString(template) {
  getHostBindings() {
    return [
      {
        backendValue: Selected,
        readonly: true,
        name: 'selectedClassName',
        transformReceive: (prefix) => prefix === collectPrefix(this),
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
    this._icon = 'ocablock';
    
    this.onHeadClick = (ev) => {
      Selected.set(collectPrefix(this));
    }
    
    this.onIconClick = (ev) => {
      this.open = !this.open;
    }
    
    this.labelBindings = [
      {
        name: 'label',
        src: '/Role',
      }
    ]
  }
}

customElements.define('aes70-block', AES70Block);
