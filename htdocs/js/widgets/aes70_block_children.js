import { TemplateComponent } from '../../AWML/src/index.pure.js';

function createChildComponent(roleName, o) {
  let component;

  if (typeof o.GetMembers === 'function') {
    component = document.createElement('aes70-block');
  } else {
    component = document.createElement('aes70-object');
  }

  component.setAttribute('prefix', '/' + roleName);

  return component;
}

const template = `
<div class='loading' %if={{!this.objectNodes}}><i></i><i></i><i></i><i></i><i></i></div>
{{ this.objectNodes }}
`;
class AES70BlockChildren extends TemplateComponent.fromString(template) {
  constructor() {
    super();
    this._nodeCache = new WeakMap();
  }

  createChildComponent(roleName, o) {
    let node;

    if (!this._nodeCache.has(o)) {
      this._nodeCache.set(o, node = createChildComponent(roleName, o));
    } else {
      node = this._nodeCache.get(o);
    }

    return node;
  }

  getHostBindings() {
    return [
      {
        src: '/',
        name: 'objectNodes',
        readonly: true,
        sync: true,
        transformReceive: (a) => {
          const [ block, roleMap ] = a;
          let nodes = [];

          roleMap.forEach((o, roleName) => {
            nodes.push(this.createChildComponent(roleName, o));
          });

          return nodes;
        },
      },
    ];
  }
}

customElements.define('aes70-block-children', AES70BlockChildren);
