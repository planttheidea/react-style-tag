// test
import test from 'ava';
import sinon from 'sinon';

// src
import * as transform from 'src/transform';
import * as constants from 'src/constants';

test('if getCoalescedPropsValue returns props value when defined', (t) => {
  const propsValue = {};
  const defaultValue = {};

  const result = transform.getCoalescedPropsValue(propsValue, defaultValue);

  t.is(result, propsValue);
  t.not(result, defaultValue);
});

test('if getCoalescedPropsValue returns default value when propsValue is not defined', (t) => {
  const propsValue = undefined;
  const defaultValue = {};

  const result = transform.getCoalescedPropsValue(propsValue, defaultValue);

  t.not(result, propsValue);
  t.is(result, defaultValue);
});

test('if getTransformedCss returns the cssText if doNotPrefix is true and isMinified is false', (t) => {
  const cssText = '.foo { display: flex; }';
  const doNotPrefix = true;
  const isMinified = false;

  const result = transform.getTransformedCss(cssText, doNotPrefix, isMinified);

  t.is(result, cssText);
});

test.serial('if getTransformedCss returns the prefixed cssText if doNotPrefix is false and isMinified is false', (t) => {
  const cssText = '.foo { display: flex; }';
  const doNotPrefix = false;
  const isMinified = false;

  const result = transform.getTransformedCss(cssText, doNotPrefix, isMinified);

  t.not(result, cssText);
  t.is(result, transform.prefixCss(cssText, constants.DEFAULT_AUTOPREFIXER_OPTS));
});

test.serial('if getTransformedCss returns the minified cssText if doNotPrefix is true and isMinified is true', (t) => {
  const cssText = '.foo { display: flex; }';
  const doNotPrefix = true;
  const isMinified = true;

  const result = transform.getTransformedCss(cssText, doNotPrefix, isMinified);

  t.not(result, cssText);
  t.is(result, transform.minify(cssText));
});

test.serial('if getTransformedCss returns the prefixed and minified cssText if doNotPrefix is false and isMinified is true', (t) => {
  const cssText = '.foo { display: flex; }';
  const doNotPrefix = false;
  const isMinified = true;

  const result = transform.getTransformedCss(cssText, doNotPrefix, isMinified);

  t.not(result, cssText);
  t.is(result, transform.prefixAndMinifyCss(cssText, constants.DEFAULT_AUTOPREFIXER_OPTS));
});

test.serial('if getTransformedCss uses autoPrefixerOpts for prefixing', (t) => {
  const cssText = '.foo { display: flex; }';
  const doNotPrefix = false;
  const isMinified = false;
  const autoPrefixerOpts = {grid: true, flexbox: false};
  const result = transform.getTransformedCss(cssText, doNotPrefix, isMinified, autoPrefixerOpts);

  t.not(result, transform.prefixCss(cssText, constants.DEFAULT_AUTOPREFIXER_OPTS));
  t.is(result, transform.prefixCss(cssText, autoPrefixerOpts));
});

test('if minify will minify the css text', (t) => {
  const cssText = `
.foo {
  display: block;
  padding: 15px;
}

#bar {
  color: red;
}
  `;

  const result = transform.minify(cssText);
  const expectedResult = '.foo{display:block;padding:15px}#bar{color:red}';

  t.is(result, expectedResult);
});

test.serial('if prefixCss calls getAutoPrefixer to generate an autoPrefixer and uses it', (t) => {
  // since getAutoPrefixer is memoized, lets grab the default autoprefixer
  const autoPrefixerDefault = transform.getAutoPrefixer(constants.DEFAULT_AUTOPREFIXER_OPTS);

  const cssText = '.foo { display: flex; }';

  const stub = sinon.stub(autoPrefixerDefault, 'process').returns({
    css: 'foo'
  });

  transform.prefixCss(cssText, constants.DEFAULT_AUTOPREFIXER_OPTS);

  t.true(stub.calledOnce);
  t.true(stub.calledWithExactly(cssText));

  stub.restore();
});
