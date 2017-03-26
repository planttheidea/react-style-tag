// test
import test from 'ava';
import _ from 'lodash';
import React from 'react';
import sinon from 'sinon';
import {
  shallow
} from 'enzyme';
import toJson from 'enzyme-to-json';

// src
import * as component from 'src/Style';
import * as cache from 'src/cache';
import * as constants from 'src/constants';
import * as transform from 'src/transform';
import * as utils from 'src/utils';

const LINK_HREF = '__LINK_HREF__';

test('if createAssignRefToInstance will assign a ref to the instance at refName', (t) => {
  const refName = 'foo';
  const instance = {
    [refName]: null
  };

  const assignRefToInstance = component.createAssignRefToInstance(instance, refName);

  t.true(_.isFunction(assignRefToInstance));

  const element = {};

  assignRefToInstance(element);

  t.is(instance[refName], element);
  t.deepEqual(instance, {
    [refName]: element
  });
});

test('if createComponentDidMount will call setCorrectTag on the instance', (t) => {
  const instance = {
    setCorrectTag: sinon.spy()
  };

  const componentDidMount = component.createComponentDidMount(instance);

  t.true(_.isFunction(componentDidMount));

  componentDidMount();

  t.true(instance.setCorrectTag.calledOnce);
});

test('if createComponentDidUpdate calls setCacheId and setCorrectTag', (t) => {
  const instance = {
    id: 'foo',
    props: {
      children: 'bar'
    },
    setCorrectTag: sinon.spy()
  };

  const componentDidUpdate = component.createComponentDidUpdate(instance);

  t.true(_.isFunction(componentDidUpdate));

  const stub = sinon.stub(cache, 'setCacheId');

  componentDidUpdate();

  t.true(stub.calledOnce);
  t.true(stub.calledWith(instance.id, instance.props.children));

  t.true(instance.setCorrectTag.calledOnce);

  stub.restore();
});

test.serial('if createComponentWillMount will only call getUrl and createIdForTag if blob support is not present', (t) => {
  const instance = {
    id: null,
    props: {
      children: 'bar',
      id: 'foo'
    }
  };

  const componentWillMount = component.createComponentWillMount(instance);

  t.true(_.isFunction(componentWillMount));

  const urlStub = sinon.stub(utils, 'getUrl');
  const blobSupportStub = sinon.stub(utils, 'getHasBlobSupport');

  const createIdStub = sinon.stub(cache, 'createIdForTag').returns(instance.props.id);

  componentWillMount();

  t.true(urlStub.calledOnce);

  t.true(blobSupportStub.notCalled);

  t.true(createIdStub.calledOnce);
  t.true(createIdStub.calledWith(instance.props.id, instance.props.children));

  urlStub.restore();
  blobSupportStub.restore();
  createIdStub.restore();
});

test.serial('if createComponentWillMount will call get getHasBlobSupport if url exists', (t) => {
  const instance = {
    id: null,
    props: {
      children: 'bar',
      id: 'foo'
    }
  };

  const componentWillMount = component.createComponentWillMount(instance);

  t.true(_.isFunction(componentWillMount));

  const urlStub = sinon.stub(utils, 'getUrl').returns({
    createObjectURL: sinon.stub().returns(LINK_HREF)
  });
  const blobSupportStub = sinon.stub(utils, 'getHasBlobSupport').returns(true);

  const createIdStub = sinon.stub(cache, 'createIdForTag').returns(instance.props.id);

  componentWillMount();

  t.true(urlStub.calledOnce);

  t.true(blobSupportStub.calledOnce);

  t.true(createIdStub.calledOnce);
  t.true(createIdStub.calledWith(instance.props.id, instance.props.children));

  urlStub.restore();
  blobSupportStub.restore();
  createIdStub.restore();
});

test('if createComponentWillUnmount will call removeTagFromHead and removeIdFromCache', (t) => {
  const instance = {
    id: 'foo',
    removeTagFromHead: sinon.spy()
  };

  const componentWillUnmount = component.createComponentWillUnmount(instance);

  t.true(_.isFunction(componentWillUnmount));

  const removeIdStub = sinon.stub(cache, 'removeIdFromCache');

  componentWillUnmount();

  t.true(instance.removeTagFromHead.calledTwice);
  t.is(instance.removeTagFromHead.getCall(0).args[0], 'link');
  t.is(instance.removeTagFromHead.getCall(1).args[0], 'style');

  t.true(removeIdStub.calledOnce);
  t.true(removeIdStub.calledWith(instance.id));

  removeIdStub.restore();
});

test('if createComponentWillUnmount will mpt call removeIdFromCache if id is null', (t) => {
  const instance = {
    id: null,
    removeTagFromHead: sinon.spy()
  };

  const componentWillUnmount = component.createComponentWillUnmount(instance);

  t.true(_.isFunction(componentWillUnmount));

  const removeIdStub = sinon.stub(cache, 'removeIdFromCache');

  componentWillUnmount();

  t.true(instance.removeTagFromHead.calledTwice);
  t.is(instance.removeTagFromHead.getCall(0).args[0], 'link');
  t.is(instance.removeTagFromHead.getCall(1).args[0], 'style');

  t.true(removeIdStub.notCalled);

  removeIdStub.restore();
});

test.serial('if createRemoveTagFromHead will create a method that that gets the tag from the instance and removes it from the head', (t) => {
  const tagType = 'foo';
  const tag = {};
  const instance = {
    [tagType]: tag
  };

  const removeTagFromHead = component.createRemoveTagFromHead(instance);

  t.true(_.isFunction(removeTagFromHead));

  const removeChildStub = sinon.stub(document.head, 'removeChild');

  removeTagFromHead(tagType);

  t.true(removeChildStub.calledOnce);
  t.true(removeChildStub.calledWith(tag));
  t.is(instance[tagType], null);

  removeChildStub.restore();
});

test('if createSetCorrectTag will call the right tag function based on hasSourceMap being false', (t) => {
  const instance = {
    getCoalescedPropsValue: sinon.stub().returns(false),
    id: 'foo',
    props: {
      hasSourceMap: undefined
    },
    setLinkTag: sinon.spy(),
    setStyleTag: sinon.spy()
  };

  const setCorrectTag = component.createSetCorrectTag(instance);

  t.true(_.isFunction(setCorrectTag));

  setCorrectTag();

  t.true(instance.getCoalescedPropsValue.calledOnce);

  t.true(instance.setLinkTag.notCalled);

  t.true(instance.setStyleTag.calledOnce);
});

test('if createSetCorrectTag will call the right tag function based on hasSourceMap being true', (t) => {
  const instance = {
    getCoalescedPropsValue: sinon.stub().returns(true),
    id: 'foo',
    props: {
      hasSourceMap: undefined
    },
    setLinkTag: sinon.spy(),
    setStyleTag: sinon.spy()
  };

  const setCorrectTag = component.createSetCorrectTag(instance);

  t.true(_.isFunction(setCorrectTag));

  setCorrectTag();

  t.true(instance.getCoalescedPropsValue.calledOnce);

  t.true(instance.setLinkTag.calledOnce);

  t.true(instance.setStyleTag.notCalled);
});

test('if createSetCorrectTag will call nothing if the instance id is null', (t) => {
  const instance = {
    getCoalescedPropsValue: sinon.stub().returns(true),
    id: null,
    props: {
      hasSourceMap: undefined
    },
    setLinkTag: sinon.spy(),
    setStyleTag: sinon.spy()
  };

  const setCorrectTag = component.createSetCorrectTag(instance);

  t.true(_.isFunction(setCorrectTag));

  setCorrectTag();

  t.true(instance.getCoalescedPropsValue.notCalled);

  t.true(instance.setLinkTag.notCalled);

  t.true(instance.setStyleTag.notCalled);
});

test.serial('if createSetLinkTag will create a link tag with the correct values', (t) => {
  const instance = {
    getCoalescedPropsValue: sinon.stub().returns(false),
    link: {
      href: null
    },
    props: {
      children: 'foo',
      doNotPrefix: false,
      isMinified: false
    },
    removeTagFromHead: sinon.spy()
  };

  const setLinkTag = component.createSetLinkTag(instance);

  t.true(_.isFunction(setLinkTag));

  const transformCssStub = sinon.stub(transform, 'getTransformedCss').returns(instance.props.children);

  global.window = {
    Blob: sinon.spy()
  };

  const appendChildStub = sinon.stub(document.head, 'appendChild');

  component.createComponentWillMount(instance)();

  t.notThrows(() => {
    setLinkTag();
  });

  transformCssStub.restore();

  t.true(instance.removeTagFromHead.calledOnce);
  t.true(instance.removeTagFromHead.calledWith('style'));

  t.true(window.Blob.calledOnce);
  t.deepEqual(window.Blob.getCall(0).args, [
    [instance.props.children],
    {
      type: 'text/css'
    }
  ]);

  t.is(instance.link.href, LINK_HREF);

  t.true(appendChildStub.calledOnce);
  t.true(appendChildStub.calledWith(instance.link));

  global.window.Blob = undefined;

  appendChildStub.restore();
});

test.serial('if createSetStyleTag will create a link tag with the correct values', (t) => {
  const instance = {
    getCoalescedPropsValue: sinon.stub().returns(false),
    style: {
      textContent: null
    },
    props: {
      children: 'foo',
      doNotPrefix: false,
      isMinified: false
    },
    removeTagFromHead: sinon.spy()
  };

  const setStyleTag = component.createSetStyleTag(instance);

  t.true(_.isFunction(setStyleTag));

  const transformCssStub = sinon.stub(transform, 'getTransformedCss').returns(instance.props.children);
  const appendChildStub = sinon.stub(document.head, 'appendChild');

  component.createComponentWillMount(instance)();

  t.notThrows(() => {
    setStyleTag();
  });

  transformCssStub.restore();

  t.true(instance.removeTagFromHead.calledOnce);
  t.true(instance.removeTagFromHead.calledWith('link'));

  t.true(transformCssStub.calledOnce);

  t.is(instance.style.textContent, instance.props.children);

  t.true(appendChildStub.calledOnce);
  t.true(appendChildStub.calledWith(instance.style));

  appendChildStub.restore();
});

test('if createShouldComponentUpdate correctly compares children that are the same', (t) => {
  const instance = {
    props: {
      children: 'foo'
    }
  };

  const shouldComponentUpdate = component.createShouldComponentUpdate(instance);

  t.true(_.isFunction(shouldComponentUpdate));

  const nextProps = {
    children: 'foo'
  };

  const result = shouldComponentUpdate(nextProps);

  t.false(result);
});

test('if createShouldComponentUpdate correctly compares children that are different', (t) => {
  const instance = {
    props: {
      children: 'foo'
    }
  };

  const shouldComponentUpdate = component.createShouldComponentUpdate(instance);

  t.true(_.isFunction(shouldComponentUpdate));

  const nextProps = {
    children: 'bar'
  };

  const result = shouldComponentUpdate(nextProps);

  t.true(result);
});

test('if setGlobalOptions have the correct defaults', (t) => {
  const result = component.setGlobalOptions({});

  t.deepEqual(result, constants.DEFAULT_REACT_STYLE_TAG_GLOBAL_PROPERTIES);
});

test('if setGlobalOptions will set the global properties based on the options passed', (t) => {
  const overrides = {
    doNotPrefix: true,
    isMinified: true
  };

  const result = component.setGlobalOptions(overrides);

  t.deepEqual(result, {
    ...constants.DEFAULT_REACT_STYLE_TAG_GLOBAL_PROPERTIES,
    doNotPrefix: true,
    isMinified: true
  });
});

test('if setGlobalOptions will throw a TypeError when an override is not a boolean', (t) => {
  const overrides = {
    doNotPrefix: 'foo'
  };

  t.throws(() => {
    component.setGlobalOptions(overrides);
  }, TypeError);
});

test('if Style will render correctly when using a style tag', (t) => {
  const Style = component.default;
  const id = 'foo';

  const wrapper = shallow(
    <Style
      id={id}
    />
  );

  t.snapshot(toJson(wrapper));
});

test('if Style will render correctly when using a link tag', (t) => {
  const Style = component.default;
  const id = 'foo';

  const wrapper = shallow(
    <Style
      hasSourceMap
      id={id}
    />
  );

  t.snapshot(toJson(wrapper));
});

test('if Style will render correctly when id is null', (t) => {
  const Style = component.default;
  const id = null;

  const wrapper = shallow(
    <Style
      hasSourceMap
      id={id}
    />
  );

  t.is(wrapper.type(), null);
});
