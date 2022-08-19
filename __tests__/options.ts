import {
  DEFAULT_OPTIONS,
  getGlobalOptions,
  setGlobalOptions,
} from '../src/options';

import type { Options } from '../index.d';

describe('options', () => {
  afterEach(() => {
    setGlobalOptions(DEFAULT_OPTIONS);
  });

  describe('setGlobalOptions', () => {
    it('should set the global options passed', () => {
      const newOptions = {
        hasSourceMap: false,
        isMinified: true,
      } as Partial<Options>;

      setGlobalOptions(newOptions);

      expect(getGlobalOptions()).toEqual({
        ...DEFAULT_OPTIONS,
        ...newOptions,
      });
    });
  });
});
