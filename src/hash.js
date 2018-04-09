let counter = 0;

/**
 * @function hash
 *
 * @description
 * simple bitwise hash of string value
 *
 * @param {string} key ASCII only
 * @return {number} 32-bit positive integer hash
 */
export const hash = (key) => {
  const stringToHash = `${key}-${counter}`;

  let hashValue = 5381,
      index = stringToHash.length;

  while (index) {
    hashValue = (hashValue * 33) ^ stringToHash.charCodeAt(--index);
  }

  return `scoped__${key}__${hashValue >>> 0}`;
};

/**
 * @function hashKeys
 *
 * @description
 * create a hash map based on the keys passed
 *
 * @param {Array<string>} keys the keys to hash
 * @returns {Object} the hashmap of key => has pairs
 */
export const hashKeys = (keys) =>
  keys.reduce((hashMap, key) => {
    hashMap[key] = hash(key);

    return hashMap;
  }, {});
