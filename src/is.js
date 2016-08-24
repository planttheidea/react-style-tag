/**
 * determine if object is a boolean
 *
 * @param {*} object
 * @returns {boolean}
 */
const isBoolean = (object) => {
  return object === true || object === false;
};

/**
 * determine if object is a string
 *
 * @param {*} object
 * @returns {boolean}
 */
const isString = (object) => {
  return Object.prototype.toString.call(object) === '[object String]';
};

/**
 * determine if object is undefined
 *
 * @param {*} object
 * @returns {boolean}
 */
const isUndefined = (object) => {
  return object === void 0;
};

export {isBoolean};
export {isString};
export {isUndefined};
