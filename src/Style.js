// external dependencies
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {createElementRef, createMethod} from 'react-parm';

// blob
import {createGetCachedLinkHref, hasBlobSupport} from './blob';

// constants
import {SUPPORTS_BEFORE_UPDATE_SNAPSHOT} from './constants';

// options
import {getCoalescedOption, setGlobalOptions} from './options';

// styles
import {getRenderedStyles} from './styles';

/**
 * @function componentDidMount
 *
 * @description
 * on mount, relocate the node
 *
 * @param {ReactComponent} instance the component instance
 * @param {HTMLElement} instance.node the node to render the styles into
 * @param {function} instance.relocateNote the method to relocate the node to the head
 * @returns {void}
 */
export const componentDidMount = ({node, relocateNode}) => relocateNode(node);

/**
 * @function getSnapshotBeforeUpdate
 *
 * @description
 * before the update occurs, if the sourceMap requirements have changed, return the node to its original position
 *
 * @param {ReactComponent} instance the component instance
 * @param {HTMLElement} instance.node the node to render the styles into
 * @param {function} instance.returnNode the method to return the node to its original parent
 * @returns {null}
 */
export const getSnapshotBeforeUpdate = ({node, returnNode}) => {
  returnNode(node);

  return null;
};

/**
 * @function componentDidUpdate
 *
 * @description
 * on update, if the sourceMap requirements have changed then relocate the new node to the head,
 * and if the styles have changed then set them in staet
 *
 * @param {ReactComponent} instance the component instance
 * @param {function} instance.getStyleForState the method to get the new rendered style
 * @param {HTMLElement} instance.node the node to render the styles into
 * @param {function} instance.relocateNote the method to relocate the node to the head
 * @param {Object} instance.props the new props of the component
 * @param {function} instance.setState the method to set the state of the component
 * @param {Array<any>} args the arguments passed to the function
 * @param {Object} previousProps the previous props of the component
 */
export const componentDidUpdate = ({getStyleForState, node, relocateNode, props, setState}, [previousProps]) => {
  relocateNode(node);

  if (props.children !== previousProps.children) {
    setState(getStyleForState);
  }
};

/**
 * @function componentWillUnmount
 *
 * @description
 * prior to unmount, return the node to its original parent
 *
 * @param {ReactComponent} instance the component instance
 * @param {HTMLElement} instance.node the node to render the styles into
 * @param {function} instance.returnNode the method to return the node to its original parent
 * @returns {void}
 */
export const componentWillUnmount = ({node, returnNode}) => returnNode(node);

/**
 * @function getStyleForState
 *
 * @description
 * get the styles to be used for the rendered tag
 *
 * @param {ReactComponent} instance the component instance
 * @param {Object} instance.props the new props of the component
 * @returns {{style: string}} the style strng to use in the rendered tag
 */
export const getStyleForState = ({props}) => ({
  style: getRenderedStyles(props.children, {
    isCompressed: getCoalescedOption(props, 'isCompressed'),
    isMinified: getCoalescedOption(props, 'isMinified'),
    isPrefixed: getCoalescedOption(props, 'isPrefixed')
  })
});

/**
 * @function relocateNode
 *
 * @description
 * relocate the node to the bottom of the head
 *
 * @param {ReactComponent} instance the component instance
 * @param {Array<any>} args the arguments passed to the function
 * @param {HTMLElement} node the node to render the styles into
 */
export const relocateNode = (instance, [node]) => {
  if (typeof document !== 'undefined' && node) {
    instance.originalParent = node.parentNode;

    instance.originalParent.removeChild(node);
    document.head.appendChild(node);
  }
};

/**
 * @function returnNode
 *
 * @description
 * return the node to the original parent
 *
 * @param {ReactComponent} instance the component instance
 * @param {Array<any>} args the arguments passed to the function
 * @param {HTMLElement} node the node to render the styles into
 */
export const returnNode = (instance, [node]) => {
  if (typeof document !== 'undefined' && node) {
    try {
      document.head.removeChild(node);
      instance.originalParent.appendChild(node);
    } catch (error) {
      // ignore the error
    } finally {
      instance.node = null;
      instance.originalParent = null;
    }
  }
};

class Style extends PureComponent {
  static propTypes = {
    children: PropTypes.string.isRequired,
    hasSourceMap: PropTypes.bool,
    id: PropTypes.string,
    isCompressed: PropTypes.bool,
    isMinified: PropTypes.bool,
    isPrefixed: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = getStyleForState({props});
  }

  // lifecycle methods
  componentDidMount = createMethod(this, componentDidMount);
  componentDidUpdate = createMethod(this, componentDidUpdate);
  /* eslint-disable react/sort-comp */
  [SUPPORTS_BEFORE_UPDATE_SNAPSHOT ? 'getSnapshotBeforeUpdate' : 'componentWillUpdate'] = createMethod(
    this,
    getSnapshotBeforeUpdate
  );
  /* eslint-enable */
  componentWillUnmount = createMethod(this, componentWillUnmount);

  // instance values
  linkHref = null;
  node = null;
  originalParent = null;

  // static methods
  static setGlobalOptions = setGlobalOptions;

  // instance methods
  getCachedLinkHref = createGetCachedLinkHref();
  getStyleForState = createMethod(this, getStyleForState);
  relocateNode = createMethod(this, relocateNode);
  returnNode = createMethod(this, returnNode);

  render() {
    const {
      children: childrenIgnored,
      hasSourceMap: hasSourceMapIgnored,
      isCompressed: isMinifiedIgnored,
      isPrefixed: isPrefixedIgnored,
      ...props
    } = this.props;
    const {style} = this.state;

    if (getCoalescedOption(this.props, 'hasSourceMap')) {
      if (hasBlobSupport()) {
        return (
          /* eslint-disable prettier */
          <link
            {...props}
            href={this.getCachedLinkHref(style)}
            ref={createElementRef(this, 'node')}
            rel="stylesheet"
          />
          /* eslint-enable */
        );
      }

      /* eslint-disable no-console */
      console.error(
        'To support sourcemaps for react-style-tag you need Blob support, and the browser you are using does not currently support it. You should include a polyfill prior to the rendering of this component.'
      );
      /* eslint-enable */
    }

    return (
      <style
        ref={createElementRef(this, 'node')}
        {...props}
      >
        {style}
      </style>
    );
  }
}

export default Style;
