import React, { forwardRef, useMemo, useRef } from 'react';
import { createGetCachedLinkHref } from './blob';
import { getCoalescedOption } from './options';
import { getRenderedStyles } from './styles';

export interface Props {
  [key: string]: any;

  children: string;
  hasSourceMap?: boolean;
  id?: string;
  isCompressed?: boolean;
  isMinified?: boolean;
  isPrefixed?: boolean;
}

type PassedProps = Omit<
  Props,
  'children' | 'hasSourceMap' | 'isCompressed' | 'isMinified' | 'isPrefixed'
>;

function usePassedProps(props: Props): PassedProps {
  const {
    children: _children,
    hasSourceMap: _hasSourceMap,
    isCompressed: _isCompressed,
    isMinified: _isMinified,
    isPrefixed: _isPrefixed,
    ...remainingProps
  } = props;

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

const LinkTag = forwardRef<HTMLLinkElement, Props>(function LinkTag(
  props,
  ref
) {
  const passedProps = usePassedProps(props);
  const getCachedLinkHref = useMemo(createGetCachedLinkHref, []);
  const style = useStyle(props);

  return (
    <link
      {...passedProps}
      href={getCachedLinkHref(style)}
      rel="stylesheet"
      ref={ref}
    />
  );
});

const StyleTag = forwardRef<HTMLStyleElement, Props>(function StyleTag(
  props,
  ref
) {
  const passedProps = usePassedProps(props);
  const style = useStyle(props);

  return (
    <style {...passedProps} ref={ref}>
      {style}
    </style>
  );
});

export const Style = forwardRef<HTMLLinkElement | HTMLStyleElement, Props>(
  function Style(props, ref) {
    const Element = getCoalescedOption(props, 'hasSourceMap')
      ? LinkTag
      : StyleTag;

    // @ts-expect-error - `link` vs `style` has different `ref` setups.
    return <Element {...props} ref={ref} />;
  }
);
