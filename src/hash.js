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
 * return map with hashed keys associated to their original values
 *
 * @param {array<string>} keys=[]
 * @returns {object}
 */
export const hashKeys = (keys = []) => {
  const length = keys.length;

  let hashMap = {},
      index = -1,
      key;

  while (++index < length) {
    key = keys[index];
    hashMap[key] = hash(key);
  }

  counter++;

  return hashMap;
};

export default hashKeys;
