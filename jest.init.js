require('core-js');

// Remove existing Blob implementation, as it is incomplete from `jsdom`
window.Blob = undefined;

const { Blob, File, FileReader } = require('blob-polyfill');
window.Blob = Blob;
window.File = File;
window.FileReader = FileReader;
