import { getBackendValue, DynamicValue, TemplateComponent, switchMap, map, fromSubscription, resolve } from '../../AWML/src/index.pure.js';
import { callUnsubscribe, classIDToString } from '../utils.js';
import { createObjectControlComponent } from '../object_controls.js';
import { createObjectDetailComponent } from '../object_details.js';

const docsLink = 'http://docs.deuso.de/AES70-OCC/Control Classes/';
const template = `
<awml-prefix src="local:selected" transform-receive="v=>v.prefix"></awml-prefix>
<div class=head %if={{ this.path }}>
  <aux-icon class=icon %bind={{ this.IconBind }}></aux-icon>
  <aux-label class=role %bind={{ this.RoleBind }}></aux-label>
  <aux-label class=classid %bind={{ this.ClassIDBind }}></aux-label>
  <aux-label class=classname %bind={{ this.ClassNameBind }}></aux-label>
  <aux-marquee class=path speed=10 pause=2000 label={{ this.path }}></aux-marquee>
  <a href={{ this.href }} target=_blank class=docs><aux-icon icon=book></aux-icon></a>
</div>
{{ this.detailsContent }}
<div class=control #control>{{ this.controlContent }}</div>
<div class=noselect %if={{ !this.path }}>Select An Object From The List</div>
`

const Selected = getBackendValue('local:selected');

const ObjectAndSelected = switchMap(Selected, (selected) => {
  const b = selected.prefix
    ? getBackendValue(selected.prefix)
    : DynamicValue.fromConstant(null);

  return map(b, function(o) {
    return [ o, selected ];
  });
});

const DetailComponent = resolve(ObjectAndSelected, async ([ o, selected ]) => {
  if (!o)
    return null;

  const element = await createObjectDetailComponent(o);

  if (!element)
    return null;

  element.classList.add('details');

  element.setAttribute('prefix', selected.prefix);

  return element;
});

const ControlComponent = resolve(ObjectAndSelected, async ([ o, selected ]) => {
  if (!o)
    return null;

  const element = await createObjectControlComponent(o);

  if (!element)
    return null;

  element.setAttribute('prefix', selected.prefix);

  return element;
});

class AES70Details extends TemplateComponent.fromString(template) {
  static getHostBindings() {
    return [
      {
        backendValue: ObjectAndSelected,
        name: 'href',
        sync: true,
        readonly: true,
        transformReceive: function ([ o, selected ]) {
          return o ? docsLink + o.ClassName + '.html' : null;
        },
      },
      {
        backendValue: Selected,
        readonly: true,
        sync: true,
        name: 'path',
        transformReceive: function (selected) {
          if (selected && selected.prefix && selected.prefix.length) {
            return selected.prefix.replace(/\:\//g, ' / ').replace(/\//g, ' / ');
          } else {
            return '';
          }
        },
      },
      {
        backendValue: DetailComponent,
        name: 'detailsContent',
        readonly: true,
        sync: true,
      },
      {
        backendValue: ControlComponent,
        name: 'controlContent',
        readonly: true,
        sync: true,
      },
      {
        backendValue: Selected,
        readonly: true,
        name: 'selectedClassName',
        transformReceive: (selected) => selected.type,
      }
    ];
  }

  awmlCreateBinding(name, options) {
    if (name === 'selectedClassName') {
      return fromSubscription(null, (value) => {
        this.classList.remove('object', 'block', 'device');
        this.classList.add(value);
      });
    }

    return super.awmlCreateBinding(name, options);
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
