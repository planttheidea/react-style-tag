// external dependencies
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

/**
 * @constant {Object} REACT_STYLE_TAG_GLOBAL_PROPERTIES
 */
export const DEFAULT_REACT_STYLE_TAG_GLOBAL_PROPERTIES = {
  doNotPrefix: false,
  hasSourceMap: false,
  isMinified: false
};

/**
 * @constant {string} NO_BLOB_SUPPORT_ERROR
 * @default
 */
export const NO_BLOB_SUPPORT_ERROR = (`
To support sourcemaps for react-style-tag you need Blob support, and the browser you are using does not currently
support it. Please import the included polyfill at 'react-style-tag/blob-polyfill.js'.
`).replace(/\r?\n|\r/, '');

/**
 * @constant {string} ONLY_TEXT_ERROR
 * @default
 */
export const ONLY_TEXT_ERROR = 'The only type of child that can be used in the <Style/> tag is text.';

/**
 * @constants {Object} PREFIXER
 */
export const PREFIXER = postcss([
  autoprefixer({
    remove: false
  })
]);
