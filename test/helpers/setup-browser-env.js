import blobPolyfill from 'blob-polyfill';
import browserEnv from 'browser-env';
import enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

const { Blob, URL } = blobPolyfill;

browserEnv();

window.Blob = Blob;
window.URL = URL;

enzyme.configure({
  adapter: new Adapter(),
});
