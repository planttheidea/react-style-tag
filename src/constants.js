// external dependencies
import React from 'react';

/**
 * @constant {Object} BEAUTIFY_OPTIONS the options to pass to cssbeautify
 */
export const BEAUTIFY_OPTIONS = {
  autosemicolon: true,
  indent: '  '
};

/**
 * @constant {boolean} IS_PRODUCTION is the runtime in the production environment
 */
export const IS_PRODUCTION = !!(
  process &&
  process.env &&
  process.env.NODE_ENV === 'production'
);

const [REACT_MAJOR_VERSION, REACT_MINOR_VERSION] = React.version
  .split('.')
  .slice(0, 2)
  .map(Number);

/**
 * @constant {boolean} SUPPORTS_BEFORE_UPDATE_SNAPSHOT is getSnapshotBeforeUpdate supported by the React version
 */
export const SUPPORTS_BEFORE_UPDATE_SNAPSHOT =
  REACT_MAJOR_VERSION >= 16 && REACT_MINOR_VERSION >= 3;
