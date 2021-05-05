import { getBackendValue, TemplateComponent, switchMap, DynamicValue, fromSubscription } from '../../AWML/src/index.pure.js';
import { callUnsubscribe, classIDToString } from '../utils.js';
import { findTemplateDetails, findTemplateControl } from '../template_components.js';

const docsLink = 'http://docs.deuso.de/AES70-OCC/Control Classes/';
const template = `
<awml-prefix src="local:selected"></awml-prefix>
<div class=head %if={{ this.path }}>
  <aux-icon class=icon %bind={{ this.IconBind }}></aux-icon>
  <aux-label class=role %bind={{ this.RoleBind }}></aux-label>
  <aux-label class=classid %bind={{ this.ClassIDBind }}></aux-label>
  <aux-label class=classname %bind={{ this.ClassNameBind }}></aux-label>
  <aux-marquee class=path speed=10 pause=2000 label={{ this.path }}></aux-marquee>
  <a href={{ this.href }} target=_blank class=docs><aux-icon icon=book></aux-icon></a>
</div>
<div class=details #details>{{ this.detailsContent }}</div>
<div class=control #control>{{ this.controlContent }}</div>
<div class=noselect %if={{ !this.path }}>Select An Object From The List</div>
`

const Selected = getBackendValue('local:selected');

const ObjectIfSelected = switchMap(Selected, (prefix) => {
  if (!prefix) {
    return DynamicValue.fromConstant(null);
  }

  const b = getBackendValue(prefix);

  const result = fromSubscription(
    (cb) => b.subscribe(cb),
    function(value) { this._updateValue(value); }
  );
  result.set(null);
  return result;
});

class AES70Details extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return [
      {
        backendValue: ObjectIfSelected,
        name: 'href',
        sync: true,
        readonly: true,
        transformReceive: function (o) {
          return o ? docsLink + o.ClassName + '.html' : null;
        },
      },
      {
        backendValue: Selected,
        readonly: true,
        sync: true,
        name: 'path',
        transformReceive: function (path) {
          if (path && path.length) {
            return path.replace(/\:\//g, ' :/ ').replace(/\//g, ' / ');
          } else {
            return '';
          }
        },
      },
      {
        backendValue: ObjectIfSelected,
        name: 'detailsContent',
        readonly: true,
        sync: true,
        transformReceive: function (o) {
          if (!o)
            return null;

          const tagName = findTemplateDetails(o);

          return tagName ? document.createElement(tagName) : null;
        },
      },
      {
        backendValue: ObjectIfSelected,
        name: 'controlContent',
        readonly: true,
        sync: true,
        transformReceive: function (o) {
          if (!o)
            return null;

          const tagName = findTemplateControl(o);

          return tagName ? document.createElement(tagName) : null;
        },
      }
    ];
  }

  constructor() {
    super();

    this.IconBind = [{ src: '', name: 'icon',
      transformReceive: v=>v.ClassName.toLowerCase(), }];
    this.RoleBind = [{ src: '/Role', name: 'label' }];
    this.ClassIDBind = [{ src: '/ClassID', name: 'label',
      transformReceive: classIDToString, }];
    this.ClassNameBind = [{ src: '', name: 'label',
      transformReceive: v=>v.ClassName }];
  }
}

customElements.define('aes70-details', AES70Details);
