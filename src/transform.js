// external dependencies
import compose from 'lodash/fp/compose';
import isUndefined from 'lodash/isUndefined';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

// constants
import {DEFAULT_AUTOPREFIXER_OPTIONS} from './constants';

/**
 * @function getAutoprefixer
 *
 * @description
 * Function that returns an autoprefixer instance configured with the provided options.
 * Memoized for better performance
 *
 * @param {object} options
 * @returns {object}
 */
export const getAutoprefixer = (() => {
  const cache = {
    options: null,
    postcss: null
  };

  return (autoprefixerOptions) => {
    if (cache.postcss && cache.options === autoprefixerOptions) {
      return cache.postcss;
    }

    cache.options = autoprefixerOptions;

    return (cache.postcss = postcss([autoprefixer(autoprefixerOptions)]));
  };
})();

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
  return cssText
    .trim()
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
 * @param {object} autoprefixerOptions
 * @returns {string}
 */
export const prefixCss = (cssText, autoprefixerOptions) => {
  return getAutoprefixer(autoprefixerOptions).process(cssText).css;
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
 * @param {object} autoprefixerOptions=DEFAULT_AUTOPREFIXER_OPTIONS
 * @returns {string}
 */
export const getTransformedCss = (
  cssText,
  doNotPrefix = false,
  isMinified = false,
  autoprefixerOptions = DEFAULT_AUTOPREFIXER_OPTIONS
) => {
  if (!isMinified) {
    return doNotPrefix ? cssText : prefixCss(cssText, autoprefixerOptions);
  }

  return doNotPrefix ? minify(cssText) : prefixAndMinifyCss(cssText, autoprefixerOptions);
};
