// external dependencies
import beautify from 'cssbeautify';
import Stylis from 'stylis';

// constants
import {BEAUTIFY_OPTIONS} from './constants';

/**
 * @function getProcessedStyles
 *
 * @description
 * get the styles processed by stylis
 *
 * @param {string} rawStyle the style to process
 * @param {Object} props the props passed to the component
 * @param {boolean} props.isCompressed is compressed CSS output requested
 * @param {boolean} props.isPrefixed is vendor-prefixed CSS requested
 * @returns {string} the processed styles
 */
export const getProcessedStyles = (rawStyle, {isCompressed, isPrefixed}) =>
  new Stylis({
    compress: isCompressed,
    global: false,
    keyframe: false,
    prefix: isPrefixed
  })('', rawStyle);

/**
 * @function getRenderedStyles
 *
 * @description
 * get the styles rendered in the HTML tag
 *
 * @param {string} rawStyle the style to process
 * @param {Object} props the props passed to the component
 * @param {boolean} props.isMinified is minified CSS output requested
 * @returns {string} the styles to use in the rendered tag
 */
export const getRenderedStyles = (rawStyle, props) =>
  props.isMinified
    ? getProcessedStyles(rawStyle, props)
    : beautify(getProcessedStyles(rawStyle, props), BEAUTIFY_OPTIONS);
