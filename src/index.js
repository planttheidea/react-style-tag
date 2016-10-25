// external dependencies
import isBoolean from 'lodash/isBoolean';
import isNull from 'lodash/isNull';
import React, {
  Component,
  PropTypes
} from 'react';

// local utils
import {
  HAS_BLOB_SUPPORT,
  NO_BLOB_SUPPORT_ERROR
} from './constants';
import hashKeys from './hash';
import {
  getCoalescedPropsValue,
  getTransformedCss,
  minify as minifyCss,
  prefixCss
} from './transform';
import {
  createIdForTag,
  removeIdFromCache,
  setCacheId,
  throwErrorIfIsNotText
} from './utils';

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

  componentWillMount() {
    const {
      children,
      id
    } = this.props;

    this.id = createIdForTag(id, children);
  }

  componentDidMount() {
    this.setCorrectTag();
  }

  componentDidUpdate() {
    const {
      children
    } = this.props;

    setCacheId(this.id, children);

    this.setCorrectTag();
  }

  componentWillUnmount() {
    this.removeTagFromHead('link');
    this.removeTagFromHead('style');

    if (!isNull(this.id)) {
      removeIdFromCache(this.id);
    }
  }

  id = null;

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

    if (!isNull(this.id)) {
      const {
        hasSourceMap: hasSourceMapGlobal
      } = REACT_STYLE_TAG_GLOBAL_PROPERTIES;

      const hasSourceMapFinal = getCoalescedPropsValue(hasSourceMap, hasSourceMapGlobal);

      if (hasSourceMapFinal) {
        this.setLinkTag();
      } else {
        this.setStyleTag();
      }
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

    if (HAS_BLOB_SUPPORT) {
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
      throw new Error(NO_BLOB_SUPPORT_ERROR);
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
    if (isNull(this.id)) {
      return null;
    }

    const {
      children,
      doNotPrefix: doNotPrefixIgnored,
      hasSourceMap,
      id: idIgnored,
      isMinified: isMinifiedIgnored,
      ...otherProps
    } = this.props;

    const {
      hasSourceMap: hasSourceMapGlobal
    } = REACT_STYLE_TAG_GLOBAL_PROPERTIES;

    const hasSourceMapFinal = getCoalescedPropsValue(hasSourceMap, hasSourceMapGlobal);

    if (hasSourceMapFinal && HAS_BLOB_SUPPORT) {
      return (
        <link
          id={this.id}
          rel="stylesheet"
          ref="link"
          {...otherProps}
        />
      );
    }

    return (
      <style
        id={this.id}
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
