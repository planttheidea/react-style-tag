// Remove existing Blob polyfill
window.Blob = undefined;

const blobPolyfill = require('blob-polyfill');
require('core-js');

window.Blob = blobPolyfill.Blob;
window.File = blobPolyfill.File;
window.FileReader = blobPolyfill.FileReader;

Object.defineProperty(window, 'URL', {
  value: URL,
});
