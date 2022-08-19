type Url = typeof window.URL;

const EMPTY_URL = {
  createObjectURL() {},
} as unknown as Url;

/**
 * get the URL used to generate blobs
 */
export function getUrl(): Url {
  return typeof window === 'undefined'
    ? EMPTY_URL
    : window.URL || window.webkitURL;
}

/**
 * get the href of the link based on the style string Blob
 */
export function getLinkHref(style: string): string {
  return getUrl().createObjectURL(new Blob([style], { type: 'text/css' }));
}

/**
 * create a cached version of the getLinkHref
 */
export function createGetCachedLinkHref() {
  let href: string | undefined;
  let currentStyle: string | null = null;

  return function (style: string): string | undefined {
    if (style === currentStyle) {
      return href;
    }

    if ((currentStyle = style)) {
      return (href = getLinkHref(style));
    }

    return (href = undefined);
  };
}
