// test
import test from 'ava';
import sinon from 'sinon';

// src
import * as blob from 'src/blob';

test.serial('if getUrl will return an empty object when window is undefined', (t) => {
  const win = global.window;

  global.window = undefined;

  const result = blob.getUrl();

  t.deepEqual(result, {});

  global.window = win;

  blob.getUrl.reset();
});

test.serial('if getUrl will return the URL when window is defined and so is window.URL', (t) => {
  const win = global.window;
  const URL = {
    URL: 'URL'
  };
  const webkitURL = {
    webkitURL: 'webkitURL'
  };

  global.window = {
    URL,
    webkitURL
  };

  const result = blob.getUrl();

  t.is(result, URL);

  global.window = win;

  blob.getUrl.reset();
});

test.serial(
  'if getUrl will return the webkitURL when window is defined and so is window.webkitURL but window.URL is not',
  (t) => {
    const win = global.window;
    const webkitURL = {
      webkitURL: 'webkitURL'
    };

    global.window = {
      webkitURL
    };

    const result = blob.getUrl();

    t.is(result, webkitURL);

    global.window = win;

    blob.getUrl.reset();
  }
);

test.serial('if getHasBlobSupport will return false if window is undefined', (t) => {
  const win = global.window;

  global.window = undefined;

  const result = blob.getHasBlobSupport();

  t.false(result);

  global.window = win;

  blob.getUrl.reset();
});

test.serial('if getHasBlobSupport will return false if window.Blob is not a function', (t) => {
  const win = global.window;

  global.window = {};

  const result = blob.getHasBlobSupport();

  t.false(result);

  global.window = win;

  blob.getUrl.reset();
});

test.serial('if getHasBlobSupport will return false if createObjectURL is not a function', (t) => {
  const win = global.window;

  global.window = {
    URL: {}
  };

  const result = blob.getHasBlobSupport();

  t.false(result);

  global.window = win;

  blob.getUrl.reset();
});

test.serial('if getHasBlobSupport will return false if window.Blob fails', (t) => {
  const win = global.window;

  global.window = {
    Blob() {
      throw new Error('boom');
    },
    URL: {
      createObjectURL() {}
    }
  };

  const result = blob.getHasBlobSupport();

  t.false(result);

  global.window = win;

  blob.getUrl.reset();
});

test.serial('if getHasBlobSupport will return true if window.Blob succeeds', (t) => {
  const win = global.window;

  global.window = {
    Blob() {},
    URL: {
      createObjectURL() {}
    }
  };

  const result = blob.getHasBlobSupport();

  t.true(result);

  global.window = win;

  blob.getUrl.reset();
});

test('if hasBlobSupport returns false when getHasBlobSupport does', (t) => {
  const win = global.window;

  global.window = undefined;

  const result = blob.hasBlobSupport();

  t.false(result);

  global.window = win;

  blob.getUrl.reset();
  blob.hasBlobSupport.reset();
});

test('if hasBlobSupport returns true when getHasBlobSupport does', (t) => {
  const win = global.window;

  global.window = {
    Blob() {},
    URL: {
      createObjectURL() {}
    }
  };

  const result = blob.hasBlobSupport();

  t.true(result);

  global.window = win;

  blob.getUrl.reset();
  blob.hasBlobSupport.reset();
});

test('if getLinkHref will return null when there is no blob support', (t) => {
  const win = global.window;

  global.window = undefined;

  const style = '.foo{display: block;}';

  const result = blob.getLinkHref(style);

  t.is(result, null);

  global.window = win;

  blob.getUrl.reset();
  blob.hasBlobSupport.reset();
});

test.serial('if getLinkHref will return the proper dataURI when there is blob support', (t) => {
  const win = global.window;

  const expectedResult = 'foo';

  const style = '.foo{display: block;}';

  /* eslint-disable prefer-arrow-callback */
  global.window = {
    Blob: sinon
      .stub()
      .onFirstCall()
      .returns(null)
      .callsFake(function() {
        this.value = style;

        return this;
      }),
    URL: {
      createObjectURL: sinon.stub().returns(expectedResult)
    }
  };
  /* eslint-enable */

  const result = blob.getLinkHref(style);

  t.true(window.Blob.calledTwice);
  t.deepEqual(window.Blob.args[1], [[style], {type: 'text/css'}]);

  t.true(window.URL.createObjectURL.calledOnce);
  t.deepEqual(window.URL.createObjectURL.args[0], [new window.Blob([style], {type: 'text/css'})]);

  t.is(result, expectedResult);

  global.window = win;

  blob.getUrl.reset();
  blob.hasBlobSupport.reset();
});

test.serial('if createGetCachedLinkHref will return the link href when it does not exist in cache', (t) => {
  const win = global.window;

  global.window = {
    Blob(values) {
      this.value = values ? values[0] : null;

      return this;
    },
    URL: {
      createObjectURL(fakeBlob) {
        return fakeBlob.value;
      }
    }
  };

  const getCachedLinkHref = blob.createGetCachedLinkHref();

  const style = '.foo{display: block;}';

  const result = getCachedLinkHref(style);

  t.is(result, style);

  global.window = win;

  blob.getUrl.reset();
  blob.hasBlobSupport.reset();
});

test.serial('if createGetCachedLinkHref will return the link href from cache when it exists', (t) => {
  const win = global.window;

  global.window = {
    Blob(values) {
      this.value = values ? values[0] : null;

      return this;
    },
    URL: {
      createObjectURL(fakeBlob) {
        return fakeBlob.value;
      }
    }
  };

  const spy = sinon.spy(global.window, 'Blob');

  const getCachedLinkHref = blob.createGetCachedLinkHref();

  const style = '.foo{display: block;}';

  const result = getCachedLinkHref(style);

  t.is(result, style);

  t.true(spy.called);

  spy.resetHistory();

  getCachedLinkHref(style);
  getCachedLinkHref(style);
  getCachedLinkHref(style);
  getCachedLinkHref(style);
  getCachedLinkHref(style);

  const finalResult = getCachedLinkHref(style);

  t.true(spy.notCalled);
  t.is(finalResult, style);

  global.window = win;

  blob.getUrl.reset();
  blob.hasBlobSupport.reset();
});

test.serial(
  'if createGetCachedLinkHref will return null if the style does not exist, ensuring it is not cached',
  (t) => {
    const win = global.window;

    global.window = {
      Blob(values) {
        this.value = values ? values[0] : null;

        return this;
      },
      URL: {
        createObjectURL(fakeBlob) {
          return fakeBlob.value;
        }
      }
    };

    const spy = sinon.spy(global.window, 'Blob');

    const getCachedLinkHref = blob.createGetCachedLinkHref();

    const style = '';

    const result = getCachedLinkHref(style);

    t.is(result, null);

    global.window = win;

    blob.getUrl.reset();
    blob.hasBlobSupport.reset();
  }
);
