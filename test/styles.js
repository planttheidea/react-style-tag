// test
import test from 'ava';
import beautify from 'cssbeautify';
import Stylis from 'stylis';

// src
import * as styles from 'src/styles';
import {BEAUTIFY_OPTIONS} from 'src/constants';

test('if getProcessedStyles will return the Stylis-processed styles with the options passed', (t) => {
  const rawStyle = '.foo { display: flex; }';
  const options = {
    isCompressed: false,
    isPrefixed: true
  };

  const result = styles.getProcessedStyles(rawStyle, options);

  t.is(
    result,
    new Stylis({
      compress: options.isCompressed,
      global: false,
      keyframe: false,
      prefix: options.isPrefixed
    })('', rawStyle)
  );
});

test('if getRenderedStyles returns the processed styles when minified', (t) => {
  const rawStyle = '.foo { display: flex; }';
  const options = {
    isCompressed: false,
    isMinified: true,
    isPrefixed: true
  };

  const result = styles.getRenderedStyles(rawStyle, options);

  t.is(result, styles.getProcessedStyles(rawStyle, options));
});

test('if getRenderedStyles returns the beautified processed styles when not minified', (t) => {
  const rawStyle = '.foo { display: flex; }';
  const options = {
    isCompressed: false,
    isMinified: false,
    isPrefixed: true
  };

  const result = styles.getRenderedStyles(rawStyle, options);

  t.is(result, beautify(styles.getProcessedStyles(rawStyle, options), BEAUTIFY_OPTIONS));
});
