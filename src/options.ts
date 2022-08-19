import { Options } from '../index.d';

const IS_PRODUCTION =
  typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';

/**
 * The global options to apply as fallback to local props.
 */
export const DEFAULT_OPTIONS: Options = {
  hasSourceMap: !IS_PRODUCTION,
  isMinified: IS_PRODUCTION,
  isPrefixed: true,
};

const globalOptions: Options = Object.assign({}, DEFAULT_OPTIONS);
const hasOwnProperty = Object.prototype.hasOwnProperty;

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

export function getGlobalOptions(): Options {
  return globalOptions;
}

export function normalizeOptions(options: Partial<Options>): Options {
  const normalized: Options = Object.assign({}, globalOptions);
  let option: keyof Options;

  for (option in options) {
    if (hasOwnProperty.call(normalized, option) && options[option] != null) {
      normalized[option] = !!options[option];
    }
  }

  return normalized;
}

/**
 * Set the options passed to be global.
 */
export function setGlobalOptions(options: Partial<Options>): void {
  let option: keyof Options;

  for (option in options) {
    if (hasOwnProperty.call(globalOptions, option)) {
      globalOptions[option] = !!options[option];
    }
  }
}
