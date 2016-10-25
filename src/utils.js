// external dependencies
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import uuid from 'node-uuid';

// constants
import {
  ONLY_TEXT_ERROR
} from './constants';

let cache = {};

/**
 * get the ids that have active values in cache
 *
 * @returns {Array<string>}
 */
const getActiveValuesFromCache = () => {
  return Object.keys(cache).reduce((values, id) => {
    if (cache[id]) {
      return values.concat([cache[id]]);
    }

    return values;
  }, []);
};

/**
 * determine if the style passed already exists
 *
 * @param {string} id
 * @param {string} value
 * @returns {boolean}
 */
const stylesExist = (id, value) => {
  return document.getElementById(id) || getActiveValuesFromCache().indexOf(value) !== -1;
};

/**
 * create a unique ID for the style tag
 *
 * @param {string} id
 * @param {string} value
 * @returns {string}
 */
const createIdForTag = (id, value) => {
  const finalId = isUndefined(id) ? uuid.v4() : id;

  if (stylesExist(finalId, value)) {
    return null;
  }

  cache[finalId] = value;

  return finalId;
};

/**
 * remove the ID from cache
 *
 * @param {string} id
 */
const removeIdFromCache = (id) => {
  delete cache[id];
};

/**
 * update the cached value
 *
 * @param {string} id
 * @param {string} value
 */
const setCacheId = (id, value) => {
  cache[id] = value;
};

/**
 * throw an error if the provided children is not a text node
 *
 * @param {*} children
 */
const throwErrorIfIsNotText = (children) => {
  if (!isString(children)) {
    throw new Error(ONLY_TEXT_ERROR);
  }
};

export {createIdForTag};
export {getActiveValuesFromCache};
export {removeIdFromCache};
export {setCacheId};
export {stylesExist};
export {throwErrorIfIsNotText};
