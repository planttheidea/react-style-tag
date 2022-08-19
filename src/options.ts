import { IS_PRODUCTION } from './constants';

export interface Options {
  hasSourceMap: boolean;
  isCompressed: boolean;
  isMinified: boolean;
  isPrefixed: boolean;
}

/**
 * The global options to apply as fallback to local props.
 */
export const DEFAULT_OPTIONS: Options = {
  hasSourceMap: !IS_PRODUCTION,
  isCompressed: true,
  isMinified: IS_PRODUCTION,
  isPrefixed: true,
};

let globalOptions: Options = { ...DEFAULT_OPTIONS };

/**
 * Get the option either from props if it exists, or globally.
 */
export function getCoalescedOption(
  props: Record<string, any>,
  option: keyof Options
): boolean {
  const value = props[option];

  return value != null ? !!value : globalOptions[option];
}

/**
 * Set the options passed to be global.
 */
export function setGlobalOptions(options: Partial<Options>): void {
  let option: keyof Options;

  for (option in options) {
    if (globalOptions.hasOwnProperty(option)) {
      globalOptions[option] = !!options[option];
    }
  }
}
