import _ from 'lodash';

function makeSubTreeString(key, op, keys, prefix) {
  const value = keys.join('\n');
  return `${prefix}${op} ${key}: {\n${value}\n${prefix}  }`;
}

function makeKeyValueString(key, op, value, level) {
  const prefix = '  '.repeat(level);
  const valuePrefix = value !== '' ? ' ' : '';

  if (_.isArray(value)) {
    const keys = value.map((item) => {
      /* eslint-disable no-shadow */
      const { key, op, value } = item;
      return makeKeyValueString(key, op, value, level + 2);
    });

    return makeSubTreeString(key, op, keys, prefix);
  }

  if (_.isObject(value)) {
    const keys = Object.keys(value)
      .sort()
      .map((key) => makeKeyValueString(key, ' ', value[key], level + 2));

    return makeSubTreeString(key, op, keys, prefix);
  }

  return `${prefix}${op} ${key}:${valuePrefix}${value}`;
}

export default function stylishFormatter(diff) {
  const diffs = diff.map((node) => {
    const { key, op, value } = node;
    return makeKeyValueString(key, op, value, 1);
  });

  return ['{', ...diffs, '}'].join('\n');
}
