import _ from 'lodash';
import types from '../types.js';

const signsMap = {
  [types.added]: '+',
  [types.removed]: '-',
  [types.updated]: ' ',
  [types.unchanged]: ' ',
  [types.nested]: ' ',
};

const getPrefix = (level) => '    '.repeat(level);

const getRow = (key, type, value, level) => {
  const signPartLevelOffset = 1;
  const prefix = getPrefix(level - signPartLevelOffset);
  const sign = signsMap[type];
  return `${prefix}  ${sign} ${key}: ${value}`;
};

const formatNestedValue = (values, level) => {
  const prefix = getPrefix(level);
  const blockRows = ['{', ...values, `${prefix}}`];
  return blockRows.join('\n');
};

const formatValue = (key, type, value, level) => {
  if (_.isArray(value)) {
    const formattedValue = formatNestedValue(value, level);
    return getRow(key, type, formattedValue, level);
  }

  if (_.isPlainObject(value)) {
    const rows = Object
      .keys(value)
      .map((childKey) => formatValue(childKey, types.unchanged, value[childKey], level + 1));
    const formattedValue = formatNestedValue(rows, level);
    return getRow(key, type, formattedValue, level);
  }

  return getRow(key, type, value, level);
};

const formatDiff = (diff, level) => {
  const {
    key, type, value, valueBefore, valueAfter,
  } = diff;

  switch (type) {
    case types.added:
    case types.removed:
    case types.unchanged: {
      return formatValue(key, type, value, level);
    }
    case types.updated:
      return [
        formatDiff({ key, type: types.removed, value: valueBefore }, level),
        formatDiff({ key, type: types.added, value: valueAfter }, level),
      ].join('\n');
    case types.nested: {
      const diffs = Object.values(value).map((childDiff) => formatDiff(childDiff, level + 1));

      return formatValue(key, type, diffs, level);
    }
    default:
      throw new Error(`non supported node type ${type}`);
  }
};

export default function stylishFormatter(diffs) {
  const rows = diffs.map((diff) => formatDiff(diff, 1));
  return formatNestedValue(rows, 0);
}
