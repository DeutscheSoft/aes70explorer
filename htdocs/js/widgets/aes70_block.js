import { collectPrefix, TemplateComponent, getBackendValue, fromSubscription } from '../../AWML/src/index.pure.js';
import { handleNavState, getNavState } from '../utils/navstate.js';

const Selected = getBackendValue('local:selected');

const templateComponent = TemplateComponent.create({
  template: `
<div class=head (click)={{ this.onHeadClick }}>
  <aux-button icon={{ this.open ? 'ocablockopen' : 'ocablock' }} (click)={{ this.onIconClick }} class=icon></aux-button>
  <aux-label class=label %bind={{ this.labelBindings }}></aux-label>
  <aux-icon icon=item class=iconm></aux-icon>
  <aux-label class=children %bind={{ this.childrenBindings }}></aux-label>
</div>
<aes70-block-children %if={{ this.open }}></aes70-block-children>
`,
  properties: [ 'isSelected' ],
});

class AES70Block extends templateComponent {
  getHostBindings() {
    return [
      {
        backendValue: Selected,
        readonly: true,
        name: 'isSelected',
        sync: true,
        transformReceive: (selected) => {
          return selected && selected.prefix === collectPrefix(this);
        },
      }
    ];
  }

  select() {
    if (!this.isSelected)
      Selected.set({type:'block', prefix:collectPrefix(this)});
  }

  async connectedCallback() {
    this.open = await getNavState(collectPrefix(this));
    TemplateComponent.prototype.connectedCallback.call(this);
  }

  constructor() {
    super();
    this.subscribeEvent('isSelectedChanged', (value) => {
      this.classList.toggle('selected', value);
    });

    this.onHeadClick = (ev) => {
      if (!this.isSelected) {
        this.select();
        this.open = true;
      } else {
        this.open = !this.open;
      }
      handleNavState(collectPrefix(this), this.open);
    }

    this.onIconClick = (ev) => {
      this.open = !this.open;
      ev.stopPropagation();
      this.select();
      handleNavState(collectPrefix(this), this.open);
    }

    this.labelBindings = [
      {
        name: 'label',
        src: '/Role',
      }
    ]
    this.childrenBindings = [
      {
        name: 'label',
        src: '/Members',
        transformReceive: v => v.length,
      }
    ]
  }
}

customElements.define('aes70-block', AES70Block);
