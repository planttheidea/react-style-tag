// test
import test from 'ava';

// src
import * as options from 'src/options';

test('if getCoalescedOption will get the option from props if it is a boolean', (t) => {
  const props = {
    isCompressed: false
  };

  const result = options.getCoalescedOption(props, 'isCompressed');

  t.is(result, props.isCompressed);
  t.not(result, options.GLOBAL_OPTIONS.isCompressed);
});

test('if getCoalescedOption will get the option from GLOBAL_OPTIONS if it is not on prps', (t) => {
  const props = {};

  const result = options.getCoalescedOption(props, 'isCompressed');

  t.not(result, props.isCompressed);
  t.is(result, options.GLOBAL_OPTIONS.isCompressed);
});

test.serial('if setGlobalOptions will set the global options passed if they are booleans', (t) => {
  const newOptions = {
    hasSourceMap: false,
    isCompressed: 'foo'
  };

  const existingGlobalOptions = options.GLOBAL_OPTIONS;
  const original = {...existingGlobalOptions};

  options.setGlobalOptions(newOptions);

  t.deepEqual(options.GLOBAL_OPTIONS, {
    ...original,
    hasSourceMap: newOptions.hasSourceMap
  });

  options.GLOBAL_OPTIONS = existingGlobalOptions;
});
