import { createElement, forwardRef, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { createGetCachedLinkHref } from './blob';
import { normalizeOptions } from './options';
import { getRenderedStyles } from './styles';

import type { ComponentType, MutableRefObject } from 'react';
import type { Options, Props } from '../index.d';

interface TagProps
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
function useTagProps(props: Props): TagProps {
  const remainingProps: TagProps = {};

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

const Link = forwardRef<
  HTMLLinkElement,
  { passedProps: TagProps; style: string }
>(function LinkTag({ passedProps, style }, ref) {
  const getCachedLinkHref = useMemo(createGetCachedLinkHref, []);

  return createElement(
    'link',
    Object.assign({}, passedProps, {
      href: getCachedLinkHref(style),
      rel: 'stylesheet',
      ref,
    })
  );
});

export const Style = forwardRef<HTMLLinkElement | HTMLStyleElement, Props>(
  function Style(props, ref) {
    const { hasSourceMap, isMinified, isPrefixed } = props;

    const passedProps = /*#__NOINLINE__*/ useTagProps(props);
    const options = useMemo(
      () => normalizeOptions({ hasSourceMap, isMinified, isPrefixed }),
      [hasSourceMap, isMinified, isPrefixed]
    );
    const style = /*#__NOINLINE__*/ useStyle(props.children, options);

    if (options.hasSourceMap) {
      return createPortal(
        createElement(Link, {
          passedProps,
          ref: ref as MutableRefObject<HTMLLinkElement>,
          style,
        }),
        document.head
      );
    }

    return createPortal(
      createElement('style', Object.assign({}, passedProps, { ref }), style),
      document.head
    );
  }
) as ComponentType<Props>;
