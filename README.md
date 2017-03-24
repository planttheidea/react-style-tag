# react-style-tag

Write styles declaratively in React

#### Table of contents
* [Installation](#installation)
* [Usage](#usage)
* [Implementation](#implementation)
* [Summary](#summary)
* [Scoped Styles](#scoped-styles)
* [Props](#props)
* [Global Options](#global-options)
* [Additional webpack configuration requirements](#additional-webpack-configuration-requirements)
* [Development](#development)
* [Todo](#todo)

#### Installation

```
$ npm i react-style-tag --save
```

#### Usage

```javascript
// ES2015
import Style from 'react-style-tag';

// CommonJS
const Style = require('react-style-tag').default;
```

#### Implementation

```javascript
import React, {
  Component
} from 'react';

import Style from 'react-style-tag';

class App extends Component {
  render() [
    return (
      <div>
        <h1 className="foo">
          Bar
        </h1>

        <Style>{`
          .foo {
            color: red;
          }
        `}</Style>
      </div>
    );
  }
}
```

#### Summary

`react-style-tag` creates a React component that will inject a `<style>` tag into the document's head with the styles that you pass as the text content of the tag. Notice above that the styles are wrapped in ``{` ``and`` `}``, which create a template literal string. Internally, `react-style-tag` parses this text and applies all necessary prefixes via [`autoprefixer`](https://github.com/postcss/autoprefixer). All valid CSS is able to be used (`@media`, `@font-face`, you name it).

The style tag that is injected into the head will be automatically mounted whenever the component it is rendered in is mounted, and will be automatically unmounted whenever the component it is rendered in is unmounted.

#### Scoped Styles

There is an additional utility provided that can help to scope your styles in the vein of [CSS Modules](https://github.com/css-modules/css-modules), and this is `hashKeys`. This function accepts an array of keys to hash, and returns a map of the keys to their hashed values.

```javascript
import Style, {
  hashKeys
} from 'react-style-tag';

const classNamesToHash = ['foo', 'bar'];
const {
  foo,
  bar
} = hashKeys(classNamesToHash);

class App extends Component {
  render() {
    return (
      <div>
        <div className={foo}>
          My text is red due to the scoped style of foo.
        </div>

        <div className={bar}>
          My text is green due to the scoped style of bar.
        </div>

        <div className="baz">
          My text is blue due to the global style of baz.
        </div>

        <Style>{`
          .${foo} {
            color: red;
          }

          .${bar} {
            color: green;
          }

          .baz {
            color: blue;
          }
        `}</Style>
      </div>
    );
  }
}
```

Notice you can easily mix both scoped and global styles, and for mental mapping the scoped styles all follow the format `scoped__{key}__{hash}`, for example `scoped__test__3769397038`. The hashes are uniquely based on each execution of `hashKeys`, so the implementation can either be Component-specific (if defined outside the class) or instance-specific (if defined inside the class, on `componentDidMount` for example).

#### Props

Naturally you can pass all standard attributes (`id`, `name`, etc.) and they will be passed to the `<style>` tag, but there are a couple of additional props that are specific to the component.

**doNotPrefix** *boolean, defaults to false*

If set to `true`, it will prevent autoprefixer from processing the CSS and just render whatever text you pass it.

**hasSourceMap** *boolean, defaults to false*

If set to `true`, it will render a `<link>` tag instead of a `<style>` tag, which allows easy source referencing in browser DevTools. This is similar to the way that webpack handles its `style-loader`.

The use of sourcemaps require the use of `Blob`, which is supported in IE10+, Safari 6.1+, and all other modern browsers (Chrome, Firefox, etc.). If you browser does not support `Blob` and you want to use sourcemaps, there is an included polyfill which you will need to import separately:

```javascript
import 'react-script-tag/blob-polyfill';
```

Make sure this import occurs prior to the import of `react-style-tag`. Naturally, this is only necessary if you are not using an alternative polyfill.

**isMinified** *boolean, defaults to false*

If set to `true`, it will minify the rendered CSS text. A possible implementation for this would be something like:

```javascript
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

<Style isMinified={IS_PRODUCTION}>
  .test {
    display: block;
  }
</Style>
```

This would result in:

```javascript
<style>.test{display:block}</style>
```

### Global Options

All of the props available are also available as global options for all instances that can be set with the `setGlobalOptions` method:

```javascript
import Style from 'react-style-tag';

Style.setGlobalOptions({
  doNotPrefix: true,
  hasSourceMap: true,
  isMinified: true
});
```

All default values are the same as those available for props. A common use case would be something like:

```javascript
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

Style.setGlobalOptions({
  hasSourceMap: !IS_PRODUCTION,
  isMinified: IS_PRODUCTION
});

<Style>
  .test {
    display: block;
  }
</Style>
```

### Additional webpack configuration requirements

`react-style-tag` makes use of PostCSS, which has server-side methods that are not used. As such, it expects the `fs` module to be present, which means you will need to stub it. In your webpack config, add the following object top-level:

```javascript
node: {
  fs: 'empty'
}
```

Additionally, PostCSS makes heavy use of JSON internally, so you will likely need to add `json-loader` to your list of loaders.

### Development

Standard stuff, clone the repo and `npm i` to get the dependencies. npm scripts available:
* `dev` => runs the webpack dev server for the playground
* `lint` => runs ESLint against files in the `src` folder
* `prepublish` => if in publish, runs `prepublish:compileh`
* `prepublish:compileh` => runs the `lint` and `transpile` scripts
* `transpile` => runs Babel against files in `src` to files in `lib`

#### Todo
* Add tests with AVA / Enzyme
