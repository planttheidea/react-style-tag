// external dependencies
import React, {
  Component,
  PropTypes
} from 'react';

// local utils
import hashKeys from './hash';
import {
  minify,
  prefixCss
} from './transform';

const URL = window.URL || window.webkitURL;
const HAS_BLOB_SUPPORT = !!(window.Blob && typeof window.Blob === 'function' && URL.createObjectURL) && ((win) => {
  try {
    new win.Blob;

    return true;
  } catch (exception) {
    return false;
  }
})(window);
const NO_BLOB_SUPPORT_ERROR = (`
To support sourcemaps for react-style-tag you need Blob support, and the browser you are using does not currently 
support it. Please import the included polyfill at 'react-style-tag/blob-polyfill.js'.
`).replace(/\r?\n|\r/, '');
const ONLY_TEXT_ERROR = 'The only type of child that can be used in the <Style/> tag is text.';

/**
 * get the (if applicable) prefixed and minified css based on the
 * original cssText
 *
 * @param {string} cssText
 * @param {boolean} doNotPrefix
 * @param {boolean} isMinified
 * @returns {string}
 */
const getTransformedCss = (cssText, doNotPrefix, isMinified) => {
  const transformedCss = doNotPrefix ? cssText : prefixCss(cssText);

  return isMinified ? minify(transformedCss) : transformedCss;
};

/**
 * return the propsValue if it exists, else return the defaultValue
 * 
 * @param {boolean} propsValue
 * @param {boolean} defaultValue
 * @returns {boolean}
 */
const getCoalescedPropsValue = (propsValue, defaultValue) => {
  if (isUndefined(propsValue)) {
    return defaultValue;
  }
  
  return propsValue;
};

/**
 * determine if object is a boolean
 *
 * @param {*} object
 * @returns {boolean}
 */
const isBoolean = (object) => {
  return object === true || object === false;
};

/**
 * determine if object is a string
 *
 * @param {*} object
 * @returns {boolean}
 */
const isString = (object) => {
  return Object.prototype.toString.call(object) === '[object String]';
};

/**
 * determine if object is undefined
 *
 * @param {*} object
 * @returns {boolean}
 */
const isUndefined = (object) => {
  return object === void 0;
};

/**
 * throw an error if the provided children is not a text node
 *
 * @param {*} children
 */
const throwErrorIfIsNotText = (children) => {
  if (!isString(children)) {
    throw new Error(ONLY_TEXT_ERROR);
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

    if (HAS_BLOB_SUPPORT) {
      const {
        doNotPrefix: doNotPrefixGlobal,
        isMinified: isMinifiedGlobal
      } = REACT_STYLE_TAG_GLOBAL_PROPERTIES;

      const doNotPrefixFinal = getCoalescedPropsValue(doNotPrefix, doNotPrefixGlobal);
      const isMinifiedFinal = getCoalescedPropsValue(isMinified, isMinifiedGlobal);
      const link = this.refs.link;
      const transformedCss = getTransformedCss(children, doNotPrefixFinal, isMinifiedFinal);
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

    if (hasSourceMapFinal && HAS_BLOB_SUPPORT) {
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

export default Style;
