import _ from 'lodash';
import { ADDED, REMOVED, UPDATED } from '../constants.js';

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
  const { op, value, prevValue } = diff;

  switch (op) {
    case ADDED: return `added with value: ${formatDiffValue(value)}`;
    case REMOVED: return 'removed';
    case UPDATED: {
      const before = formatDiffValue(prevValue);
      const after = formatDiffValue(value);
      return `updated. From ${before} to ${after}`;
    }
    default: return null;
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

    acc.push({
      ...diff,
      key: keyPath,
    });

    return acc;
  }, []);
}

export default function plainFormatter(diffs) {
  const preparedDiffs = flatDiffs(diffs);

  return preparedDiffs
    .reduce((acc, diff) => acc.concat(formatDiff(diff)), [])
    .filter(Boolean)
    .join('\n');
}
