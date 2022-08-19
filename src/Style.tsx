import { createElement, forwardRef, useMemo, useRef } from 'react';
import { createGetCachedLinkHref } from './blob';
import { DEFAULT_OPTIONS, normalizeOptions } from './options';
import { getRenderedStyles } from './styles';

import type { MutableRefObject } from 'react';
import type { Options } from './options';

export interface Props {
  [key: string]: any;

  children: string;
  hasSourceMap?: boolean;
  id?: string;
  isMinified?: boolean;
  isPrefixed?: boolean;
}

interface PassedProps
  extends Omit<
    Props,
    'children' | 'hasSourceMap' | 'isMinified' | 'isPrefixed'
  > {}

const INTERNAL_PROPS: Record<string, true> = {
  children: true,
  hasSourceMap: true,
  isMinified: true,
  isPrefixed: true,
};

/**
 * Extract the props used for deriving processed style for passing through to the
 * underlying HTML element.
 */
function usePassedProps(props: Props): PassedProps {
  const remainingProps: PassedProps = {};

  for (const key in props) {
    if (!INTERNAL_PROPS[key]) {
      remainingProps[key] = props[key];
    }
  }

  return remainingProps;
}

/**
 * Calculate and store the style in a local reference.
 */
function useStyle(children: string, options: Options) {
  const childrenRef = useRef<string>(children);
  const styleRef = useRef<string>();

  if (!styleRef.current || childrenRef.current !== children) {
    styleRef.current = getRenderedStyles(children, options);
    childrenRef.current = children;
  }

  return styleRef.current;
}

let titleCount = 0;
function useTitle() {
  return useMemo(() => `ReactStyleTag-${titleCount++}`, []);
}

const Link = forwardRef<
  HTMLLinkElement,
  { passedProps: PassedProps; style: string; title: string }
>(function LinkTag({ passedProps, style, title }, ref) {
  const getCachedLinkHref = useMemo(createGetCachedLinkHref, []);

  return createElement(
    'link',
    Object.assign({}, passedProps, {
      href: getCachedLinkHref(style),
      rel: 'stylesheet',
      ref,
      title,
    })
  );
});

export const Style = forwardRef<HTMLLinkElement | HTMLStyleElement, Props>(
  function Style(props, ref) {
    const { hasSourceMap, isMinified, isPrefixed } = props;

    const passedProps = usePassedProps(props);
    const options = useMemo(
      () => normalizeOptions({ hasSourceMap, isMinified, isPrefixed }),
      [hasSourceMap, isMinified, isPrefixed]
    );
    const style = useStyle(props.children, options);
    const title = useTitle();

    if (options.hasSourceMap) {
      return createElement(Link, {
        passedProps,
        ref: ref as MutableRefObject<HTMLLinkElement>,
        style,
        title,
      });
    }

    return createElement(
      'style',
      Object.assign({}, passedProps, { ref, title }),
      style
    );
  }
);
