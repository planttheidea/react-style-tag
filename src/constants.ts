import { version } from 'react';

/**
 * the options to pass to cssbeautify
 */
export const BEAUTIFY_OPTIONS = {
  autosemicolon: true,
  indent: '  ',
};

/**
 * is the runtime in the production environment
 */
export const IS_PRODUCTION =
  typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';
