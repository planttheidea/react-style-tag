import { getCreateObjectURL, createGetCachedLinkHref } from '../src/blob';

const win = globalThis.window;
const createObjectURL = win.URL.createObjectURL;

function createBlob(style: string) {
  return new Blob([style], { type: 'text/css' });
}

describe('blob', () => {
  afterEach(() => {
    Object.defineProperty(globalThis, 'window', {
      writable: true,
      value: win,
    });

    Object.defineProperty(globalThis.URL, 'createObjectURL', {
      writable: true,
      value: createObjectURL,
    });
  });

  describe('getCreateObjectURL', () => {
    it('should return a no-op when the window is not defined', () => {
      Object.defineProperty(globalThis, 'window', {
        writable: true,
        value: undefined,
      });

      const createObjectURL = getCreateObjectURL();
      const blob = createBlob('h1 {}');

      expect(createObjectURL(blob)).toBeUndefined();

      Object.defineProperty(globalThis, 'window', {
        writable: true,
        value: win,
      });
    });

    it('should return a no-op when `createObjectURL` does not exist on the URL', () => {
      Object.defineProperty(globalThis.URL, 'createObjectURL', {
        writable: true,
        value: undefined,
      });

      const createObjectURL = getCreateObjectURL();
      const blob = createBlob('h1 {}');

      expect(createObjectURL(blob)).toBeUndefined();
    });

    it('should return a string when `createObjectURL` exists on the URL', () => {
      const createObjectURL = getCreateObjectURL();
      const blob = createBlob('h1 {}');

      expect(createObjectURL(blob)).toEqual(expect.any(String));
    });
  });

  describe('createGetCachedLinkHref', () => {
    it('should create the href when it does not exist in cache', () => {
      const getCachedLinkHref = createGetCachedLinkHref();

      const style = '.foo{display: block;}';
      const result = getCachedLinkHref(style);
      const expected = URL.createObjectURL(createBlob(style));

      expect(result).toBe(expected);
    });

    it('should return the href from cache when it exists', () => {
      const getCachedLinkHref = createGetCachedLinkHref();

      const spy = jest.spyOn(URL, 'createObjectURL');

      const style = '.foo{display: block;}';
      const result = getCachedLinkHref(style);
      const expected = URL.createObjectURL(createBlob(style));

      expect(result).toBe(expected);
      expect(spy).toHaveBeenCalledTimes(1);

      const nextResult = getCachedLinkHref(style);

      expect(nextResult).toBe(result);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should return undefined when the style does not exist', () => {
      const getCachedLinkHref = createGetCachedLinkHref();

      const style = '';
      const result = getCachedLinkHref(style);

      expect(result).toBeUndefined();
    });
  });
});
