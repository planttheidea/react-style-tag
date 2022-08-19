/**
 * The options to pass to cssbeautify.
 */
export const BEAUTIFY_OPTIONS = {
  autosemicolon: true,
  indent: '  ',
};

/**
 * Whether the runtime is the production environment.
 */
export const IS_PRODUCTION =
  typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';
