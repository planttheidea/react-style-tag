import {
  createElement,
  forwardRef,
  MutableRefObject,
  useMemo,
  useRef,
} from 'react';
import { createGetCachedLinkHref } from './blob';
import { getCoalescedOption } from './options';
import { getRenderedStyles } from './styles';

export interface Props {
  [key: string]: any;

  children: string;
  hasSourceMap?: boolean;
  id?: string;
  isMinified?: boolean;
  isPrefixed?: boolean;
}

type PassedProps = Omit<
  Props,
  'children' | 'hasSourceMap' | 'isMinified' | 'isPrefixed'
>;

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
function useStyle(props: Props) {
  const { children } = props;

  const childrenRef = useRef<string>(children);
  const styleRef = useRef<string>();

  if (!styleRef.current || childrenRef.current !== children) {
    styleRef.current = getRenderedStyles(children, props);
    childrenRef.current = children;
  }

  return styleRef.current;
}

const Link = forwardRef<
  HTMLLinkElement,
  { passedProps: PassedProps; style: string }
>(function LinkTag({ passedProps, style }, ref) {
  const getCachedLinkHref = useMemo(createGetCachedLinkHref, []);

  return createElement(
    'link',
    Object.assign(
      {},
      {
        href: getCachedLinkHref(style),
        rel: 'stylesheet',
        ref,
      }
    )
  );
});

export const Style = forwardRef<HTMLLinkElement | HTMLStyleElement, Props>(
  function Style(props, ref) {
    const passedProps = usePassedProps(props);
    const style = useStyle(props);

    if (getCoalescedOption(props, 'hasSourceMap')) {
      return createElement(Link, {
        passedProps,
        ref: ref as MutableRefObject<HTMLLinkElement>,
        style,
      });
    }

    return createElement(
      'style',
      Object.assign({}, passedProps, { ref }),
      style
    );
  }
);
