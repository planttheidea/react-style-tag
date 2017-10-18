// external dependencies
import isNull from 'lodash/isNull';
import moize from 'moize';
import React, {
  Component,
  PropTypes
} from 'react';

// local utils
import {
  createIdForTag,
  removeIdFromCache,
  setCacheId
} from './cache';
import {
  DEFAULT_REACT_STYLE_TAG_GLOBAL_PROPERTIES,
  NO_BLOB_SUPPORT_ERROR
} from './constants';
import {
  getCoalescedPropsValue,
  getTransformedCss
} from './transform';
import {
  getHasBlobSupport,
  getUrl,
  throwErrorIfIsNotText
} from './utils';

let globalProperties = {...DEFAULT_REACT_STYLE_TAG_GLOBAL_PROPERTIES},
    hasBlobSupport, url;

export const createComponentWillMount = (instance) => {
  /**
   * @function componentWillMount
   *
   * @description
   * just prior to mount, assign blob support if falsy and assign the instance id
   */
  return () => {
    const {
      children,
      id
    } = instance.props;

    if (!hasBlobSupport) {
      url = getUrl();

      if (url) {
        hasBlobSupport = getHasBlobSupport();
      }
    }

    instance.id = createIdForTag(id, children);
  };
};

export const createComponentDidMount = (instance) => {
  /**
   * @function componentWillMount
   *
   * @description
   * on mount, set the correct tag based on local or global properties
   */
  return () => {
    instance.setCorrectTag();
  };
};

export const createShouldComponentUpdate = (instance) => {
  /**
   * @function shouldComponentUpdate
   *
   * @description
   * prevent update of the component unless the children content has changed
   *
   * @param {string} nextChildren the incoming children
   * @returns {boolean} should the component update
   */
  return ({children: nextChildren}) => {
    const {
      children
    } = instance.props;

    return children !== nextChildren;
  };
};

export const createComponentDidUpdate = (instance) => {
  /**
   * @function componentDidUpdate
   *
   * @description
   * on component update, set the new children in the cache and set the new correct tag
   */
  return () => {
    const {
      children
    } = instance.props;

    setCacheId(instance.id, children);

    instance.setCorrectTag();
  };
};

export const createComponentWillUnmount = (instance) => {
  /**
   * @function componentWillUnmount
   *
   * @description
   * just prior to mount, remove all appropriate tags from the head and ids from cache
   */
  return () => {
    instance.removeTagFromHead('link');
    instance.removeTagFromHead('style');

    if (!isNull(instance.id)) {
      removeIdFromCache(instance.id);
    }
  };
};

export const createAssignRefToInstance = (instance, refName) => {
  /**
   * @function assignRefToInstance
   *
   * @description
   * assign the element passed to the instance at refName
   *
   * @param {HTMLElement} element the element to assign to the instance
   */
  return (element) => {
    instance[refName] = element;
  };
};

export const createRemoveTagFromHead = (instance) => {
  /**
   * @function removeTagFromHead
   *
   * @description
   * remove the tagType from the document head if it exists
   *
   * @param {string} tagType
   */
  return (tagType) => {
    const tag = instance[tagType];

    if (tag) {
      document.head.removeChild(tag);

      instance[tagType] = null;
    }
  };
};

export const createSetCorrectTag = (instance) => {
  /**
   * @function setCorrectTag
   *
   * @description
   * based on whether sourcemaps are requested, set either a link or style tag
   */
  return () => {
    const {
      hasSourceMap
    } = instance.props;

    if (!isNull(instance.id)) {
      const {
        hasSourceMap: hasSourceMapGlobal
      } = globalProperties;

      const hasSourceMapFinal = instance.getCoalescedPropsValue(hasSourceMap, hasSourceMapGlobal);

      if (hasSourceMapFinal) {
        instance.setLinkTag();
      } else {
        instance.setStyleTag();
      }
    }
  };
};

export const createSetLinkTag = (instance) => {
  /**
   * @function setLinkTag
   *
   * @description
   * set the link tag with the prefixed / minified css text as a blob and move to the document head
   */
  return () => {
    const {
      children,
      doNotPrefix,
      isMinified,
      autoPrefixerOpts
    } = instance.props;

    throwErrorIfIsNotText(children);

    instance.removeTagFromHead('style');

    if (!hasBlobSupport) {
      throw new ReferenceError(NO_BLOB_SUPPORT_ERROR);
    }

    const {
      doNotPrefix: doNotPrefixGlobal,
      isMinified: isMinifiedGlobal,
      autoPrefixerOpts: autoPrefixerOptsGlobal
    } = globalProperties;

    const doNotPrefixFinal = instance.getCoalescedPropsValue(doNotPrefix, doNotPrefixGlobal);
    const isMinifiedFinal = instance.getCoalescedPropsValue(isMinified, isMinifiedGlobal);
    // not using memoized version for autoPrefixerOpts as memoizing object will be more expensive than undefined check
    const autoPrefixerOptsFinal = getCoalescedPropsValue(autoPrefixerOpts, autoPrefixerOptsGlobal);
    const transformedCss = getTransformedCss(children, doNotPrefixFinal, isMinifiedFinal, autoPrefixerOptsFinal);

    const link = instance.link;
    const blob = new window.Blob([transformedCss], {
      type: 'text/css'
    });

    link.href = url.createObjectURL(blob);

    document.head.appendChild(link);
  };
};

export const createSetStyleTag = (instance) => {
  /**
   * @function setStyleTag
   *
   * @description
   * set the style tag with the prefixed / minified css text and move to the document head
   */
  return () => {
    const {
      children,
      doNotPrefix,
      isMinified,
      autoPrefixerOpts
    } = instance.props;

    const {
      doNotPrefix: doNotPrefixGlobal,
      isMinified: isMinifiedGlobal,
      autoPrefixerOpts: autoPrefixerOptsGlobal
    } = globalProperties;

    throwErrorIfIsNotText(children);

    instance.removeTagFromHead('link');

    const doNotPrefixFinal = instance.getCoalescedPropsValue(doNotPrefix, doNotPrefixGlobal);
    const isMinifiedFinal = instance.getCoalescedPropsValue(isMinified, isMinifiedGlobal);
    // not using memoized version for autoPrefixerOpts as memoizing object will be more expensive than undefined check
    const autoPrefixerOptsFinal = instance.getCoalescedPropsValue(autoPrefixerOpts, autoPrefixerOptsGlobal);

    const style = instance.style;

    style.textContent = getTransformedCss(children, doNotPrefixFinal, isMinifiedFinal, autoPrefixerOptsFinal);

    document.head.appendChild(style);
  };
};

/**
 * @function setGlobalOptions
 *
 * @description
 * set the global options for all instances of Style
 *
 * @param {object} options
 * @param {boolean} [options.doNotPrefix]
 * @param {boolean} [options.hasSourceMap]
 * @param {boolean} [options.isMinified]
 * @param {object} [options.autoPrefixerOpts]
 * @returns {Object} globalProperties
 */
export const setGlobalOptions = (options) => {
  Object.keys(options).forEach((option) => {
    if (globalProperties.hasOwnProperty(option)) {
      globalProperties[option] = options[option];
    }
  });

  return globalProperties;
};

class Style extends Component {
  static propTypes = {
    children: PropTypes.node,
    doNotPrefix: PropTypes.bool,
    hasSourceMap: PropTypes.bool,
    id: PropTypes.string,
    isMinified: PropTypes.bool,
    autoPrefixerOpts: PropTypes.shape({
      // shape defined by autoprefixer options documentation at https://www.npmjs.com/package/autoprefixer
      browsers: PropTypes.array,
      env: PropTypes.string,
      cascade: PropTypes.bool,
      add: PropTypes.bool,
      remove: PropTypes.bool,
      supports: PropTypes.bool,
      flexbox: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
      ]),
      grid: PropTypes.bool,
      stats: PropTypes.object
    })
  };

  // lifecycle methods
  componentWillMount = createComponentWillMount(this);
  componentDidMount = createComponentDidMount(this);
  shouldComponentUpdate = createShouldComponentUpdate(this);
  componentDidUpdate = createComponentDidUpdate(this);
  componentWillUnmount = createComponentWillUnmount(this);

  // instance values
  hasBlobSupport = false;
  id = null;
  link = null;
  style = null;

  // static methods
  static setGlobalOptions = setGlobalOptions;

  // instance methods
  getCoalescedPropsValue = moize(getCoalescedPropsValue);
  removeTagFromHead = createRemoveTagFromHead(this);
  setCorrectTag = createSetCorrectTag(this);
  setLinkRef = createAssignRefToInstance(this, 'link');
  setLinkTag = createSetLinkTag(this);
  setStyleRef = createAssignRefToInstance(this, 'style');
  setStyleTag = createSetStyleTag(this);

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
      autoPrefixerOpts: autoPrefixerOptsIgnored,
      ...otherProps
    } = this.props;

    const {
      hasSourceMap: hasSourceMapGlobal
    } = globalProperties;

    const hasSourceMapFinal = this.getCoalescedPropsValue(hasSourceMap, hasSourceMapGlobal);

    if (hasSourceMapFinal && hasBlobSupport) {
      return (
        <link
          id={this.id}
          ref={this.setLinkRef}
          rel="stylesheet"
          {...otherProps}
        />
      );
    }

    return (
      <style
        id={this.id}
        ref={this.setStyleRef}
        {...otherProps}
      >
        {children}
      </style>
    );
  }
}

export default Style;
