// external dependencies
import isString from 'lodash/fp/isString';

// constants
import {
  ONLY_TEXT_ERROR
} from './constants';

/**
 * @function getUrl
 *
 * @description
 * get the URL object that is used to createObjectURL
 *
 * @returns {Object} either the window's URL object, or an empty object
 */
export const getUrl = () => {
  return typeof window === 'undefined' ? {} : window.URL || window.webkitURL;
};

/**
 * @function getHasBlobSupport
 *
 * @description
 * get whether or not the browser supports blob object
 *
 * @returns {boolean} does the browser support blob
 */
export const getHasBlobSupport = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const win = window;

  if (!(win.Blob && typeof win.Blob === 'function' && getUrl().createObjectURL)) {
    return false;
  }

  try {
    new win.Blob();

    return true;
  } catch (exception) {
    return false;
  }
};

/**
 * @function throwErrorIfIsNotText
 *
 * @description
 * throw an error if the provided children is not a text node
 *
 * @param {*} children
 */
export const throwErrorIfIsNotText = (children) => {
  if (!isString(children)) {
    throw new TypeError(ONLY_TEXT_ERROR);
  }
};
