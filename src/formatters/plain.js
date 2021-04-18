import _ from 'lodash';
import types from '../types.js';

const makeKeyPath = (path, key) => (path ? `${path}.${key}` : key);

const stringify = (value) => {
  if (_.isObject(value) || _.isArray(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return value;
};

const formatDiff = (diff, path = '') => {
  const {
    key, type, children, value, valueBefore, valueAfter,
  } = diff;

  const keyPath = makeKeyPath(path, key);

  switch (type) {
    case types.added:
      return `Property '${keyPath}' was added with value: ${stringify(value)}`;
    case types.removed:
      return `Property '${keyPath}' was removed`;
    case types.updated: {
      const before = stringify(valueBefore);
      const after = stringify(valueAfter);
      return `Property '${keyPath}' was updated. From ${before} to ${after}`;
    }
    case types.nested:
      return children.flatMap(diff => formatDiff(diff, keyPath));
    case types.unchanged:
      return null;
    default:
      throw new Error(`non supported node type ${type}`);
  }
};

export default function plainFormatter(diffs) {
  return diffs
    .flatMap((diff) => formatDiff(diff))
    .filter(Boolean)
    .join('\n');
}
