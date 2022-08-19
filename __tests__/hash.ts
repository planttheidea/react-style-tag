import { hash, hashKeys } from '../src/hash';

describe('hash', () => {
  describe('hash', () => {
    it('should return a string in the correct format', () => {
      const string = 'fooBarBaz';
      const result = hash(string);

      expect(result).toMatch(new RegExp(`scoped__${string}__[0-9]`));
    });
  });

  describe('hashKeys', () => {
    it('should create a map based on the keys passed', () => {
      const keys = ['foo', 'bar', 'baz'];
      const result = hashKeys(keys);

      expect(result).toEqual({
        foo: expect.stringMatching(new RegExp(`scoped__foo__[0-9]`)),
        bar: expect.stringMatching(new RegExp(`scoped__bar__[0-9]`)),
        baz: expect.stringMatching(new RegExp(`scoped__baz__[0-9]`)),
      });
    });
  });
});
