import beautify from 'cssbeautify';
import Stylis from 'stylis';
import { BEAUTIFY_OPTIONS } from './constants';
import { getCoalescedOption } from './options';

import type { Props } from './Style';

/**
 * Get the styles processed for passing through to the element.
 */
export function getProcessedStyles(style: string, props: Props): string {
  return new Stylis({
    compress: getCoalescedOption(props, 'isCompressed'),
    global: false,
    keyframe: false,
    prefix: getCoalescedOption(props, 'isPrefixed'),
  })('', style);
}

/**
 * Get the styles rendered in the HTML tag.
 */
export function getRenderedStyles(style: string, props: Props): string {
  const processed = getProcessedStyles(style, props);

  return props.isMinified ? processed : beautify(processed, BEAUTIFY_OPTIONS);
}
