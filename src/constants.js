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
export const IS_PRODUCTION = !!(process && process.env && process.env.NODE_ENV === 'production');

/**
 * @constant {number} REACT_MINOR_VERSION the numeric major.minor version of React
 */
export const REACT_MINOR_VERSION = +React.version
  .split('.')
  .slice(0, 2)
  .join('.');

/**
 * @constant {boolean} SUPPORTS_BEFORE_UPDATE_SNAPSHOT is getSnapshotBeforeUpdate supported by the React version
 */
export const SUPPORTS_BEFORE_UPDATE_SNAPSHOT = !isNaN(REACT_MINOR_VERSION) && REACT_MINOR_VERSION >= 16.3;
