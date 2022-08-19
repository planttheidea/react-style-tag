function noop(): undefined {
  return;
}

/**
 * Create a cached version of the getLinkHref.
 */
export function createGetCachedLinkHref() {
  let href: string | undefined;
  let createObjectURL: ReturnType<typeof getCreateObjectURL> =
    getCreateObjectURL();
  let currentStyle: string | null = null;

  return function (style: string): string | undefined {
    if (style === currentStyle) {
      return href;
    }

    if (createObjectURL === noop) {
      createObjectURL = getCreateObjectURL();
    }

    if ((currentStyle = style)) {
      return (href = createObjectURL(new Blob([style], { type: 'text/css' })));
    }

    return (href = undefined);
  };
}
/**
 * Create the url string based on the available URL. If window is unavailable (such as in SSR),
 * then bail out.
 */
export function getCreateObjectURL() {
  if (typeof window === 'undefined') {
    return noop;
  }

  const URL = window.URL || window.webkitURL;

  return URL.createObjectURL || noop;
}
