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
 * determine if object is a string
 *
 * @param {*} object
 * @returns {boolean}
 */
const isString = (object) => {
  return Object.prototype.toString.call(object) === '[object String]';
};

const NEWLINE_REGEX = /\r?\n|\r/;
const NO_BLOB_SUPPORT_ERROR = (`
To support sourcemaps for react-style-tag you need Blob support, and the browser you are using does not currently 
support it. Please import the included polyfill at 'react-style-tag/blob-polyfill.js'.
`).replace(NEWLINE_REGEX, '');

class Style extends Component {
  static propTypes = {
    children: PropTypes.node,
    doNotPrefix: PropTypes.bool,
    hasSourceMap: PropTypes.bool,
    isMinified: PropTypes.bool
  };

  static defaultProps = {
    doNotPrefix: false,
    hasSourceMap: false,
    isMinified: false
  };

  componentDidMount() {
    this.setCorrectTag();
  }

  componentDidUpdate() {
    this.setCorrectTag();
  }

  componentWillUnmount() {
    document.head.removeChild(this.refs.styleTag);
  }

  shouldComponentUpdate({children: nextChildren}) {
    const {
      children
    } = this.props;

    return children !== nextChildren;
  }

  /**
   * based on whether sourcemaps are requested, set either a link or style tag
   */
  setCorrectTag = () => {
    const {
      hasSourceMap
    } = this.props;

    if (hasSourceMap) {
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

    if (!isString(children)) {
      throw new Error('The only type of child that can be used in the <Style/> tag is text.');
    }

    if (HAS_BLOB_SUPPORT) {
      const link = this.refs.linkTag;
      const transformedCss = getTransformedCss(children, doNotPrefix, isMinified);
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

    if (!isString(children)) {
      throw new Error('The only type of child that can be used in the <Style/> tag is text.');
    }

    const style = this.refs.styleTag;

    style.textContent = getTransformedCss(children, doNotPrefix, isMinified);

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

    if (hasSourceMap && HAS_BLOB_SUPPORT) {
      return (
        <link
          rel="stylesheet"
          ref="linkTag"
          {...otherProps}
        />
      );
    }

    return (
      <style
        ref="styleTag"
        {...otherProps}
      >
        {children}
      </style>
    );
  }
}

export {hashKeys};

export default Style;
