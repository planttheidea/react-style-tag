// external dependencies
import compose from 'lodash/fp/compose';
import isUndefined from 'lodash/isUndefined';

// constants
import {
  PREFIXER
} from './constants';

/**
 * @function getCoalescedPropsValue
 *
 * @description
 * return the propsValue if it exists, else return the defaultValue
 *
 * @param {boolean} propsValue
 * @param {boolean} defaultValue
 * @returns {boolean}
 */
export const getCoalescedPropsValue = (propsValue, defaultValue) => {
  return isUndefined(propsValue) ? defaultValue : propsValue;
};

/**
 * @function minify
 *
 * @description
 * return the minified string css
 *
 * @param {string} cssText
 * @returns {string}
 */
export const minify = (cssText) => {
  return cssText.trim()
    .replace(/\/\*[\s\S]+?\*\//g, '')
    .replace(/[\n\r]/g, '')
    .replace(/\s*([:;,{}])\s*/g, '$1')
    .replace(/\s+/g, ' ')
    .replace(/;}/g, '}')
    .replace(/\s+(!important)/g, '$1')
    .replace(/#([a-fA-F0-9])\1([a-fA-F0-9])\2([a-fA-F0-9])\3(?![a-fA-F0-9])/g, '#$1$2$3')
    .replace(/(Microsoft[^;}]*)#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])(?![a-fA-F0-9])/g, '$1#$2$2$3$3$4$4')
    .replace(/\b(\d+[a-z]{2}) \1 \1 \1/gi, '$1')
    .replace(/\b(\d+[a-z]{2}) (\d+[a-z]{2}) \1 \2/gi, '$1 $2')
    .replace(/([\s|:])[0]+px/g, '$10');
};

/**
 * @function prefixCss
 *
 * @description
 * return the css after running through autoprefixer
 *
 * @param {string} cssText
 * @returns {string}
 */
export const prefixCss = (cssText) => {
  return PREFIXER.process(cssText).css;
};

/**
 * @function prefixAndMinifyCss
 *
 * @description
 * return the css after running through autoprefixer and minify
 *
 * @param {string} cssText
 * @returns {string}
 */
export const prefixAndMinifyCss = compose(minify, prefixCss);

/**
 * @function getTransformedCss
 *
 * @description
 * get the (if applicable) prefixed and minified css based on the
 * original cssText
 *
 * @param {string} cssText
 * @param {boolean} doNotPrefix=false
 * @param {boolean} isMinified=false
 * @returns {string}
 */
export const getTransformedCss = (cssText, doNotPrefix = false, isMinified = false) => {
  if (!isMinified) {
    return doNotPrefix ? cssText : prefixCss(cssText);
  }

  const transformCss = doNotPrefix ? minify : prefixAndMinifyCss;

  return transformCss(cssText);
};
