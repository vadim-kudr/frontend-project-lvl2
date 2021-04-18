import _ from 'lodash';
import types from '../types.js';

const signsMap = {
  [types.added]: '+',
  [types.removed]: '-',
  [types.updated]: ' ',
  [types.unchanged]: ' ',
  [types.nested]: ' ',
};

const makePrefix = (level) => '    '.repeat(level);

const makeRow = (key, type, value, level) => {  
  const signPartLevelOffset = 1;
  const prefix = makePrefix(level - signPartLevelOffset);
  return `${prefix}  ${signsMap[type]} ${key}: ${value}`;
};

const wrapNestedRows = (rows, level) => {
  const prefix = makePrefix(level);
  return ['{', ...rows, `${prefix}}`].join('\n');
};

const stringify = (key, type, value, level) => {
  if (_.isPlainObject(value)) {
    const rows = Object
      .entries(value)
      .map(([childKey, childValue]) => stringify(childKey, types.unchanged, childValue, level + 1));
    const nestedRows = wrapNestedRows(rows, level);
    return makeRow(key, type, nestedRows, level);
  }

  return makeRow(key, type, value, level);
};

const formatDiff = (diff, level) => {
  const {
    key, type, children, value, valueBefore, valueAfter,
  } = diff;

  switch (type) {
    case types.added:
    case types.removed:
    case types.unchanged: {
      return stringify(key, type, value, level);
    }
    case types.updated:
      return [
        formatDiff({ key, type: types.removed, value: valueBefore }, level),
        formatDiff({ key, type: types.added, value: valueAfter }, level),
      ].join('\n');
    case types.nested: {
      const diffs = Object.values(children).map((childDiff) => formatDiff(childDiff, level + 1));
      const nestedRows = wrapNestedRows(diffs, level);
      return stringify(key, type, nestedRows, level);
    }
    default:
      throw new Error(`non supported node type ${type}`);
  }
};

export default function stylishFormatter(diffs) {
  const rows = diffs.map((diff) => formatDiff(diff, 1));
  return wrapNestedRows(rows, 0);
}
