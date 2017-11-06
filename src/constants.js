/**
 * @constant {Object} DEFAULT_AUTOPREFIXER_OPTIONS
 */
export const DEFAULT_AUTOPREFIXER_OPTIONS = {
  remove: false
};

/**
 * @constant {Object} REACT_STYLE_TAG_GLOBAL_PROPERTIES
 */
export const DEFAULT_REACT_STYLE_TAG_GLOBAL_PROPERTIES = {
  doNotPrefix: false,
  hasSourceMap: false,
  isMinified: false,
  autoprefixerOptions: DEFAULT_AUTOPREFIXER_OPTIONS
};

/**
 * @constant {string} NO_BLOB_SUPPORT_ERROR
 * @default
 */
export const NO_BLOB_SUPPORT_ERROR = `
To support sourcemaps for react-style-tag you need Blob support, and the browser you are using does not currently
support it. Please import the included polyfill at 'react-style-tag/blob-polyfill.js'.
`.replace(/\r?\n|\r/, '');

/**
 * @constant {string} ONLY_TEXT_ERROR
 * @default
 */
export const ONLY_TEXT_ERROR = 'The only type of child that can be used in the <Style/> tag is text.';
