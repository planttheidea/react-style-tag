import { getProcessedStyles } from '../src/styles';
import { DEFAULT_OPTIONS } from '../src/options';

describe('styles', () => {
  describe('getProcessedStyles', () => {
    it('should return the style string with the options passed', () => {
      const style = '.foo { display: flex; }';

      const result = getProcessedStyles(style, DEFAULT_OPTIONS);

      expect(result).toEqual(
        '.foo{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}'
      );
    });
  });
});
