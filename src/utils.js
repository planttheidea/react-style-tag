// external dependencies
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import uuid from 'uuid/v4';

// constants
import {
  ONLY_TEXT_ERROR
} from './constants';

let cache = {};

/**
 * @function getActiveValuesFromCache
 *
 * @description
 * get the ids that have active values in cache
 *
 * @returns {Array<string>}
 */
export const getActiveValuesFromCache = () => {
  return Object.keys(cache).reduce((values, id) => {
    if (cache[id]) {
      return values.concat([cache[id]]);
    }

    return values;
  }, []);
};

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
 * @function stylesExist
 *
 * @description
 * determine if the style passed already exists
 *
 * @param {string} id
 * @param {string} value
 * @returns {boolean}
 */
export const stylesExist = (id, value) => {
  return document.getElementById(id) || getActiveValuesFromCache().indexOf(value) !== -1;
};

/**
 * @function createIdForTag
 *
 * @description
 * create a unique ID for the style tag
 *
 * @param {string} id
 * @param {string} value
 * @returns {string}
 */
export const createIdForTag = (id, value) => {
  const finalId = isUndefined(id) ? uuid() : id;

  if (stylesExist(finalId, value)) {
    return null;
  }

  cache[finalId] = value;

  return finalId;
};

/**
 * @function removeIdFromCache
 *
 * @description
 * remove the ID from cache
 *
 * @param {string} id
 */
export const removeIdFromCache = (id) => {
  delete cache[id];
};

/**
 * @function setCacheId
 *
 * @description
 * update the cached value
 *
 * @param {string} id
 * @param {string} value
 */
export const setCacheId = (id, value) => {
  cache[id] = value;
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
