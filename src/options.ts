import { IS_PRODUCTION } from './constants';

export interface Options {
  hasSourceMap: boolean;
  isMinified: boolean;
  isPrefixed: boolean;
}

/**
 * The global options to apply as fallback to local props.
 */
export const DEFAULT_OPTIONS: Options = {
  hasSourceMap: !IS_PRODUCTION,
  isMinified: IS_PRODUCTION,
  isPrefixed: true,
};

const AVAILABLE_OPTIONS = (
  Object.keys(DEFAULT_OPTIONS) as Array<keyof Options>
).reduce((options, key) => {
  options[key] = true;

  return options;
}, {} as Record<keyof Options, true>);

let globalOptions: Options = Object.assign({}, DEFAULT_OPTIONS);

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

export function getGlobalOptions() {
  return globalOptions;
}

export function normalizeOptions(options: Partial<Options>): Options {
  const normalized: Options = Object.assign({}, globalOptions);
  let option: keyof Options;

  for (option in options) {
    if (normalized.hasOwnProperty(option) && options[option] != null) {
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
    if (globalOptions.hasOwnProperty(option)) {
      globalOptions[option] = !!options[option];
    }
  }
}
