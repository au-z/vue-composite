# composite-ui
> A project sandbox for developing and testing custom tools enabling web-components to be created and shared for composite UI structuring.

## Contents
1. **vue-composite**: A vue plugin to enable the framework application to load components dynamically
from other services.
2. **vue-composite-loader**: (coming soon) A webpack plugin that transforms .vue files to vue-composite modules.

## Rationale
In a web-service oriented architecture, composition and re-use of components is a necessity for autonomous feature
releases and integration of new features. Often, new features necessitate change at multiple layers of the
technical stack i.e. changes to the db, changes to internal services, and changes to the UI. Too frequently, these changes
require x-team knowledge sharing and collaboration, hampering an organization's ability to rapidly respond to new features.

## Dependencies

### Client:
* **Required**
  * [vue.js](https://github.com/vuejs/vue)
  * [vue-custom-element](https://github.com/karol-f/vue-custom-element)

* **Optional**
  * [vuex](https://github/vuejs/vuex)

### Server:
* **Required** (none)

* **Optional**
  * [webpack](https://github.com/webpack/webpack)
  * [vue-loader](https://github.com/vuejs/vue-loader)

## Installation
> These tools are not yet available on the npm package registry yet. For now, please copy them from the `/lib` directory

## Getting Started

1. Include the `lib/vue-composite/` Vue plugin in your framework application:
```javascript
import VueComposite from 'path/to/vue-composite/vue-composite';
Vue.use(VueComposite);
// (optional) Make vue ignore your composite-component
Vue.config.ignoredElements = ['composite-component'];
```

2. Publish a vue-composite module at your service endpoint:
```javascript
// exposed example module (composite-component.js)
(function() {
  return {
    name: 'composite-component', // Required. Must include a '-' character.
    data() {
      return {msg: 'Hello World!'},
    },
    template: `<div>{{msg}}</div>`,
  };
})();
```

3. Register the composite-component in your framework application:
```html
<div class="parent-component">
  <composite-component></composite-component>
</div>
```
4. Request the component dynamically from your parent-component:
```javascript
const parentComponent = new Vue({
  name: 'parent-component',
  created() {
    this.$compose('https://myremoteservice.com/path/to/composite-component.js');
  },
});
```

## Development Setup

``` bash
npm install
npm run dev
```