const URL = window.URL || window.webkitURL;
const HAS_BLOB_SUPPORT = !!(window.Blob && typeof window.Blob === 'function' && URL.createObjectURL) && ((win) => {
    try {
      new win.Blob;

      return true;
    } catch (exception) {
      return false;
    }
  })(window);
const NO_BLOB_SUPPORT_ERROR = (`
To support sourcemaps for react-style-tag you need Blob support, and the browser you are using does not currently 
support it. Please import the included polyfill at 'react-style-tag/blob-polyfill.js'.
`).replace(/\r?\n|\r/, '');
const ONLY_TEXT_ERROR = 'The only type of child that can be used in the <Style/> tag is text.';

export {HAS_BLOB_SUPPORT};
export {NO_BLOB_SUPPORT_ERROR};
export {ONLY_TEXT_ERROR};
