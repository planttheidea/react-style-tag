import { useMemo, useRef } from 'react';
import { createGetCachedLinkHref } from './blob';
import { getCoalescedOption, setGlobalOptions } from './options';
import { getRenderedStyles } from './styles';

export interface Props {
  children: string;
  hasSourceMap?: boolean;
  id?: string;
  isCompressed?: boolean;
  isMinified?: boolean;
  isPrefixed?: boolean;
}

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

function LinkTag(props: Props) {
  const {
    children: _children,
    hasSourceMap: _hasSourceMap,
    isCompressed: _isCompressed,
    isPrefixed: _isPrefixed,
    ...remainingProps
  } = props;

  const getCachedLinkHref = useMemo(createGetCachedLinkHref, []);
  const ref = useRef<HTMLLinkElement>(null);
  const style = useStyle(props);

  return (
    <link
      {...remainingProps}
      href={getCachedLinkHref(style)}
      ref={ref}
      rel="stylesheet"
    />
  );
}

function StyleTag(props: Props) {
  const {
    children: _children,
    hasSourceMap: _hasSourceMap,
    isCompressed: _isCompressed,
    isPrefixed: _isPrefixed,
    ...remainingProps
  } = props;

  const ref = useRef<HTMLLinkElement>(null);
  const style = useStyle(props);

  return (
    <style ref={ref} {...remainingProps}>
      {style}
    </style>
  );
}

export default function Style(props) {
  return getCoalescedOption(props, 'hasSourceMap') ? (
    <LinkTag {...props} />
  ) : (
    <StyleTag {...props} />
  );
}

Style.setGlobalOptions = setGlobalOptions;
