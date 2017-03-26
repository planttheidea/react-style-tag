// external dependencies
import compose from 'lodash/fp/compose';
import isUndefined from 'lodash/isUndefined';
import keys from 'lodash/keys';
import reduce from 'lodash/fp/reduce';
import uuid from 'uuid/v4';

let cache = {};

/**
 * @function createGetCacheValuesFromKeys
 *
 * @description
 * prebuilt reduce function which only requires the keys to operate
 *
 * @param {Object} [localCache=cache] the cache to retrieve values from
 * @returns {function(Array<string>): Array<string>} the reduce function to get the values based on keys
 */
export const createGetCacheValuesFromKeys = (localCache = cache) => {
  return reduce((values, key) => {
    return !localCache[key] ? values : values.concat([
      localCache[key]
    ]);
  }, []);
};

/**
 * @function getActiveValuesFromCache
 *
 * @description
 * get the ids that have active values in cache
 *
 * @param {Object} localCache the cache to get the active values from
 * @returns {Array<string>} the values in cache
 */
export const getActiveValuesFromCache = (localCache) => {
  return compose(createGetCacheValuesFromKeys(localCache), keys)(localCache);
};

/**
 * @function stylesExist
 *
 * @description
 * determine if the style passed already exists
 *
 * @param {Object} localCache the current cache of styles
 * @param {string} id the id of the style in question
 * @param {string} value the value to test for
 * @returns {boolean} does the style already exist
 */
export const stylesExist = (localCache, id, value) => {
  return !!(document.getElementById(id) || ~getActiveValuesFromCache(localCache).indexOf(value));
};

/**
 * @function createIdForTag
 *
 * @description
 * create a unique ID for the style tag
 *
 * @param {string} id the id of the style in question
 * @param {string} value the value to assign in cache
 * @param {Object} [localCache=cache] the cache to create an id for
 * @returns {null|string} the id of the item in cache
 */
export const createIdForTag = (id, value, localCache = cache) => {
  const finalId = isUndefined(id) ? uuid() : id;

  if (stylesExist(localCache, finalId, value)) {
    return null;
  }

  localCache[finalId] = value;

  return finalId;
};

/**
 * @function removeIdFromCache
 *
 * @description
 * remove the ID from cache
 *
 * @param {string} id id to remove from cache
 * @param {Object} [localCache=cache] cache to remove id from
 */
export const removeIdFromCache = (id, localCache = cache) => {
  delete localCache[id];
};

/**
 * @function setCacheId
 *
 * @description
 * update the cached value
 *
 * @param {string} id id to set in cache
 * @param {string} value value to assign to id in cache
 * @param {Object} [localCache=cache] cache to remove id from
 */
export const setCacheId = (id, value, localCache = cache) => {
  localCache[id] = value;
};
