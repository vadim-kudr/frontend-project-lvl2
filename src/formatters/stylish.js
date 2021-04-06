import _ from 'lodash';
import { types } from '../constants.js';

const operatorsMap = {
  [types.added]: '+',
  [types.removed]: '-',
  [types.updated]: ' ',
  [types.unchanged]: ' ',
  [types.nested]: ' ',
};

function getPrefix(operator, level) {
  const prefix = '    '.repeat(level - 1);
  const sign = operatorsMap[operator];
  return `${prefix}  ${sign} `;
}

function getRow(key, operator, value, level) {
  const prefix = getPrefix(operator, level);
  return `${prefix}${key}: ${value}`;
}

function formatNestedValue(values, level) {
  const prefix = '    '.repeat(level);
  const blockRows = [
    '{',
    ...values,
    `${prefix}}`,
  ];
  return blockRows.join('\n');
}

function formatValue(key, operator, value, level) {
  if (_.isArray(value)) {
    const formattedValue = formatNestedValue(value, level);
    return getRow(key, operator, formattedValue, level);
  }

  if (_.isPlainObject(value)) {
    const rows = Object
      .keys(value)
      .map((childKey) => formatValue(childKey, types.unchanged, value[childKey], level + 1));
    const formattedValue = formatNestedValue(rows, level);
    return getRow(key, operator, formattedValue, level);
  }

  return getRow(key, operator, value, level);
}

function formatDiff(diff, level) {
  const {
    key, operator, value, prevValue,
  } = diff;

  switch (operator) {
    case types.added:
    case types.removed:
    case types.unchanged: {
      return formatValue(key, operator, value, level);
    }
    case types.updated:
      return [
        formatDiff({ key, operator: types.removed, value: prevValue }, level),
        formatDiff({ key, operator: types.added, value }, level),
      ].join('\n');
    case types.nested: {
      const diffs = Object.values(value)
        .map((childDiff) => formatDiff(childDiff, level + 1));

      return formatValue(key, operator, diffs, level);
    }
    default:
      throw new Error(`non supported operator ${operator}`);
  }
}

export default function stylishFormatter(diffs) {
  const rows = diffs.map((diff) => formatDiff(diff, 1));
  return formatNestedValue(rows, 0);
}
