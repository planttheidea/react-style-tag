/**
 * @function getUrl
 *
 * @description
 * get the URL used to generate blobs
 *
 * @returns {Object} the URL object to generate blobs with
 */
export const getUrl = (() => {
  let URL = null;

  return () => URL || (URL = typeof window !== 'undefined' ? window.URL || window.webkitURL : {});
})();

/**
 * @function getHasBlobSupport
 *
 * @description
 * get whether Blobs are supported in the runtime
 *
 * @returns {boolean} are Blobs supported
 */
export const getHasBlobSupport = () =>
  typeof window !== 'undefined' &&
  typeof window.Blob === 'function' &&
  typeof getUrl().createObjectURL === 'function' &&
  (() => {
    try {
      new window.Blob();

      return true;
    } catch (error) {
      return false;
    }
  })();

/**
 * @function hasBlobSupport
 *
 * @description
 * a cached reference to determine Blob support in the runtime
 *
 * @returns {boolean} are Blobs supported
 */
export const hasBlobSupport = (() => {
  let support = false;

  return () => support || (support = getHasBlobSupport());
})();

/**
 * @function getLinkHref
 *
 * @description
 * get the href of the link based on the style string Blob
 *
 * @param {string} style the style to create the Blob from
 * @returns {string} the data URI built from the Blob
 */
export const getLinkHref = (style) =>
  hasBlobSupport() ? getUrl().createObjectURL(new window.Blob([style], {type: 'text/css'})) : null;

/**
 * @function createGetCachedLinkHref
 *
 * @description
 * create a cached version of the getLinkHref
 *
 * @returns {function(string): string} the cached version of getLinkHref
 */
export const createGetCachedLinkHref = () =>
  (() => {
    let href = null,
        currentStyle = null;

    return (style) => (style === currentStyle ? href : (href = getLinkHref(style)));
  })();
