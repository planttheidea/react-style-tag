/**
 * Create the url string based on the available URL. If window is unavailable (such as in SSR),
 * then bail out.
 */
export function getCreateObjectURL() {
  if (typeof window === 'undefined') {
    return;
  }

  const URL = window.URL || window.webkitURL;

  return URL.createObjectURL;
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

    if (!createObjectURL) {
      createObjectURL = getCreateObjectURL();

      if (!createObjectURL) {
        return;
      }
    }

    if ((currentStyle = style)) {
      return (href = createObjectURL(new Blob([style], { type: 'text/css' })));
    }

    return (href = undefined);
  };
}
