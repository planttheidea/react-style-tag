import blobPolyfill from 'blob-polyfill';
import browserEnv from 'browser-env';
import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const {Blob, URL} = blobPolyfill;

browserEnv();

window.Blob = Blob;
window.URL = URL;

enzyme.configure({
  adapter: new Adapter()
});
