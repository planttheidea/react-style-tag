# react-style-tag CHANGELOG

## 2.0.1

* README fixes

## 2.0.0

* Rewritten using `stylis` for both footprint and performance

#### BREAKING CHANGES

* `Style` is now a named export instead of the default export
* Names of props have changed
  * `doNotPrefix` => `isPrefixed` (but inverse, naturally)

#### NEW FEATURES

* CSS now offers nesting via use of `&` reference, for simplified declaration of styles
* `isCompressed` prop will enable aggressive CSS compression

## 1.4.1

* Use `prop-types` package instead of `React.PropTypes` for React 16 support
* Move `react` to `peerDependencies`
* Remove `moize` dependency for simple memoization

## 1.4.0

* Add `autoprefixerOptions` as both instance and global option (provides custom configuration of interal prefixing via `autoprefixer`) - thanks @oasisvali

## 1.3.2

* Add complete test coverage

## 1.3.1

* Support SSR by not assigning blob support until componentWillMount (will attempt until `hasBlobSupport` is true, so both server and client calls will run)

## 1.3.0

* Add caching to prevent duplicate tags from being added to head

## 1.2.0

* Add `setGlobalOptions` method to apply props globally for all instanes

## 1.1.0

* Add `hasSourceMap` prop, which will render a `<link>` via `Blob` rather than a `<style>` tag to have better source mapping

## 1.0.4

* Fix `doNotPrefix` not moving the `<style>` tag to the bottom of `document.head`

## 1.0.0 - 1.0.3

* Initial commit, with various README fixes
