import { PrefixComponentBase } from '../../AWML/src/components/prefix_component_base.js';
import { map } from '../../AWML/src/index.pure.js';
import { callUnsubscribe, forEachAsync } from '../utils.js';

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

class AES70BlockChildren extends PrefixComponentBase {
  connectedCallback() {
    super.connectedCallback();
    this.style.display = null;
    this.setAttribute('src', '/');
  }

  _subscribe() {
    const backendValue = this._getBackendValue();
    
    if (backendValue === null) return null;

    this._backendValue = backendValue;

    const children = map(backendValue, (a) => {
      const [ block, roleMap ] = a;

      return Array.from(roleMap.keys());
    });

    const subs = forEachAsync(children, (roleName) => {
      const [ block, roleMap ] = backendValue.value;

      const o = roleMap.get(roleName);

      const component = createChildComponent(roleName, o);

      this.appendChild(component);

      return () => {
        component.remove();
      };
    });

    return () => {
      if (this._backendValue === null) return;
      this._backendValue = null;
      callUnsubscribe(subs);
    };
  }
}

customElements.define('aes70-block-children', AES70BlockChildren);
