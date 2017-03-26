# react-style-tag CHANGELOG

#### 1.3.2
* Add complete test coverage

#### 1.3.1
* Support SSR by not assigning blob support until componentWillMount (will attempt until `hasBlobSupport` is true, so both server and client calls will run)

#### 1.3.0
* Add caching to prevent duplicate tags from being added to head

#### 1.2.0
* Add `setGlobalOptions` method to apply props globally for all instanes

#### 1.1.0
* Add `hasSourceMap` prop, which will render a `<link>` via `Blob` rather than a `<style>` tag to have better source mapping

#### 1.0.4
* Fix `doNotPrefix` not moving the `<style>` tag to the bottom of `document.head`

#### 1.0.0 - 1.0.3
* Initial commit, with various README fixes
