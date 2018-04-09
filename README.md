# react-style-tag

Write styles declaratively in React

## Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Implementation](#implementation)
* [Summary](#summary)
* [Scoped Styles](#scoped-styles)
* [Props](#props)
  * [hasSourceMap](#hassourcemap)
  * [isCompressed](#iscompressed)
  * [isMinified](#isminified)
  * [isPrefixed](#isprefixed)
* [Global Options](#global-options)
* [Development](#development)

## Installation

```
$ npm i react-style-tag --save
```

## Usage

```javascript
// ES2015
import { Style } from "react-style-tag";

// CommonJS
const Style = require("react-style-tag").Style;
```

## Implementation

```javascript
import React, { Component } from "react";

import { Style } from "react-style-tag";

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

            &:hover {
              background-color: gray;
            }

            @media print {
              color: black;
            }
          }
        `}</Style>
      </div>
    );
  }
}
```

## Summary

`react-style-tag` creates a React component that will inject a `<style>` tag into the document's head with the styles that you pass as the text content of the tag. Notice above that the styles are wrapped in `` {` ``and`` `} ``, which create a template literal string. Internally, `react-style-tag` parses this text and applies all necessary prefixes via [`stylis`](https://github.com/thysultan/stylis.js). All valid CSS is able to be used (`@media`, `@font-face`, you name it), and you can use nesting via the use of the `&` reference to the parent selector.

The style tag that is injected into the head will be automatically mounted whenever the component it is rendered in is mounted, and will be automatically unmounted whenever the component it is rendered in is unmounted.

## Scoped Styles

There is an additional utility provided that can help to scope your styles in the vein of [CSS Modules](https://github.com/css-modules/css-modules), and this is `hashKeys`. This function accepts an array of keys to hash, and returns a map of the keys to their hashed values.

```javascript
import { hashKeys, Style } from "react-style-tag";

const { foo, bar } = hashKeys(["foo", "bar"]);

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

## Props

Naturally you can pass all standard attributes (`id`, `name`, etc.) and they will be passed to the `<style>` tag, but there are a few additional props that are specific to the component.

#### hasSourceMap

_boolean, defaults to false in production, true otherwise_

If set to `true`, it will render a `<link>` tag instead of a `<style>` tag, which allows easy source referencing in browser DevTools. This is similar to the way that webpack handles its `style-loader`.

The use of sourcemaps require the use of `Blob`, which is supported in IE10+, Safari 6.1+, and all other modern browsers (Chrome, Firefox, etc.). If you browser does not support `Blob` and you want to use sourcemaps, you should include a polyfill. Recommended is [`blob-polyfill`](https://www.npmjs.com/package/blob-polyfill).

Make sure this import occurs prior to the import of `react-style-tag` to ensure blob support is present.

#### isCompressed

_boolean, defaults to true_

If set to `false`, it will prevent aggressive compression of the CSS.

#### isMinified

_boolean, defaults to true in production, false otherwise_

If set to `false`, it will pretty-print the rendered CSS text. This can be helpful in development for readability of styles.

#### isPrefixed

_boolean, defaults to true_

If set to `false`, it will prevent `stylis` from applying vendor prefixes to the CSS.

## Global Options

All of the props available are also available as global options for all instances that can be set with the `setGlobalOptions` method:

```javascript
import { setGlobalOptions } from "react-style-tag";

setGlobalOptions({
  isCompressed: false,
  hasSourceMap: true,
  isMinified: true,
  isPrefixed: false
});
```

The `setGlobalOptions` method is also available as a static method on the `Style` component:

```javascript
import { Style } from "react-style-tag";

Style.setGlobalOptions({
  isCompressed: false,
  hasSourceMap: true,
  isMinified: true,
  isPrefixed: false
});
```

## Development

Standard stuff, clone the repo and `npm i` to get the dependencies. npm scripts available:

* `build` => run rollup to build `dist` files with NODE_ENV=production
* `dev` => run webpack dev server to run example app / playground
* `dist` => runs `build` and `build:minified`
* `lint` => run ESLint against all files in the `src` folder
* `lint:fix` => runs `lint` with `--fix`
* `prepublish` => runs `prepublish:compile` when publishing
* `prepublish:compile` => run `lint`, `test:coverage`, `transpile:es`, `transpile:lib`, `dist`
* `test` => run AVA test functions with `NODE_ENV=test`
* `test:coverage` => run `test` but with `nyc` for coverage checker
* `test:watch` => run `test`, but with persistent watcher
* `transpile:lib` => run babel against all files in `src` to create files in `lib`
* `transpile:es` => run babel against all files in `src` to create files in `es`, preserving ES2015 modules (for
  [`pkg.module`](https://github.com/rollup/rollup/wiki/pkg.module))
