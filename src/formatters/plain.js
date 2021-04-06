import _ from 'lodash';
import { types } from '../constants.js';

function formatDiffValue(value) {
  if (_.isObject(value) || _.isArray(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return value;
}

function makeDiffDesc(diff) {
  const { operator, value, prevValue } = diff;

  switch (operator) {
    case types.added: return `added with value: ${formatDiffValue(value)}`;
    case types.removed: return 'removed';
    case types.updated: {
      const before = formatDiffValue(prevValue);
      const after = formatDiffValue(value);
      return `updated. From ${before} to ${after}`;
    }
    case types.unchanged:
    case types.nested:
      return null;
    default:
      throw new Error(`non supported operator ${operator}`);
  }
}

function formatDiff(diff) {
  const { key } = diff;

  const desc = makeDiffDesc(diff);
  if (!desc) {
    return null;
  }
  return `Property '${key}' was ${desc}`;
}

const getKeyPath = (path, key) => (path ? `${path}.${key}` : key);

export function flatDiffs(diffs, path = '') {
  return diffs.reduce((acc, diff) => {
    const {
      key, value,
    } = diff;

    const keyPath = getKeyPath(path, key);

    if (_.isArray(value)) {
      const subTree = flatDiffs(value, keyPath);
      return acc.concat(subTree);
    }

    return [
      ...acc,
      {
        ...diff,
        key: keyPath,
      },
    ];
  }, []);
}

export default function plainFormatter(diffs) {
  const preparedDiffs = flatDiffs(diffs);

  return preparedDiffs
    .reduce((acc, diff) => acc.concat(formatDiff(diff)), [])
    .filter(Boolean)
    .join('\n');
}
