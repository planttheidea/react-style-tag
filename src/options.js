// constants
import {IS_PRODUCTION} from './constants';

/**
 * @constant {Object} GLOBAL_OPTIONS the global options to apply as fallback to local props
 */
export const GLOBAL_OPTIONS = {
  hasSourceMap: !IS_PRODUCTION,
  isCompressed: true,
  isMinified: IS_PRODUCTION,
  isPrefixed: true
};

/**
 * @function getCoalescedOption
 *
 * @description
 * get the option either from props if it exists, or globally
 *
 * @param {Object} props the props to the specific instance
 * @param {string} option the option to coalesce
 * @returns {boolean} the coalesced option
 */
export const getCoalescedOption = (props, option) =>
  typeof props[option] === 'boolean' ? props[option] : GLOBAL_OPTIONS[option];

/**
 * @function setGlobalOptions
 *
 * @description
 * set the options passed to be global
 *
 * @param {Object} options the objects to apply globally
 * @returns {void}
 */
export const setGlobalOptions = (options) =>
  Object.keys(options).forEach(
    (option) =>
      GLOBAL_OPTIONS.hasOwnProperty(option) &&
      typeof options[option] === 'boolean' &&
      (GLOBAL_OPTIONS[option] = options[option]),
  );
