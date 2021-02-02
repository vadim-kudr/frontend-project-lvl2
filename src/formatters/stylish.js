import _ from 'lodash';
import {
  ADDED, EXISTS, REMOVED, UPDATED,
} from '../constants.js';

function formatSubTree(key, op, diffs, prefix) {
  const value = diffs.join('\n');
  return `${prefix}${op || EXISTS} ${key}: {\n${value}\n${prefix}  }`;
}

function formatDiff(diff, level) {
  const {
    key, op, value, prevValue,
  } = diff;

  const subTreeLevel = 2;
  const prefix = '  '.repeat(level);

  if (_.isArray(value)) {
    const diffs = value.map((subTreeDiff) => formatDiff(subTreeDiff, level + subTreeLevel));
    return formatSubTree(key, op, diffs, prefix);
  }

  if (op === UPDATED) {
    return [
      formatDiff({ key, op: REMOVED, value: prevValue }, level),
      formatDiff({ key, op: ADDED, value }, level),
    ].join('\n');
  }

  if (_.isObject(value)) {
    const diffs = Object.keys(value)
      .map((subTreeKey) => {
        const newDiff = {
          key: subTreeKey,
          value: value[subTreeKey],
          op: EXISTS,
        };
        return formatDiff(newDiff, level + subTreeLevel);
      });

    return formatSubTree(key, op, diffs, prefix);
  }

  return `${prefix}${op} ${key}: ${value}`;
}

export default function stylishFormatter(diffs) {
  const lines = diffs.map((diff) => formatDiff(diff, 1));

  return ['{', ...lines, '}'].join('\n');
}
