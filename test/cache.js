// test
import test from 'ava';
import _ from 'lodash';
import sinon from 'sinon';

// src
import * as cache from 'src/cache';

test('if createGetCacheValuesFromKeys will create a function that gets the values from the cache passed', (t) => {
  const localCache = {
    foo: 'bar',
    bar: 'baz',
    baz: 'foo'
  };
  const keys = Object.keys(localCache);

  const getCacheValuesFromKeys = cache.createGetCacheValuesFromKeys(localCache);

  t.true(_.isFunction(getCacheValuesFromKeys));

  const values = keys.map((key) => {
    return localCache[key];
  });

  const result = getCacheValuesFromKeys(keys);

  t.deepEqual(result, values);
});

test('if createGetCacheValuesFromKeys will create a function that gets only the values that exist from the cache passed', (t) => {
  const localCache = {
    foo: 'bar',
    bar: 'baz',
    baz: 'foo',
    blah: undefined
  };
  const keys = Object.keys(localCache).filter((key) => {
    return !!localCache[key];
  });

  const getCacheValuesFromKeys = cache.createGetCacheValuesFromKeys(localCache);

  t.true(_.isFunction(getCacheValuesFromKeys));

  const values = keys
    .map((key) => {
      return localCache[key];
    })
    .filter((value) => {
      return !!value;
    });

  const result = getCacheValuesFromKeys(keys);

  t.deepEqual(result, values);
});

test.serial('if createIdForTag returns null if styles already exist', (t) => {
  const id = 'foo';
  const value = 'bar';
  const localCache = {};

  const getElementStub = sinon.stub(document, 'getElementById').returns(true);

  const result = cache.createIdForTag(id, value, localCache);

  getElementStub.restore();

  t.is(result, null);
});

test.serial('if createIdForTag assigns value to id in localCache if styles do not already exist', (t) => {
  const id = 'foo';
  const value = 'bar';
  const localCache = {};

  const result = cache.createIdForTag(id, value, localCache);

  t.is(result, id);
  t.deepEqual(localCache, {
    [id]: value
  });
});

test('if getActiveValuesFromCache return an array of values based on the localCache object passed', (t) => {
  const localCache = {
    bar: 'baz',
    baz: 'foo',
    foo: 'bar'
  };

  const result = cache.getActiveValuesFromCache(localCache);

  const expectedResult = Object.keys(localCache).map((key) => {
    return localCache[key];
  });

  t.deepEqual(result, expectedResult);
});

test('if removeIdFromCache will remove the id from cache', (t) => {
  const localCache = {
    foo: 'bar'
  };
  const id = 'foo';

  cache.removeIdFromCache(id, localCache);

  t.deepEqual(localCache, {});
});

test('if setCacheId will add the id to cache', (t) => {
  const localCache = {
    foo: 'bar'
  };
  const id = 'bar';
  const value = 'baz';

  cache.setCacheId(id, value, localCache);

  t.deepEqual(localCache, {
    foo: 'bar',
    bar: 'baz'
  });
});

test.serial('if stylesExist returns true if getElementById returns a value', (t) => {
  const localCache = {
    foo: 'bar'
  };
  const id = 'foo';
  const value = 'bar';

  const result = cache.stylesExist(localCache, id, value);

  t.true(result);
});

test.serial('if stylesExist returns true if getActiveValuesFromCache has something', (t) => {
  const localCache = {
    foo: 'bar'
  };
  const id = 'foo';
  const value = 'bar';

  const result = cache.stylesExist(localCache, id, value);

  t.true(result);
});
