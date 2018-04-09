// test
import test from 'ava';
import React from 'react';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

// src
import * as component from 'src/Style';
import * as blob from 'src/blob';
import * as options from 'src/options';
import * as styles from 'src/styles';

const Style = component.default;

test('if componentDidMount will call relocateNode with the node', (t) => {
  const instance = {
    node: {},
    relocateNode: sinon.spy()
  };

  component.componentDidMount(instance);

  t.true(instance.relocateNode.calledOnce);
  t.true(instance.relocateNode.calledWith(instance.node));
});

test('if getSnapshotBeforeUpdate will call returnNode', (t) => {
  const instance = {
    node: {},
    props: {
      hasSourceMap: true
    },
    returnNode: sinon.spy()
  };
  const args = [{...instance.props}];

  const result = component.getSnapshotBeforeUpdate(instance, args);

  t.true(instance.returnNode.calledOnce);
  t.true(instance.returnNode.calledWith(instance.node));

  t.is(result, null);
});

test('if componentDidUpdate will relocate the node even if nothing has changed', (t) => {
  const instance = {
    getStyleForState() {},
    node: {},
    props: {
      children: '.foo { display: flex; }',
      hasSourceMap: true
    },
    relocateNode: sinon.spy(),
    setState: sinon.spy()
  };
  const args = [{...instance.props}];

  component.componentDidUpdate(instance, args);

  t.true(instance.relocateNode.calledOnce);
  t.true(instance.relocateNode.calledWith(instance.node));

  t.true(instance.setState.notCalled);
});

test('if componentDidUpdate will set the new style in state if children have changed', (t) => {
  const instance = {
    getStyleForState() {},
    node: {},
    props: {
      children: '.foo { display: flex; }',
      hasSourceMap: true
    },
    relocateNode: sinon.spy(),
    setState: sinon.spy()
  };
  const args = [{...instance.props, children: '.foo { display: inline-flex; }'}];

  component.componentDidUpdate(instance, args);

  t.true(instance.relocateNode.calledOnce);
  t.true(instance.relocateNode.calledWith(instance.node));

  t.true(instance.setState.calledOnce);
  t.true(instance.setState.calledWith(instance.getStyleForState));
});

test('if componentWillUnmount will return the node', (t) => {
  const instance = {
    node: {},
    returnNode: sinon.spy()
  };

  component.componentWillUnmount(instance);

  t.true(instance.returnNode.calledOnce);
  t.true(instance.returnNode.calledWith(instance.node));
});

test('if getStyleForState will build the style based on the props passed', (t) => {
  const instance = {
    props: {
      children: '.foo { display: flex; }',
      isCompressed: true
    }
  };

  const result = component.getStyleForState(instance);

  t.deepEqual(result, {
    style: styles.getRenderedStyles(instance.props.children, {
      isCompressed: options.getCoalescedOption(instance.props, 'isCompressed'),
      isMinified: options.getCoalescedOption(instance.props, 'isMinified'),
      isPrefixed: options.getCoalescedOption(instance.props, 'isPrefixed')
    })
  });
});

test.serial('if relocateNode will do nothing if there is no document', (t) => {
  const doc = global.document;

  global.document = undefined;

  const instance = {
    node: null,
    originalParent: null
  };
  const args = [
    {
      parentNode: {
        removeChild: sinon.spy()
      }
    }
  ];

  try {
    component.relocateNode(instance, args);

    t.pass();
  } catch (error) {
    t.fail(error);
  } finally {
    global.document = doc;
  }
});

test.serial('if relocateNode will do nothing if there is no node', (t) => {
  const stub = sinon.stub(document.head, 'appendChild');

  const instance = {
    node: null,
    originalParent: null
  };
  const args = [null];

  try {
    component.relocateNode(instance, args);

    t.true(stub.notCalled);

    t.pass();
  } catch (error) {
    t.fail(error);
  } finally {
    stub.restore();
  }
});

test.serial('if relocateNode will move the node to the document head if document and node exist', (t) => {
  const stub = sinon.stub(document.head, 'appendChild');

  const instance = {
    node: null,
    originalParent: null
  };
  const args = [
    {
      parentNode: {
        removeChild: sinon.spy()
      }
    }
  ];

  component.relocateNode(instance, args);

  t.is(instance.originalParent, args[0].parentNode);

  t.true(args[0].parentNode.removeChild.calledOnce);
  t.true(args[0].parentNode.removeChild.calledWith(args[0]));

  t.true(stub.calledOnce);
  t.true(stub.calledWith(args[0]));

  stub.restore();
});

test.serial('if returnNode will do nothing if there is no document', (t) => {
  const doc = global.document;

  global.document = undefined;

  const instance = {
    node: {},
    originalParent: {
      appendChild: sinon.spy()
    }
  };
  const args = [instance.node];

  try {
    component.returnNode(instance, args);

    t.true(instance.originalParent.appendChild.notCalled);

    t.pass();
  } catch (error) {
    t.fail(error);
  } finally {
    global.document = doc;
  }
});

test.serial('if returnNode will do nothing if there is no node', (t) => {
  const stub = sinon.stub(document.head, 'removeChild');

  const instance = {
    node: {},
    originalParent: {
      appendChild: sinon.spy()
    }
  };
  const args = [null];

  try {
    component.returnNode(instance, args);

    t.true(instance.originalParent.appendChild.notCalled);

    t.true(stub.notCalled);

    t.pass();
  } catch (error) {
    t.fail(error);
  } finally {
    stub.restore();
  }
});

test.serial('if returnNode will move the node to the document head if document and node exist', (t) => {
  const stub = sinon.stub(document.head, 'removeChild');

  const originalParent = {
    appendChild: sinon.spy()
  };

  const instance = {
    node: {},
    originalParent
  };
  const args = [instance.node];

  component.returnNode(instance, args);

  t.is(instance.originalParent, null);

  t.true(originalParent.appendChild.calledOnce);
  t.true(originalParent.appendChild.calledWith(args[0]));

  t.true(stub.calledOnce);
  t.true(stub.calledWith(args[0]));

  stub.restore();
});

test.serial('if Style will render correctly with default props', (t) => {
  const props = {
    children: '.foo { display: flex; }'
  };

  const wrapper = shallow(<Style {...props} />);

  t.snapshot(toJson(wrapper));

  blob.getUrl.reset();
  blob.hasBlobSupport.reset();
});

test.serial('if Style will render correctly with sourceMaps and additional props', (t) => {
  const props = {
    children: '.foo { display: flex; }',
    'data-foo': 'bar'
  };

  const wrapper = shallow(<Style {...props} />);

  t.snapshot(toJson(wrapper));

  blob.getUrl.reset();
  blob.hasBlobSupport.reset();
});

test.serial('if Style will render correctly with default props when blob support does not exist', (t) => {
  const props = {
    children: '.foo { display: flex; }'
  };

  const existingBlob = window.Blob;

  window.Blob = undefined;

  const stub = sinon.stub(console, 'error');

  const wrapper = shallow(<Style {...props} />);

  t.true(stub.calledOnce);

  stub.restore();

  t.snapshot(toJson(wrapper));

  blob.getUrl.reset();
  blob.hasBlobSupport.reset();

  window.blob = existingBlob;
});

test.serial('if Style will render correctly with no sourceMap requested', (t) => {
  const props = {
    children: '.foo { display: flex; }',
    hasSourceMap: false
  };

  const wrapper = shallow(<Style {...props} />);

  t.snapshot(toJson(wrapper));

  blob.getUrl.reset();
  blob.hasBlobSupport.reset();
});

test.serial('if Style will render correctly with no sourceMap requested and additional props', (t) => {
  const props = {
    children: '.foo { display: flex; }',
    'data-foo': 'bar',
    hasSourceMap: false
  };

  const wrapper = shallow(<Style {...props} />);

  t.snapshot(toJson(wrapper));

  blob.getUrl.reset();
  blob.hasBlobSupport.reset();
});
