// test
import test from 'ava';

// src
import * as hash from 'src/hash';

test('if hash will return a string in the correct format', (t) => {
  const string = 'fooBarBaz';

  const result = hash.hash(string);

  t.regex(result, new RegExp(`scoped__${string}__[0-9]`));
});

test('if hash will return a consistent string', (t) => {
  const string = 'fooBarBaz';

  const result = hash.hash(string);

  const length = 1000;

  let index = -1;

  while (++index < length) {
    t.is(hash.hash(string), result);
  }
});

test('if hashKeys will create a hashMap based on the keys passed', (t) => {
  const keys = ['foo', 'bar', 'baz'];
  const hashes = keys.map(hash.hash);

  const result = hash.hashKeys(keys);

  t.is(Object.keys(hashes).length, keys.length);

  keys.forEach((key, index) => {
    t.true(result.hasOwnProperty(key));
    t.is(result[key], hashes[index]);
  });
});
