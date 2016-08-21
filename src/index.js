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

/**
 * determine if object is a string
 *
 * @param {*} object
 * @returns {boolean}
 */
const isString = (object) => {
  return Object.prototype.toString.call(object) === '[object String]';
};

class Style extends Component {
  static propTypes = {
    children: PropTypes.node,
    doNotPrefix: PropTypes.bool,
    isMinified: PropTypes.bool
  };

  static defaultProps = {
    doNotPrefix: false,
    isMinified: false
  };

  componentDidMount() {
    const {
      doNotPrefix
    } = this.props;

    if (!doNotPrefix) {
      this.setPrefixedCss();
    }
  }

  componentDidUpdate() {
    const {
      doNotPrefix
    } = this.props;

    if (!doNotPrefix) {
      this.setPrefixedCss();
    }
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
   * re-prefix the updated values and update the contents
   */
  setPrefixedCss = () => {
    const {
      children,
      isMinified
    } = this.props;

    if (!isString(children)) {
      throw new Error('The only type of child that can be used in the <Style/> tag is text.');
    }

    const style = this.refs.styleTag;
    const prefixedCss = prefixCss(children);

    style.textContent = isMinified ? minify(prefixedCss) : prefixedCss;

    document.head.appendChild(style);
  };

  render() {
    const {
      children,
      doNotPrefix: doNotPrefixIgnored,
      isMinified: isMinifiedIgnored,
      ...otherProps
    } = this.props;

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
