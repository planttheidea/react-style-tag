// test
import test from 'ava';
import sinon from 'sinon';

// src
import * as utils from 'src/utils';

test.serial('if getHasBlobSupport returns false when there is no window', (t) => {
  const currentWindow = global.window;

  global.window = undefined;

  const result = utils.getHasBlobSupport();

  global.window = currentWindow;

  t.false(result);
});

test.serial('if getHasBlobSupport returns false when there is no Blob on the window', (t) => {
  global.window = {
    URL: {}
  };

  const result = utils.getHasBlobSupport();

  t.false(result);

  global.window.URL = undefined;
});

test.serial('if getHasBlobSupport returns false when there is no createObjectURL on the URL object on the window', (t) => {
  global.window = {
    Blob: sinon.spy(),
    URL: {}
  };

  const result = utils.getHasBlobSupport();

  t.false(result);

  global.window.Blob = undefined;
  global.window.URL = undefined;
});

test.serial('if getHasBlobSupport returns false when creation of a new Blob throws an error', (t) => {
  global.window = {
    Blob: sinon.stub().throws('foo'),
    URL: {
      createObjectURL: sinon.spy()
    }
  };

  const result = utils.getHasBlobSupport();

  t.false(result);

  global.window.Blob = undefined;
  global.window.URL = undefined;
});

test.serial('if getHasBlobSupport returns true when creation of a new Blob succeeds', (t) => {
  global.window = {
    Blob: sinon.stub(),
    URL: {
      createObjectURL: sinon.spy()
    }
  };

  const result = utils.getHasBlobSupport();

  t.true(result);

  global.window.Blob = undefined;
  global.window.URL = undefined;
});

test.serial('if getUrl returns an empty object when window is undefined', (t) => {
  const currentWindow = global.window;

  global.window = undefined;

  const result = utils.getUrl();

  t.deepEqual(result, {});

  global.window = currentWindow;
});

test.serial('if getUrl returns the URL object when window has it', (t) => {
  global.window = {
    URL: {}
  };

  const result = utils.getUrl();

  t.deepEqual(result, global.window.URL);

  global.window.URL = undefined;
});

test.serial('if getUrl returns the webkitURL object when window has it', (t) => {
  global.window = {
    webkitURL: {}
  };

  const result = utils.getUrl();

  t.deepEqual(result, global.window.webkitURL);

  global.window.webkitURL = undefined;
});

test('if throwErrorIfIsNotText throws an error when parameter is not a string', (t) => {
  const value = {};

  t.throws(() => {
    utils.throwErrorIfIsNotText(value);
  }, TypeError);
});

test('if throwErrorIfIsNotText does not throw an error when parameter is a string', (t) => {
  const value = 'foo';

  t.notThrows(() => {
    utils.throwErrorIfIsNotText(value);
  }, TypeError);
});
