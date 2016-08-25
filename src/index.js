// external dependencies
import React, {
  Component,
  PropTypes
} from 'react';

// local utils
import {
  hasBlobSupport,
  noBlobSupportError,
  onlyTextError
} from './constants';
import hashKeys from './hash';
import {
  isBoolean,
  isString
} from './is';
import {
  getCoalescedPropsValue,
  getTransformedCss,
  minify as minifyCss,
  prefixCss
} from './transform';

/**
 * throw an error if the provided children is not a text node
 *
 * @param {*} children
 */
const throwErrorIfIsNotText = (children) => {
  if (!isString(children)) {
    throw new Error(onlyTextError);
  }
};

const REACT_STYLE_TAG_GLOBAL_PROPERTIES = {
  doNotPrefix: false,
  hasSourceMap: false,
  isMinified: false
};

class Style extends Component {
  static propTypes = {
    children: PropTypes.node,
    doNotPrefix: PropTypes.bool,
    hasSourceMap: PropTypes.bool,
    isMinified: PropTypes.bool
  };

  componentDidMount() {
    this.setCorrectTag();
  }

  componentDidUpdate() {
    this.setCorrectTag();
  }

  componentWillUnmount() {
    this.removeTagFromHead('link');
    this.removeTagFromHead('style');
  }

  shouldComponentUpdate({children: nextChildren}) {
    const {
      children
    } = this.props;

    return children !== nextChildren;
  }

  /**
   * set the global options for all instances of Style
   *
   * @param {object} options
   * @param {boolean} [options.doNotPrefix]
   * @param {boolean} [options.hasSourceMap]
   * @param {boolean} [options.isMinified]
   */
  static setGlobalOptions(options) {
    Object.keys(options).forEach((option) => {
      if (REACT_STYLE_TAG_GLOBAL_PROPERTIES.hasOwnProperty(option)) {
        if (!isBoolean(options[option])) {
          throw new Error(`${option} must be a boolean value.`);
        }

        REACT_STYLE_TAG_GLOBAL_PROPERTIES[option] = options[option];
      }
    });
  }

  /**
   * remove the tagType from the document head if it exists
   *
   * @param {string} tagType
   */
  removeTagFromHead = (tagType) => {
    const tag = this.refs[tagType];

    if (tag) {
      document.head.removeChild(tag);
    }
  };

  /**
   * based on whether sourcemaps are requested, set either a link or style tag
   */
  setCorrectTag = () => {
    const {
      hasSourceMap
    } = this.props;
    
    const {
      hasSourceMap: hasSourceMapGlobal
    } = REACT_STYLE_TAG_GLOBAL_PROPERTIES;
    
    const hasSourceMapFinal = getCoalescedPropsValue(hasSourceMap, hasSourceMapGlobal);

    if (hasSourceMapFinal) {
      this.setLinkTag();
    } else {
      this.setStyleTag();
    }
  };

  /**
   * set the link tag with the prefixed / minified css text as a blob and move to the document head
   */
  setLinkTag = () => {
    const {
      children,
      doNotPrefix,
      isMinified
    } = this.props;

    throwErrorIfIsNotText(children);

    this.removeTagFromHead('style');

    if (hasBlobSupport) {
      const {
        doNotPrefix: doNotPrefixGlobal,
        isMinified: isMinifiedGlobal
      } = REACT_STYLE_TAG_GLOBAL_PROPERTIES;

      const doNotPrefixFinal = getCoalescedPropsValue(doNotPrefix, doNotPrefixGlobal);
      const isMinifiedFinal = getCoalescedPropsValue(isMinified, isMinifiedGlobal);
      const transformedCss = getTransformedCss(children, doNotPrefixFinal, isMinifiedFinal);

      const link = this.refs.link;
      const blob = new window.Blob([transformedCss], {
        type: 'text/css'
      });

      link.href = URL.createObjectURL(blob);

      document.head.appendChild(link);
    } else {
      throw new Error(noBlobSupportError);
    }
  };

  /**
   * set the style tag with the prefixed / minified css text and move to the document head
   */
  setStyleTag = () => {
    const {
      children,
      doNotPrefix,
      isMinified
    } = this.props;

    const {
      doNotPrefix: doNotPrefixGlobal,
      isMinified: isMinifiedGlobal
    } = REACT_STYLE_TAG_GLOBAL_PROPERTIES;

    throwErrorIfIsNotText(children);

    this.removeTagFromHead('link');

    const doNotPrefixFinal = getCoalescedPropsValue(doNotPrefix, doNotPrefixGlobal);
    const isMinifiedFinal = getCoalescedPropsValue(isMinified, isMinifiedGlobal);

    const style = this.refs.style;

    style.textContent = getTransformedCss(children, doNotPrefixFinal, isMinifiedFinal);

    document.head.appendChild(style);
  };

  render() {
    const {
      children,
      doNotPrefix: doNotPrefixIgnored,
      hasSourceMap,
      isMinified: isMinifiedIgnored,
      ...otherProps
    } = this.props;

    const {
      hasSourceMap: hasSourceMapGlobal
    } = REACT_STYLE_TAG_GLOBAL_PROPERTIES;

    const hasSourceMapFinal = getCoalescedPropsValue(hasSourceMap, hasSourceMapGlobal);

    if (hasSourceMapFinal && hasBlobSupport) {
      return (
        <link
          rel="stylesheet"
          ref="link"
          {...otherProps}
        />
      );
    }

    return (
      <style
        ref="style"
        {...otherProps}
      >
        {children}
      </style>
    );
  }
}

export {hashKeys};
export {minifyCss};
export {prefixCss};

export default Style;
